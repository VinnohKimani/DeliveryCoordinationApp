import { redirect } from 'next/navigation'

export default function Home() {
  // Middleware handles auth redirects.
  // If we reach here, we are not logged in.
  redirect('/login')
}
