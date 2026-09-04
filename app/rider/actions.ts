"use server";

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateDeliveryStatus(formData: FormData) {
  const supabase = await createClient()
  
  const deliveryId = formData.get('delivery_id') as string
  const status = formData.get('status') as string

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !deliveryId || !status) return

  const { error } = await supabase
    .from('deliveries')
    .update({ status })
    .eq('id', deliveryId)
    .eq('assigned_rider_id', user.id)

  if (error) {
    console.error('Error updating status:', error)
    throw new Error('Failed to update status')
  }

  revalidatePath('/rider')
}

export async function confirmDelivery(code: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated' }

  // Find a delivery assigned to this rider that is Picked Up and matches the code
  const { data: deliveries, error } = await supabase
    .from('deliveries')
    .select('id')
    .eq('assigned_rider_id', user.id)
    .eq('status', 'Picked Up')
    .eq('confirmation_code', code)

  if (error || !deliveries || deliveries.length === 0) {
    return { success: false, error: 'Invalid or unrecognized QR code.' }
  }

  // Update status to Delivered
  const { error: updateError } = await supabase
    .from('deliveries')
    .update({ status: 'Delivered' })
    .eq('id', deliveries[0].id)

  if (updateError) {
    return { success: false, error: 'Failed to update delivery.' }
  }

  revalidatePath('/rider')
  return { success: true }
}
