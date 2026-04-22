# Redis Setup Guide

Este documento explica cómo instalar y configurar Redis para el sistema de menú digital QR.

## ¿Qué es Redis?

Redis es un almacén de datos en memoria de código abierto que se utiliza como caché, base de datos y broker de mensajes. En este proyecto, Redis se usa para:

- **Caché de menú**: Almacenar datos del menú durante 5 minutos para reducir consultas a la base de datos
- **Sesiones de administrador**: Almacenar tokens de autenticación durante 24 horas

## Instalación

### Windows

1. **Opción 1: Usar WSL (Recomendado)**
   ```bash
   # Instalar WSL si no lo tienes
   wsl --install
   
   # Dentro de WSL, instalar Redis
   sudo apt update
   sudo apt install redis-server
   
   # Iniciar Redis
   sudo service redis-server start
   ```

2. **Opción 2: Usar Docker**
   ```bash
   docker run -d -p 6379:6379 --name redis redis:latest
   ```

### macOS

```bash
# Usando Homebrew
brew install redis

# Iniciar Redis
brew services start redis

# O iniciar manualmente
redis-server
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install redis-server

# Iniciar Redis
sudo systemctl start redis-server

# Habilitar inicio automático
sudo systemctl enable redis-server
```

## Verificar Instalación

```bash
# Verificar que Redis está corriendo
redis-cli ping

# Debería responder: PONG
```

## Configuración del Proyecto

El proyecto ya está configurado para usar Redis. Las variables de entorno están en `.env`:

```env
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Configuración Personalizada

Si Redis está en otro host o puerto, actualiza las variables en tu archivo `.env`:

```env
# Para Redis remoto
REDIS_URL=redis://usuario:contraseña@host:puerto

# O configurar individualmente
REDIS_HOST=tu-host-redis
REDIS_PORT=6379
```

## Uso en el Código

### Inicializar Redis

```typescript
import { initRedis } from './utils/redis.js';

// En tu archivo principal (index.ts)
await initRedis();
```

### Funciones de Caché

```typescript
import { cacheGet, cacheSet, cacheDelete, CacheKeys } from './utils/cache.js';

// Guardar en caché (TTL por defecto: 5 minutos)
await cacheSet(CacheKeys.menu('restaurant-id'), menuData);

// Obtener de caché
const cachedMenu = await cacheGet(CacheKeys.menu('restaurant-id'));

// Eliminar de caché
await cacheDelete(CacheKeys.menu('restaurant-id'));

// Guardar con TTL personalizado (en segundos)
await cacheSet('mi-clave', 'mi-valor', 3600); // 1 hora
```

### Claves de Caché Predefinidas

```typescript
import { CacheKeys } from './utils/cache.js';

// Menú de restaurante
CacheKeys.menu(restaurantId) // → 'menu:{restaurantId}'

// Sesión de administrador
CacheKeys.session(token) // → 'session:{token}'

// Patrones para eliminar múltiples claves
CacheKeys.menuPattern() // → 'menu:*'
CacheKeys.sessionPattern() // → 'session:*'
```

## TTL (Time To Live) Configurado

- **Menú**: 5 minutos (300 segundos) - `DEFAULT_MENU_TTL`
- **Sesiones**: 24 horas (86400 segundos) - `DEFAULT_SESSION_TTL`

## Comandos Útiles de Redis CLI

```bash
# Conectar a Redis
redis-cli

# Ver todas las claves
KEYS *

# Ver claves de menú
KEYS menu:*

# Obtener valor de una clave
GET menu:restaurant-id

# Ver TTL de una clave (en segundos)
TTL menu:restaurant-id

# Eliminar una clave
DEL menu:restaurant-id

# Eliminar todas las claves (¡CUIDADO!)
FLUSHDB

# Ver información del servidor
INFO

# Salir
EXIT
```

## Manejo de Errores

El sistema está diseñado para funcionar **sin Redis** si no está disponible:

- Si Redis no está conectado, las operaciones de caché fallan silenciosamente
- La aplicación continúa funcionando normalmente, solo sin caché
- Los logs mostrarán advertencias cuando Redis no esté disponible

Ejemplo de log:
```
Redis client not available, skipping cache get
```

## Pruebas

Para ejecutar las pruebas de Redis:

```bash
# Asegúrate de que Redis esté corriendo
redis-cli ping

# Ejecutar pruebas
npm test cache.test.ts
```

Las pruebas se saltarán automáticamente si Redis no está disponible.

## Monitoreo

### Ver actividad en tiempo real

```bash
redis-cli MONITOR
```

### Ver estadísticas

```bash
redis-cli INFO stats
```

### Ver memoria usada

```bash
redis-cli INFO memory
```

## Troubleshooting

### Redis no inicia

```bash
# Ver logs de Redis
sudo journalctl -u redis-server

# O en macOS
tail -f /usr/local/var/log/redis.log
```

### Puerto ya en uso

```bash
# Ver qué proceso usa el puerto 6379
lsof -i :6379

# Matar el proceso si es necesario
kill -9 <PID>
```

### Limpiar caché manualmente

```bash
redis-cli FLUSHDB
```

## Producción

Para producción, considera:

1. **Persistencia**: Configurar RDB o AOF para persistir datos
2. **Seguridad**: Configurar contraseña con `requirepass`
3. **Límites de memoria**: Configurar `maxmemory` y política de evicción
4. **Monitoreo**: Usar herramientas como Redis Insight o Prometheus
5. **Alta disponibilidad**: Configurar Redis Sentinel o Redis Cluster

### Ejemplo de configuración de producción

```env
REDIS_URL=redis://:tu-contraseña-segura@redis-host:6379
```

## Recursos Adicionales

- [Documentación oficial de Redis](https://redis.io/documentation)
- [Redis CLI Commands](https://redis.io/commands)
- [Redis Node.js Client](https://github.com/redis/node-redis)
