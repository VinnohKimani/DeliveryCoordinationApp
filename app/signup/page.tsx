import { signup } from '../auth/actions'
import { ClientForm } from '@/components/ClientForm'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:flex-none lg:w-[500px] xl:w-[600px] bg-white shadow-2xl z-10 relative overflow-y-auto py-8">
        <div className="mx-auto w-full max-w-sm lg:max-w-md my-auto">
          <div className="text-center mb-8">
            <img src="/logo.jpg" alt="Reflex Logo" className="w-16 h-16 mx-auto rounded-2xl shadow-sm mb-4 border border-slate-100" />
            <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">Create Account</h1>
            <p className="text-slate-500 font-medium">Join Reflex logistics network</p>
          </div>
          
          <ClientForm action={signup} successMessage="Creating account..." className="flex flex-col gap-4 text-slate-800">
            {message && (
              <p className="bg-red-50 text-red-600 p-4 text-center text-sm rounded-xl font-bold border border-red-200 shadow-sm mb-2">
                {message}
              </p>
            )}

            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1.5" htmlFor="name">Full Name</label>
              <input className="w-full rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 mb-1 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" name="name" placeholder="Jane Doe" required />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1.5" htmlFor="phone">Phone Number</label>
              <input className="w-full rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 mb-1 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" name="phone" placeholder="+254..." required />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1.5" htmlFor="email">Email</label>
              <input className="w-full rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 mb-1 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" name="email" placeholder="you@example.com" required />
            </div>
            
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1.5" htmlFor="password">Password</label>
              <input className="w-full rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 mb-1 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" type="password" name="password" placeholder="••••••••" required />
            </div>
            
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1.5" htmlFor="role">Role</label>
              <select className="w-full rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 mb-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium cursor-pointer" name="role" required defaultValue="retailer">
                <option value="retailer">Retailer (Send Packages)</option>
                <option value="dispatcher">Dispatcher (Manage Fleet)</option>
                <option value="rider">Rider (Deliver Packages)</option>
              </select>
            </div>
            
            <button
              className="w-full bg-slate-900 hover:bg-black text-white rounded-xl px-4 py-3 font-bold shadow-md shadow-slate-200 transition-all active:scale-[0.98]"
            >
              Sign Up
            </button>

            <div className="text-sm font-medium text-center mt-4 text-slate-500">
              Already have an account? <a href="/login" className="text-blue-600 hover:text-blue-700 hover:underline">Log in</a>
            </div>
          </ClientForm>
        </div>
      </div>

      {/* Right side: Hero Image */}
      <div className="hidden lg:flex flex-1 relative bg-slate-100 overflow-hidden items-center justify-center border-l border-slate-200">
        <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply z-10" />
        <img 
          src="/hero.jpg" 
          alt="Delivery Logistics Hero" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </div>
    </div>
  )
}
