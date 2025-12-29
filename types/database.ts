export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            trips: {
                Row: {
                    id: string
                    title: string
                    start_date: string | null
                    end_date: string | null
                    share_id: string
                    owner_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    start_date?: string | null
                    end_date?: string | null
                    share_id?: string
                    owner_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    start_date?: string | null
                    end_date?: string | null
                    share_id?: string
                    owner_id?: string
                    created_at?: string
                }
            }
            timeline_items: {
                Row: {
                    id: string
                    trip_id: string
                    type: 'PLAN' | 'PHOTO'
                    title: string | null
                    time: string
                    memo: string | null
                    link_url: string | null
                    is_completed: boolean | null
                    photo_path: string | null
                    created_by: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    trip_id: string
                    type: 'PLAN' | 'PHOTO'
                    title?: string | null
                    time: string
                    memo?: string | null
                    link_url?: string | null
                    is_completed?: boolean | null
                    photo_path?: string | null
                    created_by: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    trip_id?: string
                    type?: 'PLAN' | 'PHOTO'
                    title?: string | null
                    time?: string
                    memo?: string | null
                    link_url?: string | null
                    is_completed?: boolean | null
                    photo_path?: string | null
                    created_by?: string
                    created_at?: string
                }
            }
        }
    }
}
