import { createClient } from '@/lib/supabase/server'
import { createDelivery } from './actions'
import { signOut } from '../actions'

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
    <div className="min-h-screen bg-gray-50 text-foreground">
      <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Reflex - Retailer</h1>
        <form action={signOut}>
          <button className="text-sm text-gray-600 hover:text-black">Sign Out</button>
        </form>
      </header>

      <main className="max-w-5xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">New Delivery</h2>
            <form action={createDelivery} className="flex flex-col gap-3">
              <input name="customer_name" placeholder="Customer Name" required className="border p-2 rounded" />
              <input name="customer_phone" placeholder="Customer Phone" required className="border p-2 rounded" />
              <textarea name="address" placeholder="Delivery Address" required className="border p-2 rounded" />
              <textarea name="item_description" placeholder="Item Description" required className="border p-2 rounded" />
              <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium mt-2">
                Create Request
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Your Deliveries</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {deliveries?.length === 0 ? (
              <p className="p-6 text-gray-500">No deliveries requested yet.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-4 font-semibold text-sm">Customer</th>
                    <th className="p-4 font-semibold text-sm">Address</th>
                    <th className="p-4 font-semibold text-sm">Item</th>
                    <th className="p-4 font-semibold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {deliveries?.map((d) => (
                    <tr key={d.id}>
                      <td className="p-4 text-sm">
                        <div className="font-medium">{d.customer_name}</div>
                        <div className="text-gray-500">{d.customer_phone}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{d.address}</td>
                      <td className="p-4 text-sm text-gray-600">{d.item_description}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          d.status === 'Requested' ? 'bg-yellow-100 text-yellow-800' :
                          d.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                          d.status === 'Picked Up' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
