import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const email = `test_retailer_${Date.now()}@test.com`
  console.log('Signing up with', email)
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password: 'password123',
    options: {
      data: {
        name: 'Test Retailer',
        phone: '+123',
        role: 'retailer'
      }
    }
  })

  if (signUpError) {
    console.error('Sign up error:', signUpError)
    return
  }
  
  console.log('User signed up:', signUpData.user.id)
  
  // Try inserting delivery
  const { data: insertData, error: insertError } = await supabase.from('deliveries').insert({
    retailer_id: signUpData.user.id,
    customer_name: 'Customer test',
    customer_phone: '+12345',
    address: 'Addr',
    item_description: 'Item',
    confirmation_code: '123'
  }).select()
  
  if (insertError) {
    console.error('Insert error:', insertError)
  } else {
    console.log('Insert success:', insertData)
  }
}
run()
