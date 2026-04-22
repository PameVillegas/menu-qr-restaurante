# Plan de Implementación: Sistema de Menú Digital QR

## Descripción General

Este plan implementa una Progressive Web App (PWA) para menús digitales de restaurantes accesibles mediante códigos QR. El sistema incluye un frontend React con TypeScript, un backend Node.js/Express, base de datos PostgreSQL, caché Redis, y capacidades offline mediante Service Workers.

## Tareas

- [ ] 1. Configuración inicial del proyecto
  - [x] 1.1 Configurar estructura de monorepo con frontend y backend
    - Crear directorios `frontend/` y `backend/`
    - Configurar package.json raíz con workspaces
    - Configurar scripts de desarrollo y build
    - _Requisitos: Base para todos los requisitos_

  - [x] 1.2 Configurar proyecto frontend con React + Vite + TypeScript
    - Inicializar proyecto Vite con template React-TS
    - Instalar y configurar Tailwind CSS
    - Configurar ESLint y Prettier
    - Configurar path aliases (@components, @services, etc.)
    - _Requisitos: 1.2, 1.3, 2.3_

  - [x] 1.3 Configurar proyecto backend con Node.js + Express + TypeScript
    - Inicializar proyecto Node.js con TypeScript
    - Configurar Express con middleware básico (cors, helmet, compression)
    - Configurar estructura de carpetas (routes, services, models, middleware)
    - Configurar variables de entorno con dotenv
    - _Requisitos: Base para requisitos 4.x, 5.x, 6.x, 8.x_

- [ ] 2. Configuración de base de datos y modelos
  - [x] 2.1 Configurar PostgreSQL y crear esquema de base de datos
    - Crear archivo de migración con tablas: restaurants, categories, menu_items, admins, qr_codes
    - Implementar índices para optimización de queries
    - Configurar pool de conexiones con pg
    - _Requisitos: 4.1, 4.2, 4.3, 5.1, 5.2, 6.1, 7.1, 8.1_

  - [-] 2.2 Configurar Redis para caché
    - Instalar y configurar cliente Redis
    - Implementar funciones helper para get/set/delete cache
    - Configurar TTL por defecto (5 minutos para menú)
    - _Requisitos: 9.3, 10.1_

  - [ ] 2.3 Crear interfaces TypeScript para modelos de datos
    - Definir interfaces: Restaurant, Category, MenuItem, Admin, QRCode, MenuResponse
    - Crear tipos para requests y responses de API
    - _Requisitos: 2.2, 3.1, 7.1, 7.2, 7.3, 7.4_

  - [ ]* 2.4 Escribir test de propiedad para modelos de datos
    - **Property 3: Menu response contains all required fields**
    - **Valida: Requisitos 2.2, 3.1**

- [ ] 3. Implementación de servicios backend core
  - [ ] 3.1 Implementar AuthService para autenticación
    - Implementar función login con validación de credenciales
    - Implementar generación y verificación de JWT tokens
    - Implementar hash de contraseñas con bcrypt
    - Crear middleware de autenticación para rutas protegidas
    - _Requisitos: 4.1, 4.2, 4.3, 4.4, 8.1, 8.2_

  - [ ]* 3.2 Escribir tests unitarios para AuthService
    - Test login con credenciales válidas e inválidas
    - Test generación y verificación de tokens
    - Test middleware de autenticación

  - [ ] 3.2 Implementar MenuService para obtención de menú
    - Implementar getMenuByRestaurantId con cache Redis
    - Implementar invalidateMenuCache
    - Manejar casos de restaurante no encontrado
    - _Requisitos: 1.1, 1.4, 2.1, 2.2, 3.1, 7.1, 7.2, 7.3, 7.4_

  - [ ]* 3.3 Escribir test de propiedad para MenuService
    - **Property 1: Invalid restaurant IDs return appropriate errors**
    - **Valida: Requisitos 1.4**

  - [ ]* 3.4 Escribir test de propiedad para MenuService
    - **Property 2: Menu items are grouped by category**
    - **Valida: Requisitos 2.1**

  - [ ]* 3.5 Escribir test de propiedad para MenuService
    - **Property 11: Restaurant information completeness**
    - **Valida: Requisitos 7.1, 7.2, 7.3, 7.4**

