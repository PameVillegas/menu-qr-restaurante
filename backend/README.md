# Backend - Menu Digital QR

Backend API para el sistema de menú digital accesible mediante código QR.

## Stack Tecnológico

- **Node.js** con **Express** - Framework web
- **TypeScript** - Type safety
- **PostgreSQL** - Base de datos principal
- **Redis** - Caché y sesiones

## Estructura del Proyecto

```
backend/
├── src/
│   ├── index.ts              # Punto de entrada de la aplicación
│   ├── middleware/           # Middleware de Express
│   │   ├── errorHandler.ts  # Manejo centralizado de errores
│   │   └── requestLogger.ts # Logging de requests
│   ├── routes/               # Definición de rutas API
│   │   └── index.ts          # Rutas principales
│   ├── services/             # Lógica de negocio
│   ├── models/               # Modelos de datos y esquemas
│   └── utils/                # Utilidades y configuración
│       └── config.ts         # Configuración centralizada
├── dist/                     # Código compilado (generado)
├── .env.example              # Variables de entorno de ejemplo
├── package.json              # Dependencias y scripts
└── tsconfig.json             # Configuración de TypeScript
```

## Configuración

1. Copiar el archivo de variables de entorno:
```bash
cp .env.example .env
```

2. Editar `.env` con tus configuraciones locales

3. Instalar dependencias:
```bash
npm install
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con hot reload
- `npm run build` - Compila el proyecto TypeScript a JavaScript
- `npm start` - Inicia el servidor en producción (requiere build previo)
- `npm run lint` - Ejecuta el linter
- `npm test` - Ejecuta los tests

## Middleware Configurado

- **helmet** - Seguridad HTTP headers
- **cors** - Cross-Origin Resource Sharing
- **compression** - Compresión gzip de respuestas
- **express.json()** - Parsing de JSON bodies
- **requestLogger** - Logging de requests HTTP
- **errorHandler** - Manejo centralizado de errores

## Variables de Entorno

Ver `.env.example` para la lista completa de variables de entorno requeridas.

### Variables Principales:
- `PORT` - Puerto del servidor (default: 3000)
- `NODE_ENV` - Entorno de ejecución (development/production)
- `DATABASE_URL` - URL de conexión a PostgreSQL
- `REDIS_URL` - URL de conexión a Redis
- `JWT_SECRET` - Secret para tokens JWT
- `CORS_ORIGIN` - Origen permitido para CORS

## Endpoints API

### Públicos
- `GET /api/health` - Health check del servidor
- `GET /api` - Información de la API

### Próximos endpoints (por implementar):
- `GET /api/menu/:restaurantId` - Obtener menú completo
- `POST /api/admin/auth/login` - Login de administrador
- `POST /api/admin/items` - Crear item del menú
- Y más...

## Desarrollo

El servidor se recarga automáticamente al detectar cambios en los archivos TypeScript gracias a `tsx watch`.

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`
