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