- [ ] 4. Implementación de servicios de gestión de contenido
  - [ ] 4.1 Implementar ItemService para CRUD de items
    - Implementar createItem con validación de campos requeridos
    - Implementar updateItem con validación
    - Implementar deleteItem (soft delete)
    - Implementar toggleAvailability
    - Implementar reorderItem
    - Invalidar cache después de cada operación
    - _Requisitos: 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.3_

  - [ ]* 4.2 Escribir test de propiedad para ItemService
    - **Property 5: CRUD operations round-trip correctly**
    - **Valida: Requisitos 4.1, 4.2, 4.3, 4.4**

  - [ ]* 4.3 Escribir test de propiedad para ItemService
    - **Property 6: Item validation rejects invalid data**
    - **Valida: Requisitos 4.5**

  - [ ]* 4.4 Escribir test de propiedad para ItemService
    - **Property 9: Availability toggle round-trip**
    - **Valida: Requisitos 6.1, 6.3**

  - [ ] 4.5 Implementar CategoryService para CRUD de categorías
    - Implementar createCategory
    - Implementar updateCategory
    - Implementar deleteCategory (verificar que esté vacía)
    - Implementar reorderCategory
    - Invalidar cache después de cada operación
    - _Requisitos: 5.1, 5.2, 5.3_

  - [ ]* 4.6 Escribir test de propiedad para CategoryService
    - **Property 7: Category creation and assignment**
    - **Valida: Requisitos 5.1, 5.2**

  - [ ]* 4.7 Escribir test de propiedad para CategoryService
    - **Property 8: Reordering preserves all elements**
    - **Valida: Requisitos 5.3, 5.4**

- [ ] 5. Implementación de procesamiento de imágenes
  - [ ] 5.1 Implementar ImageService para upload y optimización
    - Configurar Multer para manejo de uploads
    - Implementar uploadImage con validación de formato y tamaño
    - Implementar optimizeImage con Sharp (generar thumbnail, mobile, desktop)
    - Implementar deleteImage
    - Configurar almacenamiento (local o CDN)
    - _Requisitos: 3.1, 3.2, 9.2_

  - [ ]* 5.2 Escribir test de propiedad para ImageService
    - **Property 4: Image optimization reduces file size**
    - **Valida: Requisitos 3.2, 9.2**

  - [ ]* 5.3 Escribir tests unitarios para ImageService
    - Test validación de formatos permitidos
    - Test manejo de archivos muy grandes
    - Test generación de múltiples tamaños

- [ ] 6. Implementación de generación de códigos QR
  - [ ] 6.1 Implementar QRService para generación de QR codes
    - Implementar generateQR con URL del menú
    - Implementar generateHighResQR para impresión (300 DPI)
    - Guardar registro en tabla qr_codes
    - Retornar URL de descarga
    - _Requisitos: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 6.2 Escribir test de propiedad para QRService
    - **Property 12: QR code generation produces valid codes**
    - **Valida: Requisitos 8.1, 8.2, 8.3, 8.4**

  - [ ]* 6.3 Escribir tests unitarios para QRService
    - Test generación de QR con diferentes IDs
    - Test resolución mínima de 300 DPI
    - Test formato PNG

- [ ] 7. Implementación de endpoints de API
  - [ ] 7.1 Implementar endpoint público GET /api/menu/:restaurantId
    - Crear ruta y controlador
    - Integrar con MenuService
    - Manejar errores 404 y 500
    - Configurar headers de cache HTTP
    - _Requisitos: 1.1, 1.4, 2.1, 2.2, 3.1, 7.1, 7.2, 7.3, 7.4_

  - [ ] 7.2 Implementar endpoint POST /api/admin/auth/login
    - Crear ruta y controlador
    - Integrar con AuthService
    - Retornar token JWT
    - _Requisitos: 4.1, 4.2, 4.3_

  - [ ] 7.3 Implementar endpoints CRUD para items
    - POST /api/admin/items (crear item)
    - PUT /api/admin/items/:id (actualizar item)
    - DELETE /api/admin/items/:id (eliminar item)
    - PUT /api/admin/items/:id/reorder (reordenar)
    - Aplicar middleware de autenticación
    - _Requisitos: 4.1, 4.2, 4.3, 4.4, 5.4, 6.1, 6.3_

  - [ ] 7.4 Implementar endpoints CRUD para categorías
    - POST /api/admin/categories (crear categoría)
    - PUT /api/admin/categories/:id (actualizar categoría)
    - DELETE /api/admin/categories/:id (eliminar categoría)
    - PUT /api/admin/categories/:id/reorder (reordenar)
    - Aplicar middleware de autenticación
    - _Requisitos: 5.1, 5.2, 5.3_

  - [ ] 7.5 Implementar endpoints para imágenes y QR
    - POST /api/admin/images/upload (subir imagen)
    - POST /api/admin/qr/generate (generar QR)
    - GET /api/admin/menu (obtener menú completo para admin)
    - Aplicar middleware de autenticación
    - _Requisitos: 3.1, 3.2, 8.1, 8.2_

  - [ ]* 7.6 Escribir tests de integración para API
    - Test flujo completo: crear categoría → crear item → obtener menú
    - Test autenticación y autorización
    - Test manejo de errores

