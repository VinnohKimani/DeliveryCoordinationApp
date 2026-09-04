import { createClient } from '@/lib/supabase/server'
import { signOut } from '../actions'
import { assignRider } from './actions'
import RealtimeSubscriber from '@/components/RealtimeSubscriber'
import { LayoutDashboard, Users, LogOut, Truck, Clock, MapPin, Package, CheckCircle, UserPlus } from 'lucide-react'

export default async function DispatcherPage() {
  const supabase = await createClient()

  const { data: deliveries } = await supabase
    .from('deliveries')
    .select('*, retailer:retailer_id(name)')
    .order('created_at', { ascending: false })

  const { data: riders } = await supabase
    .from('users')
    .select('id, name')
    .eq('role', 'rider')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Reflex <span className="text-gray-400 font-medium">| Dispatcher</span></h1>
        </div>
        <form action={signOut}>
          <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-8">
        <RealtimeSubscriber />
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Truck className="w-6 h-6 text-indigo-600" />
          Fleet Overview
        </h2>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {deliveries?.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                <Truck className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700">No deliveries in system</h3>
              <p className="text-slate-500 mt-1">Retailers haven't requested any deliveries yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Delivery Details</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Destination</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Status</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Rider Assignment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deliveries?.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-50 p-2 rounded-lg shrink-0">
                            <Package className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{d.customer_name}</div>
                            <div className="text-slate-500 text-xs font-medium flex items-center gap-1 mt-0.5">
                              <Users className="w-3 h-3" />
                              {d.retailer?.name || 'Unknown Retailer'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-start gap-2 max-w-xs">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-600 leading-snug">{d.address}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          d.status === 'Requested' ? 'bg-yellow-100 text-yellow-700' :
                          d.status === 'Assigned' ? 'bg-blue-100 text-blue-700' :
                          d.status === 'Picked Up' ? 'bg-purple-100 text-purple-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {d.status === 'Requested' && <Clock className="w-3 h-3" />}
                          {d.status === 'Assigned' && <Truck className="w-3 h-3" />}
                          {d.status === 'Picked Up' && <Package className="w-3 h-3" />}
                          {d.status === 'Delivered' && <CheckCircle className="w-3 h-3" />}
                          {d.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {d.status === 'Requested' ? (
                          <form action={assignRider} className="flex gap-2 items-center">
                            <input type="hidden" name="delivery_id" value={d.id} />
                            <div className="relative flex-1 max-w-[200px]">
                              <Users className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                              <select name="rider_id" className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer" required>
                                <option value="" disabled selected>Select rider...</option>
                                {riders?.map(r => (
                                  <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                              </select>
                            </div>
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all flex items-center gap-1">
                              <UserPlus className="w-4 h-4" />
                              Assign
                            </button>
                          </form>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-sm font-medium border border-slate-200">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            Already Assigned
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
