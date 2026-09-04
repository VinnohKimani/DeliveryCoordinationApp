"use server";

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createDelivery(formData: FormData) {
  console.log('createDelivery action called with:', Object.fromEntries(formData.entries()))
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.error('No user found in session')
    throw new Error('Not authenticated')
  }

  // Generate a random 6-character confirmation code
  const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase()
  console.log('Generated confirmation code:', confirmationCode)

  const { data, error } = await supabase.from('deliveries').insert({
    retailer_id: user.id,
    customer_name: formData.get('customer_name'),
    customer_phone: formData.get('customer_phone'),
    address: formData.get('address'),
    item_description: formData.get('item_description'),
    confirmation_code: confirmationCode,
  }).select()

  if (error) {
    console.error('Error creating delivery in Supabase:', error)
    throw new Error('Failed to create delivery: ' + error.message)
  }

  console.log('Delivery created successfully:', data)
  revalidatePath('/retailer')
}
