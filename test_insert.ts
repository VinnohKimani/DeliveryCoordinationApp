import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function test() {
  // Login as a test user
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'test@test.com',
    password: 'password'
  })
  
  if (authErr) {
    console.error('Auth error:', authErr.message)
    return
  }
  
  const user = authData.user
  console.log('Logged in as:', user.id)

  const { data, error } = await supabase.from('deliveries').insert({
    retailer_id: user.id,
    customer_name: 'Test Customer',
    customer_phone: '+1234567890',
    address: 'Test Address',
    item_description: 'Test Item',
    confirmation_code: '123456',
  }).select()

  if (error) {
    console.error('Insert error:', error)
  } else {
    console.log('Insert success:', data)
  }
}

test()
