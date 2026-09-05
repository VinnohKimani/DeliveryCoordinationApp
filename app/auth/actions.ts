"use server";

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    throw new Error('Could not authenticate user')
  }

  // Redirect to a role-based dashboard using middleware or just / 
  // Let middleware handle it
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        role: formData.get('role') as string,
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    throw new Error(`Could not create user: ${error.message}`)
  }

  redirect('/login?message=Check email to continue sign in process (or login if email confirmation is disabled)')
}
