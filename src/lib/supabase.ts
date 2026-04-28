import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !anonKey) {
  console.warn(
    'Supabase env vars missing. VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env.local for local dev or Vercel env vars for production.'
  )
}

export const supabase = createClient(url ?? '', anonKey ?? '', {
  auth: { persistSession: false },
})
