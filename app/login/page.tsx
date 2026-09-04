import { login } from '../auth/actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-screen">
      <form className="flex-1 flex flex-col w-full justify-center gap-4 text-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-blue-600 mb-2 tracking-tight">Reflex</h1>
          <p className="text-gray-500">Sign in to coordinate deliveries</p>
        </div>
        
        {message && (
          <p className="bg-red-50 text-red-600 p-4 text-center text-sm rounded-md font-medium border border-red-200">
            {message}
          </p>
        )}

        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-2"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-4"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        
        <button
          formAction={login}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-foreground mb-2 font-medium"
        >
          Sign In
        </button>
        <div className="text-sm text-center mt-4 text-gray-500">
          Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
        </div>
      </form>
    </div>
  )
}
