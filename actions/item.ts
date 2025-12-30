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

    const { error } = await supabase
        .from('timeline_items')
        .insert({
            trip_id: tripId,
            type: 'PHOTO',
            time,
            memo, // Use memo as caption
            photo_path: photoPath,
            created_by: user.id
        })

    if (error) {
        console.error('Error adding photo:', error)
        throw new Error('Failed to add photo')
    }
}

export async function toggleComplete(itemId: string, isCompleted: boolean) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('timeline_items')
        .update({ is_completed: isCompleted })
        .eq('id', itemId)

    if (error) throw new Error('Failed to update status')
}
