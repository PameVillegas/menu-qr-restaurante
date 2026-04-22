# Sistema de Menú Digital QR

Progressive Web App para menús digitales de restaurantes accesibles mediante códigos QR.

## Estructura del Proyecto

Este es un monorepo que contiene:

- **frontend/**: Aplicación React + TypeScript + Vite (PWA)
- **backend/**: API REST Node.js + Express + TypeScript

## Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14
- Redis >= 6

## Instalación

```bash
# Instalar dependencias de todos los workspaces
npm install
```

## Desarrollo

```bash
# Iniciar frontend y backend simultáneamente
npm run dev

# Iniciar solo el frontend
npm run dev:frontend

# Iniciar solo el backend
npm run dev:backend
```

## Build

```bash
# Build de todos los workspaces
npm run build

# Build solo del frontend
npm run build:frontend

# Build solo del backend
npm run build:backend
```

## Testing

```bash
# Ejecutar tests de todos los workspaces
npm test

# Tests solo del frontend
npm run test:frontend

# Tests solo del backend
npm run test:backend
```

## Linting

```bash
# Ejecutar linter en todos los workspaces
npm run lint
```

## Configuración

### Backend

1. Copiar `.env.example` a `.env` en el directorio `backend/`
2. Configurar las variables de entorno según tu entorno

### Frontend

La configuración de Vite se encuentra en `frontend/vite.config.ts`

## Scripts Disponibles

- `npm run dev` - Inicia frontend y backend en modo desarrollo
- `npm run build` - Construye ambos proyectos para producción
- `npm test` - Ejecuta todos los tests
- `npm run lint` - Ejecuta el linter en ambos proyectos
- `npm run clean` - Limpia node_modules y archivos de build

## Estructura de Directorios

```
menu-digital-qr/
├── frontend/               # Aplicación React PWA
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/               # API REST Node.js
│   ├── src/
│   │   ├── routes/       # Rutas de la API
│   │   ├── services/     # Lógica de negocio
│   │   ├── models/       # Modelos de datos
│   │   ├── middleware/   # Middleware de Express
│   │   └── utils/        # Utilidades
│   └── package.json
└── package.json          # Configuración del monorepo
```

## Tecnologías

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS (por configurar)
- Workbox (Service Worker)

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- Redis
- JWT Authentication

## Licencia

Privado