- [ ] 8. Checkpoint - Verificar backend completo
  - Asegurar que todos los tests pasen, preguntar al usuario si surgen dudas.

- [ ] 9. Implementación de componentes frontend - Cliente (PWA)
  - [ ] 9.1 Crear componente RestaurantHeader
    - Mostrar logo, nombre, horarios y contacto del restaurante
    - Diseño responsive con Tailwind
    - _Requisitos: 7.1, 7.2, 7.3, 7.4_

  - [ ] 9.2 Crear componente MenuItem
    - Mostrar nombre, descripción, precio, imagen
    - Implementar lazy loading de imágenes con placeholder
    - Indicador visual para items no disponibles
    - Props: { id, name, description, price, imageUrl, available }
    - _Requisitos: 2.2, 3.1, 3.3, 3.4, 6.2_

  - [ ] 9.3 Crear componente CategorySection
    - Renderizar lista de items de una categoría
    - Mostrar items disponibles antes que no disponibles
    - _Requisitos: 2.1, 6.4_

  - [ ]* 9.4 Escribir test de propiedad para ordenamiento de items
    - **Property 10: Available items appear before unavailable items**
    - **Valida: Requisitos 6.2, 6.4**

  - [ ] 9.5 Crear componente CategoryList
    - Navegación rápida entre categorías
    - Sticky header para acceso rápido
    - _Requisitos: 2.1_

  - [ ] 9.6 Crear componentes LoadingSpinner y OfflineIndicator
    - LoadingSpinner para estado de carga inicial
    - OfflineIndicator para mostrar cuando se usa contenido cacheado
    - _Requisitos: 9.4, 10.4_

  - [ ] 9.7 Crear página MenuPage principal
    - Integrar todos los componentes (Header, CategoryList, CategorySection, MenuItem)
    - Implementar fetch de datos desde API
    - Manejar estados de carga, error y éxito
    - Implementar scroll infinito si es necesario
    - _Requisitos: 1.1, 1.2, 2.1, 2.3_

  - [ ]* 9.8 Escribir tests unitarios para componentes cliente
    - Test rendering con datos mock
    - Test estados de carga y error
    - Test responsive behavior

- [ ] 10. Implementación de componentes frontend - Panel Admin
  - [ ] 10.1 Crear componente AdminDashboard
    - Layout principal con navegación
    - Rutas protegidas con autenticación
    - _Requisitos: 4.1, 4.2, 4.3_

  - [ ] 10.2 Crear componente ItemForm
    - Formulario para crear/editar items
    - Validación de campos requeridos (nombre, precio)
    - Integración con ImageUploader
    - _Requisitos: 4.1, 4.2, 4.5_

  - [ ] 10.3 Crear componente ImageUploader
    - Upload de imágenes con preview
    - Validación de formato y tamaño
    - Indicador de progreso
    - _Requisitos: 3.1, 3.2_

  - [ ] 10.4 Crear componente MenuManager
    - Lista de items con opciones CRUD
    - Drag & drop para reordenar items
    - Toggle de disponibilidad
    - _Requisitos: 4.1, 4.2, 4.3, 4.4, 5.4, 6.1, 6.3_

  - [ ] 10.5 Crear componente CategoryManager
    - Lista de categorías con opciones CRUD
    - Reordenamiento de categorías
    - _Requisitos: 5.1, 5.2, 5.3_

  - [ ] 10.6 Crear componente QRGenerator
    - Generar código QR del menú
    - Preview del código
    - Botón de descarga en alta resolución
    - _Requisitos: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 10.7 Escribir tests unitarios para componentes admin
    - Test formularios y validación
    - Test drag & drop
    - Test integración con API

