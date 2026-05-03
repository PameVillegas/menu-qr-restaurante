import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, LayoutGrid, 
  Package, Settings, LogOut, Clock, ShoppingBag, Eye, Download
} from 'lucide-react';
import { api } from '../services/api';
import { Category, Product } from '../types';

const RESTAURANT_ID = 1;
const RESTAURANT_SLUG = 'restaurante-sarmiento';
const ADMIN_PASSWORD = 'admin123';

interface Order {
  id: number;
  table_id: number;
  table_number: string;
  total: string;
  tip: string;
  status: string;
  created_at: string;
  items: any[];
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [restaurant, setRestaurant] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedAuth = localStorage.getItem('menuadmin_auth');
    if (savedAuth === 'true') {
      setIsLoggedIn(true);
      loadData();
    }
  }, []);

  const saveRestaurant = async () => {
    if (!restaurant) return;
    setSaving(true);
    setSaved(false);
    try {
      await api.restaurants.update(restaurant.id, {
        name: restaurant.name,
        description: restaurant.description,
        phone: restaurant.phone,
        address: restaurant.address,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      localStorage.setItem('menuadmin_auth', 'true');
      setLoginError('');
      loadData();
    } else {
      setLoginError('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('menuadmin_auth');
    navigate('/');
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const r = await api.restaurants.getBySlug(RESTAURANT_SLUG);
      setRestaurant(r);
      await loadCategories();
      await loadProducts();
      await loadOrders();
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const data = await api.orders.getByRestaurant(RESTAURANT_ID);
      setOrders(data);
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await api.categories.getByRestaurant(RESTAURANT_ID);
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await api.products.getByRestaurant(RESTAURANT_ID);
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await api.orders.updateStatus(orderId, status);
      loadOrders();
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const getTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-700',
      preparing: 'bg-blue-100 text-blue-700',
      ready: 'bg-green-100 text-green-700',
      served: 'bg-purple-100 text-purple-700',
      paid: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100';
  };

  const createCategory = async () => {
    const name = prompt('Nombre de la categoría:');
    if (!name) return;
    try {
      await api.categories.create({ restaurant_id: RESTAURANT_ID, name });
      loadCategories();
    } catch (err) {
      alert('Error al crear categoría');
    }
  };

  const createProduct = async () => {
    const name = prompt('Nombre del producto:');
    if (!name) return;
    const priceStr = prompt('Precio:');
    if (!priceStr) return;
    const price = parseFloat(priceStr);
    const categoryIdStr = prompt(`ID de categoría:\n${categories.map(c => `${c.id}: ${c.name}`).join('\n')}`);
    if (!categoryIdStr) return;
    const category_id = parseInt(categoryIdStr);
    try {
      await api.products.create({ category_id, restaurant_id: RESTAURANT_ID, name, price, is_available: true });
      loadProducts();
    } catch (err) {
      alert('Error al crear producto');
    }
  };

  const tabs = [
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
    { id: 'categories', label: 'Categorías', icon: LayoutGrid },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'qr', label: 'QR Codes', icon: LayoutGrid },
    { id: 'settings', label: 'Mi Restaurante', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/logosarmiento.jpeg" alt="Logo" className="w-20 h-20 rounded-full mx-auto mb-4" />
            <h1 className="text-2xl font-bold">MenuQR Admin</h1>
            <p className="text-gray-500">Ingresá tu contraseña</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full px-4 py-3 border rounded-xl pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Eye className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium"
            >
              Ingresar
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(/fondoclub.jpg)' }}>
      <div className="min-h-screen bg-black/40 backdrop-blur-sm">
      <header className="bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logosarmiento.jpeg" alt="Logo" className="w-10 h-10 rounded-full object-cover" />
            <span className="text-xl font-bold text-gray-900">{restaurant?.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/menu" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition">
              Ver Menú
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        <aside className="w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-4 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                {tab.id === 'orders' && orders.filter(o => o.status === 'pending').length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {orders.filter(o => o.status === 'pending').length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-6">
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Pedidos</h2>
              
              {orders.length === 0 ? (
                <p className="text-gray-500">No hay pedidos aún.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      className={`border rounded-xl p-4 transition-all ${
                        order.status === 'paid' 
                          ? 'border-gray-300 bg-gray-50/80 opacity-60' 
                          : order.status === 'cancelled'
                          ? 'border-red-300 bg-red-50/80 opacity-60'
                          : 'border-gray-200 bg-white/95'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className={order.status === 'paid' || order.status === 'cancelled' ? 'line-through' : ''}>
                          <span className="text-lg font-bold">Mesa {order.table_number}</span>
                          <span className="text-sm text-gray-500 ml-2 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {getTime(order.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status === 'pending' && 'Nuevo'}
                            {order.status === 'preparing' && 'Preparando'}
                            {order.status === 'ready' && 'Listo'}
                            {order.status === 'served' && 'Servido'}
                            {order.status === 'paid' && 'Pagado'}
                          </span>
                          <span className="font-bold text-emerald-600">
                            ${(Number(order.total) + Number(order.tip || 0)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      <div className={`text-sm text-gray-600 mb-3 ${order.status === 'paid' || order.status === 'cancelled' ? 'line-through' : ''}`}>
                        {order.items?.map((item: any) => (
                          <div key={item.id}>
                            {item.quantity}x {item.product_name} - ${item.subtotal}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                          >
                            Aceptar
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                          >
                            Listo
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'served')}
                            className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
                          >
                            Servido
                          </button>
                        )}
                        {order.status === 'served' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'paid')}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                          >
                            Cobrar
                          </button>
                        )}
                        {order.status !== 'cancelled' && order.status !== 'paid' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Categorías</h2>
                <button
                  onClick={createCategory}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                >
                  <Plus className="w-5 h-5" />
                  Nueva
                </button>
              </div>
              
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <button onClick={() => api.categories.delete(category.id).then(loadCategories)} className="p-2 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Productos</h2>
                <button
                  onClick={createProduct}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                >
                  <Plus className="w-5 h-5" />
                  Nuevo
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="p-4 rounded-lg border border-gray-200 flex justify-between">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <span className="text-emerald-600">${Number(product.price).toFixed(2)}</span>
                    </div>
                    <button onClick={() => api.products.delete(product.id).then(loadProducts)} className="p-2 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">QR para Imprimir</h2>
              <p className="text-gray-600 mb-6">
                Este código QR siempre lleva al menú. Imprimilo y pegalo en la puerta o entrada del restaurante.
              </p>
              
              <div className="bg-gray-100 rounded-xl p-8 text-center">
                <div className="bg-white p-8 inline-block rounded-xl mb-6 shadow-lg">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('http://localhost:5173/')}`} 
                    alt="QR Code" 
                    className="w-48 h-48 mx-auto"
                  />
                  <p className="text-emerald-600 font-mono text-lg font-bold mt-2">http://localhost:5173/</p>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Escaneá para ver el menú completo
                </p>
                <a 
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent('http://localhost:5173/')}`}
                  download="menu-qr.png"
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium flex items-center gap-2 mx-auto inline-block"
                >
                  <Download className="w-5 h-5" />
                  Descargar QR
                </a>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-4">QR por Mesa</h3>
                <p className="text-gray-600 mb-4">
                  Descargá el QR de cada mesa para que los clientes lo escaneen y ya tengan el número cargado.
                </p>
                <div className="grid grid-cols-5 gap-4">
                  {Array.from({length: 20}, (_, i) => i + 1).map((n) => (
                    <div key={n} className="bg-gray-100 rounded-xl p-4 text-center">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`http://localhost:5173/menu/${n}`)}`}
                        alt={`Mesa ${n}`}
                        className="w-16 h-16 mx-auto mb-2"
                      />
                      <p className="text-sm font-medium">Mesa {n}</p>
                      <a 
                        href={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`http://localhost:5173/menu/${n}`)}`}
                        download={`mesa-${n}-qr.png`}
                        className="text-xs text-blue-600 mt-1 block"
                      >
                        Descargar
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Mi Restaurante</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input 
                    type="text" 
                    value={restaurant?.name || ''} 
                    onChange={(e) => setRestaurant({...restaurant, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea 
                    value={restaurant?.description || ''} 
                    onChange={(e) => setRestaurant({...restaurant, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg" 
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input 
                    type="text" 
                    value={restaurant?.phone || ''} 
                    onChange={(e) => setRestaurant({...restaurant, phone: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input 
                    type="text" 
                    value={restaurant?.address || ''} 
                    onChange={(e) => setRestaurant({...restaurant, address: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg" 
                  />
                </div>
              </div>

              <button 
                onClick={saveRestaurant}
                disabled={saving}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              
              {saved && <p className="text-green-600 mt-2">¡Cambios guardados!</p>}
            </div>
          )}
        </main>
      </div>
      </div>
    </div>
  );
}