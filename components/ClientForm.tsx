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
    const toastId = toast.loading(loadingMessage)
    
    try {
      await action(formData)
      toast.success(successMessage, { id: toastId })
      ref.current?.reset()
    } catch (e: any) {
      if (e.message === 'NEXT_REDIRECT') {
        // If the action redirects, we treat it as a success and let Next.js handle the navigation
        toast.success(successMessage, { id: toastId })
        throw e;
      } else {
        toast.error(e.message || 'An error occurred', { id: toastId })
      }
    }
  }

  return (
    <form ref={ref} action={handleSubmit} {...props}>
      {children}
    </form>
  )
}
