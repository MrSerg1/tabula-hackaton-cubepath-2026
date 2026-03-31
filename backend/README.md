# 🍽️ Tabula — Backend API

> API REST del sistema de menú digital. Gestiona el catálogo de productos, procesa órdenes y sirve al frontend con paginación y validación por mesa.

---

## 🛠️ Stack

- **Runtime** — Node.js 20+
- **Framework** — Express 5
- **Datos** — JSON (file-based, sin base de datos)
- **CORS** — Configurable por variable de entorno
- **Despliegue** — VPS cubepath

---

## 🚀 Desarrollo local

```bash
pnpm install
node --watch server.js
```

Crea un archivo `.env` en la raíz del backend:

```env
PORT=3000
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---

## 🛰️ Endpoints

### ✅ Implementados

| Método | Ruta | Descripción | Body/Parámetros |
|--------|------|-------------|------|
| `GET` | `/health` | Estado del servidor | — |
| `GET` | `/menu?mesa=&limit=&offset=` | Catálogo de productos con paginación | Query params |
| `GET` | `/menu/:id?mesa=` | Detalle de un producto por ID | Query params |
| `POST` | `/orders` | Enviar una nueva orden | `{ mesa, items[] }` |
| `POST` | `/alerts` | Acciones de mesa (llamar mesero, pedir cuenta, limpiar mesa) | `{ table, type }` |

### 🔲 Pendientes de implementar

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/orders/:mesa` | Consultar órdenes activas de una mesa |
| `PATCH` | `/orders/:id` | Actualizar estado de una orden |
| `DELETE` | `/orders/:id` | Cancelar una orden |

---

## 📁 Estructura

```
backend/
├── server.js           # Entry point, middlewares y rutas
├── routes/
│   ├── products.js     # Rutas del menú (GET /menu)
│   ├── orders.js       # Rutas de órdenes (POST /orders)
│   └── alerts.js       # Rutas de alertas (POST /alerts)
├── controllers/
│   ├── products.js     # Lógica del catálogo
│   ├── orders.js       # Lógica de órdenes
│   └── alerts.js       # Lógica de alertas
├── models/
│   ├── product.js      # Lectura del catálogo desde JSON
│   ├── order.js        # Persistencia de órdenes
│   └── alert.js        # Persistencia de alertas
├── middleware/
│   └── cors.js         # CORS configurable por .env
└── data/
    ├── products.json   # Catálogo de productos
    ├── orders.json     # Órdenes guardadas
    └── alerts.json     # Alertas de mesa guardadas
```

---

## 📦 Parámetros del endpoint `/menu`

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `mesa`   |`int > 0` | ✅ S   | Número de mesa activa |
| `limit`  |`int > 0` | No (default: 10) | Productos por página |
| `offset` |`int >= 0`| No (default: 0)  | Punto de inicio |

---

✒️ **Autor:** [StejonDev]