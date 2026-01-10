'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createTrip(formData: FormData) {
    const title = formData.get('title') as string
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string

    if (!title) {
        throw new Error('Title is required')
    }

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error('Unauthorized')
    }

    // Insert trip
    const { data, error } = await supabase
        .from('trips')
        .insert({
            title,
            start_date: startDate ? startDate : null,
            end_date: endDate ? endDate : null,
            owner_id: user.id
        })
        .select('share_id')
        .single()

    if (error) {
        console.error('Error creating trip:', error)
        throw new Error('Failed to create trip')
    }

    redirect(`/trips/${data.share_id}`)
}

export async function updateTrip(formData: FormData) {
    const shareId = formData.get('shareId') as string
    const title = formData.get('title') as string
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string

    if (!shareId || !title) {
        throw new Error('Missing required fields')
    }

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error('Unauthorized')
    }

    // Update trip
    const { error } = await supabase
        .from('trips')
        .update({
            title,
            start_date: startDate ? startDate : null,
            end_date: endDate ? endDate : null
        })
        .eq('share_id', shareId)
        .eq('owner_id', user.id) // Security check: must be owner

    if (error) {
        console.error('Error updating trip:', error)
        throw new Error('Failed to update trip')
    }

    redirect(`/trips/${shareId}`)
}

export async function deleteTrip(formData: FormData) {
    const shareId = formData.get('shareId') as string

    if (!shareId) {
        throw new Error('Missing shareId')
    }

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error('Unauthorized')
    }

    // Delete trip
    const { error } = await supabase
        .from('trips')
        .delete()
        .eq('share_id', shareId)
        .eq('owner_id', user.id) // Security check: must be owner

    if (error) {
        console.error('Error deleting trip:', error)
        throw new Error('Failed to delete trip')
    }

    redirect('/dashboard')
}
