import { createClient } from '@/lib/supabase/server'
import { createDelivery } from './actions'
import { signOut } from '../actions'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import RealtimeSubscriber from '@/components/RealtimeSubscriber'
import { Package, User, MapPin, FileText, CheckCircle, Clock, Truck, UserCircle, LogOut } from 'lucide-react'

export default async function RetailerPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: deliveries } = await supabase
    .from('deliveries')
    .select('*')
    .eq('retailer_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Package className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Reflex <span className="text-gray-400 font-medium">| Retailer</span></h1>
        </div>
        <form action={signOut}>
          <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RealtimeSubscriber />
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 p-1.5 rounded-md">
                <Truck className="w-5 h-5" />
              </span>
              New Delivery
            </h2>
            <form action={createDelivery} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-600 mb-1 block">Customer Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input name="customer_name" placeholder="e.g. John Doe" required className="pl-10 w-full border-slate-200 border p-2.5 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-slate-600 mb-1 block">Phone Number</label>
                <div className="relative">
                  <UserCircle className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input name="customer_phone" placeholder="e.g. +254..." required className="pl-10 w-full border-slate-200 border p-2.5 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600 mb-1 block">Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <textarea name="address" placeholder="Delivery Address" required className="pl-10 w-full border-slate-200 border p-2.5 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[80px]" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600 mb-1 block">Item Description</label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <textarea name="item_description" placeholder="What are you sending?" required className="pl-10 w-full border-slate-200 border p-2.5 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[80px]" />
                </div>
              </div>
              
              <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 font-semibold shadow-md shadow-blue-200 hover:shadow-lg transition-all mt-2">
                Create Request
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Your Deliveries
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {deliveries?.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <Package className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700">No deliveries yet</h3>
                <p className="text-slate-500 mt-1 max-w-sm">Create your first delivery request using the form to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-0">
                {deliveries?.map((d) => (
                  <div key={d.id} className="p-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6 justify-between items-start">
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{d.customer_name}</h3>
                          <p className="text-slate-500 text-sm font-medium">{d.customer_phone}</p>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase  flex items-center gap-1.5 ${
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
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-400 font-semibold uppercase  mb-1">Destination</p>
                          <p className="text-sm text-slate-700">{d.address}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-400 font-semibold uppercase  mb-1">Item Details</p>
                          <p className="text-sm text-slate-700">{d.item_description}</p>
                        </div>
                      </div>
                    </div>
                    
                    {d.status !== 'Delivered' && (
                      <div className="shrink-0 bg-white p-2 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
                        <QRCodeDisplay code={d.confirmation_code} />
                        <span className="text-[10px] text-slate-400 font-medium uppercase mt-2">Scan to confirm</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
