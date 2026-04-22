import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { Camera, X } from 'lucide-react';

export default function QrScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [_hasCamera, setHasCamera] = useState(true);
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  const startScanner = async () => {
    try {
      setError(null);
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) {
        setHasCamera(false);
        setError('No se encontró cámara en el dispositivo');
        return;
      }

      const cameraId = cameras[cameras.length - 1].id;

      await scanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScan(decodedText);
        },
        () => {}
      );

      setIsScanning(true);
    } catch (err) {
      console.error('Scanner error:', err);
      setError('Error al iniciar la cámara. Verifica los permisos.');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setIsScanning(false);
      } catch (err) {
        console.error('Stop error:', err);
      }
    }
  };

  const handleScan = (decodedText: string) => {
    stopScanner();
    const menuUrl = `/menu/${encodeURIComponent(decodedText)}`;
    navigate(menuUrl);
  };

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="p-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-800 rounded-lg transition"
        >
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Escanear QR</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-sm">
          <div 
            ref={videoRef}
            id="qr-reader" 
            className="w-full overflow-hidden rounded-2xl"
          />

          {!isScanning && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-2xl">
              <div className="text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">Iniciando cámara...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-2xl">
              <div className="text-center p-6">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={startScanner}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium transition"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {isScanning && (
            <>
              <div className="absolute inset-0 border-2 border-emerald-400 rounded-2xl pointer-events-none" />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-sm text-gray-400 bg-gray-900/80 inline-block px-4 py-2 rounded-full">
                  Apunta al código QR de tu mesa
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 w-full max-w-sm">
          <button
            onClick={isScanning ? stopScanner : startScanner}
            className={`w-full py-4 rounded-xl font-semibold transition ${
              isScanning
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
          >
            {isScanning ? 'Detener' : 'Iniciar Escaneo'}
          </button>
        </div>
      </main>
    </div>
  );
}
