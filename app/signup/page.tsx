import { signup } from '../auth/actions'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-screen">
      <form className="flex-1 flex flex-col w-full justify-center gap-4 text-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-green-600 mb-2 tracking-tight">Reflex</h1>
          <p className="text-gray-500">Create your account</p>
        </div>
        
        {message && (
          <p className="bg-red-50 text-red-600 p-4 text-center text-sm rounded-md font-medium border border-red-200">
            {message}
          </p>
        )}

        <label className="text-md" htmlFor="name">Full Name</label>
        <input className="rounded-md px-4 py-2 bg-inherit border mb-2" name="name" placeholder="Jane Doe" required />

        <label className="text-md" htmlFor="phone">Phone Number</label>
        <input className="rounded-md px-4 py-2 bg-inherit border mb-2" name="phone" placeholder="+254..." required />

        <label className="text-md" htmlFor="email">Email</label>
        <input className="rounded-md px-4 py-2 bg-inherit border mb-2" name="email" placeholder="you@example.com" required />
        
        <label className="text-md" htmlFor="password">Password</label>
        <input className="rounded-md px-4 py-2 bg-inherit border mb-2" type="password" name="password" placeholder="••••••••" required />
        
        <label className="text-md" htmlFor="role">Role</label>
        <select className="rounded-md px-4 py-2 bg-inherit border mb-4" name="role" required defaultValue="retailer">
          <option value="retailer">Retailer</option>
          <option value="dispatcher">Dispatcher</option>
          <option value="rider">Rider</option>
        </select>
        
        <button
          formAction={signup}
          className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 text-foreground mb-2 font-medium"
        >
          Sign Up
        </button>

        <div className="text-sm text-center mt-4 text-gray-500">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in</a>
        </div>
      </form>
    </div>
  )
}
