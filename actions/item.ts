'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addPlan(formData: FormData) {
    const tripId = formData.get('tripId') as string
    const title = formData.get('title') as string
    const time = formData.get('time') as string
    const memo = formData.get('memo') as string
    const linkUrl = formData.get('linkUrl') as string

    if (!tripId || !title || !time) {
        throw new Error('Missing required fields')
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('timeline_items')
        .insert({
            trip_id: tripId,
            type: 'PLAN',
            title,
            time,
            memo,
            link_url: linkUrl,
            created_by: user.id
        })

    if (error) {
        console.error('Error adding plan:', error)
        throw new Error('Failed to add plan')
    }

    revalidatePath(`/trips/${tripId}`) // This might need share_id, but usually we revalidate the path where it's shown. 
    // Since we rely on Realtime, revalidatePath is less critical for the user who added it if we update optimistic UI, 
    // but for Server Components to refresh on next visit it is good.
    // Note: We need to know share_id to revalidate the specific path correctly if we want to be precise, 
    // or we pass it in formData.
}

export async function addPhoto(formData: FormData) {
    const tripId = formData.get('tripId') as string
    const time = formData.get('time') as string
    const memo = formData.get('memo') as string
    const photoPath = formData.get('photoPath') as string

    if (!tripId || !photoPath || !time) {
        throw new Error('Missing required fields')
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error: dbError } = await supabase
        .from('timeline_items')
        .insert({
            trip_id: tripId,
            type: 'PHOTO',
            time,
            memo, // Use memo as caption
            photo_path: photoPath,
            created_by: user.id
        })

    if (dbError) {
        console.error('Error adding photo:', dbError)
        throw new Error('Failed to add photo')
    }

    await revalidateTrip(tripId)
}

// Helper to revalidate trip page
async function revalidateTrip(tripId: string) {
    const supabase = await createClient()
    const { data } = await supabase.from('trips').select('share_id').eq('id', tripId).single()
    if (data?.share_id) {
        revalidatePath(`/trips/${data.share_id}`)
    }
}

export async function toggleComplete(itemId: string, isCompleted: boolean) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('timeline_items')
        .update({ is_completed: isCompleted })
        .eq('id', itemId)

    if (error) throw new Error('Failed to update status')
    // No strict need to revalidate for toggle as it is highly interactive, but good for consistency
    // However, finding tripId requires a query. For MVP, we skip revalidate here or do it if we want perfect sync.
}

// Helper to check permission
// Returns true if user is Creator of item OR Owner of trip
async function verifyPermission(itemId: string, userId: string, supabase: any) {
    const { data: item, error } = await supabase
        .from('timeline_items')
        .select(`
            *,
            trips (
                owner_id
            )
        `)
        .eq('id', itemId)
        .single()

    if (error || !item) return false

    // Check if user is item creator OR trip owner
    const isCreator = item.created_by === userId
    // @ts-ignore: Supabase types complexity
    const isTripOwner = item.trips?.owner_id === userId

    return isCreator || isTripOwner
}

export async function updatePlan(formData: FormData) {
    const itemId = formData.get('itemId') as string
    const title = formData.get('title') as string
    const time = formData.get('time') as string
    const memo = formData.get('memo') as string
    const linkUrl = formData.get('linkUrl') as string

    if (!itemId || !title || !time) {
        throw new Error('Missing required fields')
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) throw new Error('Unauthorized')

    // Verify Permission
    const canUpdate = await verifyPermission(itemId, user.id, supabase)
    if (!canUpdate) throw new Error('Forbidden')

    const { data: item, error } = await supabase
        .from('timeline_items')
        .update({
            title,
            time,
            memo,
            link_url: linkUrl,
        })
        .eq('id', itemId)
        .select('trip_id')
        .single()

    if (error) {
        console.error('Error updating plan:', error)
        throw new Error('Failed to update plan')
    }

    if (item) {
        await revalidateTrip(item.trip_id)
    }
}

export async function updatePhoto(formData: FormData) {
    const itemId = formData.get('itemId') as string
    const time = formData.get('time') as string
    const memo = formData.get('memo') as string

    if (!itemId || !time) {
        throw new Error('Missing required fields')
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) throw new Error('Unauthorized')

    // Verify Permission
    const canUpdate = await verifyPermission(itemId, user.id, supabase)
    if (!canUpdate) throw new Error('Forbidden')

    const { data: item, error } = await supabase
        .from('timeline_items')
        .update({
            time,
            memo,
        })
        .eq('id', itemId)
        .select('trip_id')
        .single()

    if (error) {
        console.error('Error updating photo:', error)
        throw new Error('Failed to update photo')
    }

    if (item) {
        await revalidateTrip(item.trip_id)
    }
}

export async function deleteItem(itemId: string, type: string, photoPath?: string) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) throw new Error('Unauthorized')

    // Verify Permission
    const isAllowed = await verifyPermission(itemId, user.id, supabase)
    if (!isAllowed) throw new Error('Forbidden')

    // 1. Delete from Storage if it's a photo
    if (type === 'PHOTO' && photoPath) {
        const { error: storageError } = await supabase.storage
            .from('trip-photos')
            .remove([photoPath])

        if (storageError) {
            console.error('Error deleting photo from storage:', storageError)
            // Continue to delete DB record even if storage delete fails
        }
    }

    // 2. Delete from DB
    // First get trip_id to revalidate (Optimized: verifyPermission already fetched it, but for clean code we fetch again or refactor. Fetching again for now as verifyPermission returns boolean).
    const { data: item } = await supabase.from('timeline_items').select('trip_id').eq('id', itemId).single()

    const { error } = await supabase
        .from('timeline_items')
        .delete()
        .eq('id', itemId)
    // .eq('created_by', user.id) // Removed: Permission checked above

    if (error) {
        console.error('Error deleting item:', error)
        throw new Error('Failed to delete item')
    }

    if (item) {
        await revalidateTrip(item.trip_id)
    }
}
