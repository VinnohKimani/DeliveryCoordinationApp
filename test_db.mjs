import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'retailer2@test.com',
    password: 'password' // We don't have the password, we can't fetch it easily.
  })
}
run()
