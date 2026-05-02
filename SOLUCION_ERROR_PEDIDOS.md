# Solución al Error al Crear Pedidos

## Problemas Identificados y Solucionados

### 1. ❌ Frontend usaba URL hardcodeada
**Problema:** En `Menu.tsx` se usaba `http://localhost:3000/api/orders` en lugar de la variable de entorno.

**Solución:** ✅ Ahora usa `api.orders.create()` que utiliza `VITE_API_URL` correctamente.

### 2. ❌ Faltaba la API de orders en el servicio
**Problema:** No existía `api.orders` en `frontend/src/services/api.ts`.

**Solución:** ✅ Se agregó el objeto `orders` con todos los métodos necesarios:
- `create()` - Crear pedido
- `getByRestaurant()` - Obtener pedidos
- `updateStatus()` - Actualizar estado
- `addReview()` - Agregar reseña
- `getReviews()` - Obtener reseñas

### 3. ❌ Formato de datos incompatible
**Problema:** El modelo de order esperaba `OrderItem[]` con campos específicos, pero recibía un formato diferente.

**Solución:** ✅ Se actualizó `orderModel.create()` para aceptar el formato correcto y calcular subtotales dinámicamente.

## Configuración Necesaria en Render

Para que funcione en producción, necesitas configurar estas variables de entorno en tu backend de Render:

```bash
# En Render Dashboard > tu-servicio-backend > Environment
CORS_ORIGIN=https://tu-app.vercel.app
NODE_ENV=production
DATABASE_URL=tu-url-de-postgresql
PORT=3000
```

**IMPORTANTE:** Reemplaza `https://tu-app.vercel.app` con la URL real de tu frontend en Vercel.

## Configuración en Vercel

Tu frontend ya tiene configurado en `.env.production`:
```bash
VITE_API_URL=https://menu-qr-rest.onrender.com/api
```

Vercel automáticamente usa este archivo en producción.

## Verificación

Para verificar que todo funciona:

1. **En desarrollo (local):**
   ```bash
   # Frontend usa: http://localhost:3000/api
   # Backend acepta: http://localhost:5173
   ```

2. **En producción:**
   ```bash
   # Frontend usa: https://menu-qr-rest.onrender.com/api
   # Backend debe aceptar: https://tu-app.vercel.app
   ```

## Próximos Pasos

1. Ve a Render Dashboard
2. Selecciona tu servicio backend
3. Ve a "Environment"
4. Agrega/actualiza la variable `CORS_ORIGIN` con tu URL de Vercel
5. Guarda y espera a que se redeploy automáticamente
6. Prueba crear un pedido desde tu app en Vercel

## Comandos para Probar Localmente

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Luego abre http://localhost:5173 y prueba crear un pedido.
