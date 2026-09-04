import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'retailer2@test.com',
    password: 'password'
  })
  if (error) {
    console.error('Auth error:', error.message)
    return
  }
  console.log('Logged in as:', data.user.id)
  
  const { data: insertData, error: insertError } = await supabase.from('deliveries').insert({
    retailer_id: data.user.id,
    customer_name: 'Test Customer',
    customer_phone: '+1234567890',
    address: 'Test Address',
    item_description: 'Test Item',
    confirmation_code: '123456',
  }).select()
  
  if (insertError) {
    console.error('Insert error:', insertError)
  } else {
    console.log('Insert success:', insertData)
  }
}
run()
