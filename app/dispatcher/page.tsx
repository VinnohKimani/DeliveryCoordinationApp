import { createClient } from '@/lib/supabase/server'
import { signOut } from '../actions'
import { assignRider } from './actions'

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
    <div className="min-h-screen bg-gray-50 text-foreground">
      <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Reflex - Dispatcher</h1>
        <form action={signOut}>
          <button className="text-sm text-gray-600 hover:text-black">Sign Out</button>
        </form>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        <h2 className="text-xl font-bold mb-4">All Deliveries</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {deliveries?.length === 0 ? (
            <p className="p-6 text-gray-500">No deliveries found.</p>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-4 font-semibold text-sm">Customer / Retailer</th>
                  <th className="p-4 font-semibold text-sm">Address</th>
                  <th className="p-4 font-semibold text-sm">Status</th>
                  <th className="p-4 font-semibold text-sm">Assign Rider</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {deliveries?.map((d) => (
                  <tr key={d.id}>
                    <td className="p-4 text-sm">
                      <div className="font-medium">{d.customer_name}</div>
                      <div className="text-gray-500 text-xs">Retailer: {d.retailer?.name || 'Unknown'}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{d.address}</td>
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
                    <td className="p-4 text-sm">
                      {d.status === 'Requested' ? (
                        <form action={assignRider} className="flex gap-2 items-center">
                          <input type="hidden" name="delivery_id" value={d.id} />
                          <select name="rider_id" className="border p-1 rounded bg-inherit" required>
                            <option value="">Select a rider...</option>
                            {riders?.map(r => (
                              <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                          </select>
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                            Assign
                          </button>
                        </form>
                      ) : (
                        <div className="text-gray-500 text-xs italic">
                          Assigned
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
