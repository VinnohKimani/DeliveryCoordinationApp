import { createClient } from '@/lib/supabase/server'
import { signOut } from '../actions'
import { updateDeliveryStatus } from './actions'

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
    <div className="min-h-screen bg-gray-50 text-foreground">
      <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Reflex - Rider</h1>
        <form action={signOut}>
          <button className="text-sm text-gray-600 hover:text-black">Sign Out</button>
        </form>
      </header>

      <main className="max-w-4xl mx-auto p-8">
        <h2 className="text-xl font-bold mb-4">Your Assigned Deliveries</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {deliveries?.length === 0 ? (
            <p className="p-6 text-gray-500">No deliveries assigned to you yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {deliveries?.map((d) => (
                <div key={d.id} className="border rounded-lg p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{d.customer_name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        d.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                        d.status === 'Picked Up' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {d.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold">Customer Phone:</span> {d.customer_phone}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold">Address:</span> {d.address}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      <span className="font-semibold">Item:</span> {d.item_description}
                    </div>
                    <div className="text-xs text-gray-500 mb-4 border-t pt-2 mt-2">
                      <span className="font-semibold">Retailer:</span> {d.retailer?.name} ({d.retailer?.phone})
                    </div>
                  </div>

                  <div>
                    {d.status === 'Assigned' && (
                      <form action={updateDeliveryStatus}>
                        <input type="hidden" name="delivery_id" value={d.id} />
                        <input type="hidden" name="status" value="Picked Up" />
                        <button className="w-full bg-purple-600 text-white py-2 rounded font-medium hover:bg-purple-700">
                          Mark as Picked Up
                        </button>
                      </form>
                    )}
                    {d.status === 'Picked Up' && (
                      <div className="w-full bg-gray-200 text-gray-600 py-2 rounded font-medium text-center italic">
                        Scan QR code to deliver (Stage 7)
                      </div>
                    )}
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
