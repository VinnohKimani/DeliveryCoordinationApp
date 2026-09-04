import { createClient } from '@/lib/supabase/server'
import { signOut } from '../actions'
import { updateDeliveryStatus } from './actions'
import RealtimeSubscriber from '@/components/RealtimeSubscriber'
import QRScanner from '@/components/QRScanner'
import { ClientForm } from '@/components/ClientForm'
import { Bike, LogOut, MapPin, Phone, Package, CheckCircle, Clock, Truck, QrCode } from 'lucide-react'

export default async function RiderPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: deliveries } = await supabase
    .from('deliveries')
    .select('*, retailer:retailer_id(name, phone)')
    .eq('assigned_rider_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      <header className="bg-white border-b px-4 sm:px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <Bike className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Reflex <span className="text-gray-400 font-medium">| Rider</span></h1>
        </div>
        <form action={signOut}>
          <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors">
            <LogOut className="w-4 h-4 hidden sm:block" />
            Sign Out
          </button>
        </form>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-8">
        <RealtimeSubscriber />
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-emerald-600" />
          Your Active Deliveries
        </h2>
        
        <div className="bg-transparent">
          {deliveries?.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center flex flex-col items-center">
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                <Bike className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700">No deliveries assigned</h3>
              <p className="text-slate-500 mt-1 max-w-sm">Take a break! You'll see new deliveries here when dispatch assigns them to you.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {deliveries?.map((d) => (
                <div key={d.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col sm:flex-row relative">
                  
                  {/* Status Indicator Strip */}
                  <div className={`w-2 shrink-0 ${
                    d.status === 'Assigned' ? 'bg-blue-500' :
                    d.status === 'Picked Up' ? 'bg-purple-500' :
                    'bg-emerald-500'
                  }`} />

                  <div className="p-6 flex-1 flex flex-col sm:flex-row gap-6 justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{d.customer_name}</h3>
                          <div className="flex items-center gap-1.5 text-slate-500 font-medium mt-1">
                            <Phone className="w-4 h-4" />
                            {d.customer_phone}
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase  ${
                          d.status === 'Assigned' ? 'bg-blue-100 text-blue-700' :
                          d.status === 'Picked Up' ? 'bg-purple-100 text-purple-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {d.status === 'Assigned' && <Truck className="w-3 h-3" />}
                          {d.status === 'Picked Up' && <Package className="w-3 h-3" />}
                          {d.status === 'Delivered' && <CheckCircle className="w-3 h-3" />}
                          {d.status}
                        </span>
                      </div>
                      
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4 flex gap-3">
                        <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase  mb-0.5">Drop-off Location</p>
                          <p className="text-slate-800 font-medium">{d.address}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase  mb-1">Item Details</p>
                          <p className="text-sm text-slate-700">{d.item_description}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase  mb-1">Pickup From</p>
                          <p className="text-sm text-slate-700 font-medium">{d.retailer?.name}</p>
                          <p className="text-xs text-slate-500">{d.retailer?.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="sm:w-64 shrink-0 flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-6 sm:pt-0 sm:pl-6">
                      {d.status === 'Assigned' && (
                        <ClientForm action={updateDeliveryStatus} successMessage="Pickup confirmed!" className="h-full flex flex-col justify-center">
                          <input type="hidden" name="delivery_id" value={d.id} />
                          <input type="hidden" name="status" value="Picked Up" />
                          <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm font-medium text-center mb-4 border border-blue-100">
                            Go to {d.retailer?.name} to pick up this package.
                          </div>
                          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                            Confirm Pickup
                          </button>
                        </ClientForm>
                      )}
                      
                      {d.status === 'Picked Up' && (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                          <div className="text-center w-full bg-purple-50 p-3 rounded-xl border border-purple-100 mb-2">
                            <p className="text-xs font-bold text-purple-600 uppercase  mb-1 flex items-center justify-center gap-1">
                              <QrCode className="w-3 h-3" />
                              Delivery Proof
                            </p>
                            <p className="text-xs text-purple-700 font-medium">Scan the customer's QR code to mark as delivered.</p>
                          </div>
                          <div className="w-full max-w-[200px] aspect-square relative rounded-2xl overflow-hidden shadow-inner border border-slate-200">
                            <QRScanner />
                          </div>
                        </div>
                      )}

                      {d.status === 'Delivered' && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <CheckCircle className="w-12 h-12 text-emerald-500 mb-2" />
                          <p className="font-bold text-emerald-700">Delivery Complete</p>
                          <p className="text-xs text-emerald-600 mt-1">Great job!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
