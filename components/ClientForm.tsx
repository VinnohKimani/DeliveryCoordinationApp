"use client"

import { toast } from 'react-hot-toast'
import { useRef } from 'react'

interface ClientFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  action: (data: FormData) => Promise<void>
  successMessage: string
  loadingMessage?: string
}

export function ClientForm({ action, successMessage, loadingMessage = "Processing...", children, ...props }: ClientFormProps) {
  const ref = useRef<HTMLFormElement>(null)
  
  async function handleSubmit(formData: FormData) {
    const promise = action(formData)
    
    toast.promise(promise, {
      loading: loadingMessage,
      success: successMessage,
      error: (err: any) => err.message || 'An error occurred',
    })
    
    try {
      await promise
      // Reset the form if the submission was successful
      ref.current?.reset()
    } catch (e) {
      // The error is handled and displayed by toast.promise
    }
  }

  return (
    <form ref={ref} action={handleSubmit} {...props}>
      {children}
    </form>
  )
}
