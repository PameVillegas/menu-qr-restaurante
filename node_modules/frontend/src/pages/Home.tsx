import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, User } from 'lucide-react';

export default function Home() {
  const [tableNumber, setTableNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tableNumber.trim()) {
      const nameParam = clientName.trim() ? `?name=${encodeURIComponent(clientName.trim())}` : '';
      navigate(`/menu/${tableNumber.trim()}${nameParam}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="py-6 px-4">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logosarmiento.jpeg" alt="Logo" className="w-10 h-10 rounded-full object-cover" />
            <span className="text-xl font-bold">MenuQR</span>
          </div>
          <a 
            href="/admin"
            className="px-4 py-2 border border-gray-500 hover:bg-gray-700 rounded-lg font-medium transition"
          >
            Admin
          </a>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <img src="/logosarmiento.jpeg" alt="Logo" className="w-32 h-32 rounded-full object-cover mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-2">Bienvenido</h1>
          <p className="text-gray-400">Escaneá el QR y pedí desde tu celular</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 text-gray-900 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Tu nombre
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="¿Cómo te llamás?"
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl text-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Número de mesa
            </label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Ej: 5"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg text-center"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition"
          >
            Ver Menú
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/menu" className="text-emerald-400 hover:underline flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5" />
            O escaneá el QR de la puerta
          </Link>
        </div>
      </main>

      <footer className="py-8 border-t border-gray-800 mt-20">
        <div className="max-w-lg mx-auto px-4 text-center text-gray-500 text-sm">
          © 2024 MenuQR
        </div>
      </footer>
    </div>
  );
}