- [ ] 11. Implementación de Service Worker y capacidades PWA
  - [ ] 11.1 Configurar Workbox y crear service worker
    - Instalar y configurar Workbox con Vite
    - Configurar estrategias de cache:
      - Stale-While-Revalidate para datos del menú
      - Cache-First para imágenes
      - Network-First para panel admin
    - Implementar precaching de assets estáticos
    - _Requisitos: 9.3, 10.1, 10.2_

  - [ ] 11.2 Configurar manifest.json para PWA
    - Definir nombre, iconos, colores del tema
    - Configurar display mode standalone
    - Configurar start_url
    - _Requisitos: 1.2_

  - [ ] 11.3 Implementar lógica de sincronización offline
    - Detectar cambios de conectividad
    - Sincronizar datos cuando se restablece conexión
    - Mostrar OfflineIndicator cuando se usa cache
    - _Requisitos: 10.1, 10.2, 10.3, 10.4_

  - [ ]* 11.4 Escribir tests para service worker
    - Test estrategias de cache
    - Test comportamiento offline
    - Test sincronización

- [ ] 12. Checkpoint - Verificar funcionalidad PWA
  - Asegurar que todos los tests pasen, preguntar al usuario si surgen dudas.

- [ ] 13. Optimización de rendimiento
  - [ ] 13.1 Implementar lazy loading de imágenes
    - Usar Intersection Observer API
    - Mostrar placeholders durante carga
    - _Requisitos: 3.4, 9.1_

  - [ ] 13.2 Configurar compresión y optimización de assets
    - Configurar compresión gzip/brotli en Express
    - Optimizar bundle size con code splitting
    - Configurar headers de cache HTTP
    - _Requisitos: 9.1, 9.2_

  - [ ] 13.3 Implementar caché multinivel
    - Browser cache (HTTP headers)
    - Service Worker cache
    - Redis cache en backend
    - _Requisitos: 9.3, 10.1_

  - [ ]* 13.4 Realizar pruebas de rendimiento
    - Verificar Time to Interactive < 3 segundos en 3G
    - Verificar p95 de API < 500ms
    - Verificar optimización de imágenes

- [ ] 14. Manejo de errores y casos edge
  - [ ] 14.1 Implementar manejo de errores en frontend
    - Error boundaries en React
    - Mensajes de error user-friendly
    - Retry logic para requests fallidos
    - _Requisitos: 1.4, 3.3_

  - [ ] 14.2 Implementar manejo de errores en backend
    - Middleware de manejo de errores global
    - Logging de errores con contexto
    - Formato consistente de respuestas de error
    - _Requisitos: 1.4_

  - [ ]* 14.3 Escribir tests para casos edge
    - Test menú vacío
    - Test categoría sin items
    - Test imágenes faltantes
    - Test conexión intermitente

- [ ] 15. Integración y pruebas end-to-end
  - [ ] 15.1 Configurar entorno de testing E2E
    - Instalar y configurar Playwright o Cypress
    - Configurar base de datos de test
    - Crear fixtures de datos de prueba
    - _Requisitos: Todos_

  - [ ]* 15.2 Escribir tests E2E para flujo de cliente
    - Test: escanear QR → ver menú → ver items por categoría
    - Test: ver menú offline después de carga inicial
    - Test: lazy loading de imágenes
    - _Requisitos: 1.1, 1.2, 2.1, 3.4, 10.1, 10.2_

  - [ ]* 15.3 Escribir tests E2E para flujo de administrador
    - Test: login → crear categoría → crear item → verificar en menú público
    - Test: subir imagen → verificar optimización → ver en menú
    - Test: marcar item no disponible → verificar en menú
    - Test: generar QR → descargar
    - _Requisitos: 4.1, 4.2, 4.3, 5.1, 5.2, 6.1, 8.1, 8.2_

- [ ] 16. Documentación y deployment
  - [ ] 16.1 Crear documentación de setup y desarrollo
    - README con instrucciones de instalación
    - Documentar variables de entorno
    - Documentar scripts de desarrollo y build
    - _Requisitos: Base para desarrollo_

  - [ ] 16.2 Configurar scripts de deployment
    - Script para migraciones de base de datos
    - Script para build de producción
    - Configurar variables de entorno de producción
    - _Requisitos: Todos_

  - [ ] 16.3 Crear seed data para demo
    - Script para poblar base de datos con datos de ejemplo
    - Incluir restaurante demo con categorías e items
    - Incluir imágenes de ejemplo
    - _Requisitos: Facilitar testing y demo_

- [ ] 17. Checkpoint final - Verificar sistema completo
  - Asegurar que todos los tests pasen, preguntar al usuario si surgen dudas.

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia los requisitos específicos para trazabilidad
- Los checkpoints aseguran validación incremental
- Los property tests validan las 12 propiedades de correctness del diseño
- Los unit tests validan ejemplos específicos y casos edge
- El sistema usa TypeScript en frontend y backend para type safety
