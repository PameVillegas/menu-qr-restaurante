import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { Product, Category } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface MenuData {
  restaurant: any;
  menu: Category[];
}

export default function Menu() {
  const { tableNumber } = useParams<{ tableNumber: string }>();
  const [searchParams] = useSearchParams();
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
const [table, setTable] = useState(tableNumber || '');
  const [clientName, setClientName] = useState(searchParams.get('name') || '');
  const [showCheckout, setShowCheckout] = useState(false);
  const [tip, setTip] = useState(0);
  const [ordering, setOrdering] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [lastOrderId, setLastOrderId] = useState<number | null>(null);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const data = await api.menu.get();
      setMenuData(data as MenuData);
      if (data.menu.length > 0) {
        setSelectedCategory(data.menu[0].id);
      }
    } catch (err) {
      setError('No se pudo cargar el menú');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  };

  const getTotal = () => {
    return getSubtotal() + tip;
  };

  const handlePlaceOrder = async () => {
    if (!table.trim()) {
      alert('Ingresá el número de mesa');
      return;
    }

    setOrdering(true);
    try {
      const items = cart.map((item) => ({
        product_id: item.product.id,
        name: item.product.name,
        price: Number(item.product.price),
        quantity: item.quantity,
      }));

      const res = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_number: table,
          client_name: clientName || table,
          items,
          tip,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setLastOrderId(data.data.order_id);
        setOrderPlaced(true);
      } else {
        alert(data.error || 'Error al hacer el pedido');
      }
    } catch (err) {
      alert('Error al hacer el pedido');
    } finally {
      setOrdering(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!lastOrderId) return;

    try {
      await fetch(`http://localhost:3000/api/orders/${lastOrderId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_number: table,
          rating,
          comment: reviewComment,
          tip_amount: tip,
        }),
      });
      setShowReview(false);
      setCart([]);
      setTip(0);
      setOrderPlaced(false);
      alert('Gracias por tu reseña!');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-emerald-500 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <CheckCircle className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">¡Pedido Confirmado!</h1>
          <p className="text-xl mb-4">Mesa {table}</p>
          <p className="opacity-90 mb-8">Total: ${getTotal().toFixed(2)}</p>
          
          {!showReview ? (
            <button
              onClick={() => setShowReview(true)}
              className="px-8 py-3 bg-white text-emerald-600 rounded-xl font-semibold"
            >
              Dejar Reseña
            </button>
          ) : (
            <div className="bg-white text-gray-900 rounded-2xl p-6 max-w-sm mx-auto">
              <div className="flex justify-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)}>
                    <Star
                      className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Comentario (opcional)"
                className="w-full px-3 py-2 border rounded-lg mb-3"
                rows={3}
              />
              <input
                type="number"
                value={tip}
                onChange={(e) => setTip(Number(e.target.value))}
                placeholder="Propina ($)"
                className="w-full px-3 py-2 border rounded-lg mb-3"
              />
              <button
                onClick={handleSubmitReview}
                className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg"
              >
                Enviar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showCheckout) {
    const tipOptions = [0, 500, 1000, 2000];
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <header className="flex items-center justify-between mb-6">
          <button onClick={() => setShowCheckout(false)} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Confirmar Pedido</h1>
          <div className="w-10" />
        </header>

        <div className="max-w-lg mx-auto space-y-4">
          <div className="bg-white rounded-xl p-4">
            <h3 className="font-semibold mb-3">Tu pedido</h3>
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between py-2">
                <span>{item.quantity}x {item.product.name}</span>
                <span>${(Number(item.product.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-4">
            <h3 className="font-semibold mb-3">Propina</h3>
            <div className="flex gap-2 flex-wrap">
              {tipOptions.map((t) => (
                <button
                  key={t}
                  onClick={() => setTip(t)}
                  className={`px-4 py-2 rounded-lg ${tip === t ? 'bg-emerald-500 text-white' : 'bg-gray-100'}`}
                >
                  ${t || 'Sin propina'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={ordering}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold"
          >
            {ordering ? 'Enviando...' : 'Hacer Pedido'}
          </button>
        </div>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ups!</h1>
          <p className="text-gray-600 mb-4">{error || 'Menú no disponible'}</p>
          <Link to="/admin" className="text-emerald-600 hover:underline">
            Ir al Panel Admin
          </Link>
        </div>
      </div>
    );
  }

  const { restaurant, menu } = menuData;

  return (
    <div className="min-h-screen bg-gray-50">
      <header
        className="bg-cover bg-center text-white py-12 px-4"
        style={{
          backgroundImage: restaurant.banner_url ? `url(${restaurant.banner_url})` : undefined,
          backgroundColor: restaurant.banner_url ? undefined : restaurant.theme_primary,
        }}
      >
        <div className="max-w-lg mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-5 h-5" />
            Volver
          </Link>
          {restaurant.logo_url && (
            <img
              src={restaurant.logo_url}
              alt={restaurant.name}
              className="w-16 h-16 rounded-full object-cover mb-3"
            />
          )}
          <h1 className="text-2xl font-bold mb-2">{restaurant.name}</h1>
          {restaurant.description && (
            <p className="text-white/80 text-sm mb-3">{restaurant.description}</p>
          )}
        </div>
      </header>

      <div className="bg-white p-4 border-b">
          <div className="max-w-lg mx-auto space-y-2">
            <input
              type="text"
              value={table}
              onChange={(e) => setTable(e.target.value)}
              placeholder="Número de mesa"
              className="w-full px-4 py-2 border rounded-lg text-center"
            />
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Tu nombre (para identificarte)"
              className="w-full px-4 py-2 border rounded-lg text-center"
            />
          </div>
        </div>

      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {menu.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  selectedCategory === category.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-4 pb-32">
        {menu.map((category) => (
          <div
            key={category.id}
            className={selectedCategory === category.id ? 'block' : 'hidden'}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-3">{category.name}</h2>
            <div className="space-y-3">
              {category.products?.map((product) => (
                <div key={product.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-gray-500">{product.description}</p>
                    )}
                    <span className="font-bold text-emerald-600">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {cart.find((c) => c.product.id === product.id) && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="w-8 h-8 bg-gray-100 rounded-full"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">
                          {cart.find((c) => c.product.id === product.id)?.quantity}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.is_available}
                      className={`px-3 py-2 rounded-lg ${
                        product.is_available
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {cart.length > 0 && table && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">
                Mesa {table} • {cart.reduce((s, i) => s + i.quantity, 0)} items
              </p>
              <p className="text-xl font-bold">${getTotal().toFixed(2)}</p>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Pedir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}