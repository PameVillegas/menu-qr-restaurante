# Frontend - Menú Digital QR

PWA frontend para el sistema de menú digital QR.

## Stack Tecnológico

- **React 18** - Biblioteca UI
- **TypeScript** - Type safety
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **Vitest** - Testing framework

## Estructura del Proyecto

```
src/
├── components/     # Componentes React reutilizables
├── services/       # Servicios API y lógica de negocio
├── hooks/          # Custom React hooks
├── utils/          # Funciones utilitarias
├── types/          # Definiciones de tipos TypeScript
├── assets/         # Imágenes, iconos, etc.
├── App.tsx         # Componente principal
├── main.tsx        # Entry point
└── index.css       # Estilos globales con Tailwind
```

## Path Aliases Configurados

- `@/` → `./src/`
- `@components/` → `./src/components/`
- `@services/` → `./src/services/`
- `@hooks/` → `./src/hooks/`
- `@utils/` → `./src/utils/`
- `@types/` → `./src/types/`
- `@assets/` → `./src/assets/`

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint

# Tests
npm run test
```

## Configuración

### ESLint + Prettier

El proyecto está configurado con ESLint y Prettier para mantener código consistente:
- ESLint: Análisis estático de código
- Prettier: Formateo automático de código

### Tailwind CSS

Tailwind está configurado con:
- Colores personalizados (primary palette)
- Fuente Inter como default
- Autoprefixer para compatibilidad de navegadores

## Desarrollo

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar servidor de desarrollo:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Proxy API

El dev server está configurado para hacer proxy de `/api` hacia `http://localhost:5000` (backend).
