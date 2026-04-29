import { useEffect, useState } from 'react'
import { profileService } from './profileService'

export function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await profileService.getOrders()
        setOrders(data)
      } catch (err) {
        console.error('Failed to fetch orders', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) return <div className="p-8 text-center">Chargement de vos commandes...</div>

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-gray-800 mb-2">Vous n'avez pas encore de commandes</h2>
        <p className="text-gray-500">Commencez vos achats dès maintenant.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Historique de commandes</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
              <div>
                <p className="font-semibold text-lg">Commande #{order.id}</p>
                <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status === 'pending' ? 'En attente' : order.status}
                </span>
                <p className="font-bold text-[#FF6B00] mt-2">{Number(order.total_price).toLocaleString()} FCFA</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    {item.product?.images?.[0] ? (
                      <img src={`http://localhost:8000/storage/${item.product.images[0].image_path}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">IMG</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 line-clamp-1">{item.product?.name}</p>
                    <p className="text-sm text-gray-500">Qté: {item.quantity}</p>
                  </div>
                  <div className="font-medium text-gray-700">
                    {Number(item.price).toLocaleString()} FCFA
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
