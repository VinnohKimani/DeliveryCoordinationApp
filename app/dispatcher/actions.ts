"use server";

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function assignRider(formData: FormData) {
  const supabase = await createClient()
  
  const deliveryId = formData.get('delivery_id') as string
  const riderId = formData.get('rider_id') as string

  if (!riderId) return

  const { error } = await supabase
    .from('deliveries')
    .update({ assigned_rider_id: riderId, status: 'Assigned' })
    .eq('id', deliveryId)

  if (error) {
    console.error('Error assigning rider:', error)
    throw new Error('Failed to assign rider')
  }

  revalidatePath('/dispatcher')
}
