# 🍽️ Tabula

> Sistema de menú digital para restaurantes. El cliente escanea un QR en su mesa, consulta el catálogo, personaliza su pedido y lo envía a cocina — todo desde el navegador, sin app.

🔗 [stejondev.com](https://stejondev.com)

---

## 📁 Estructura del monorepo

```
tabula/
├── frontend/   # Interfaz React — menú, carrito y pedidos
└── backend/    # API REST Express — catálogo y órdenes
```

Cada carpeta tiene su propio `package.json`, dependencias y README detallado.

---

## 🛠️ Stack

| | Frontend | Backend |
|---|---|---|
| **Lenguaje**    | JavaScript (JSX) | JavaScript (ESM) |
| **Framework**   | React 19 + Vite | Express 5 |
| **Estado**      | Zustand | useContext |
| **Estilos**     | CSS Modules |
| **Routing**     | React Router v7 | Rutas Express |
| **Animaciones** | Framer Motion |
| **Gestor de paquetes** | pnpm | pnpm |
| **Despliegue** | VPS cubepath | VPS cubepath |

---

## 🚀 Desarrollo local

### Backend

```bash
cd backend
pnpm install
node --watch server.js
```

Crea `backend/.env`:

```env
PORT=3000
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Crea `frontend/.env.local` si necesitas apuntar a otro backend:

```env
VITE_API_URL=http://localhost:3000
```

---

## 🛰️ Flujo de la aplicación

```
Cliente escanea QR
    │
    ▼
/ (Home)  ──────────────────────────────────► /menu?mesa=1
                                                    │
                                         GET /menú con paginación
                                                    │
                                    React renderiza catálogo
                                                    │
                         Cliente agrega productos al carrito
                                                    │
                    ┌─────────────────────────────┬────────────────┐
                    │                             │                │
                    ▼                             ▼                ▼
           POST /orders            POST /alerts          etc.
           (Pedir a cocina)   (Llamar mesero, etc.)
```

---

## 🛰️ API — Endpoints

### ✅ Implementados

| Método | Ruta | Descripción | Parámetros |
|--------|------|-------------|------------|
| `GET`  | `/health` | Estado del servidor | — |
| `GET`  | `/menu` | Catálogo paginado | `mesa`, `limit`, `offset` |
| `POST` | `/orders` | Enviar orden desde la mesa | `mesa`, `items[]` |
| `POST` | `/alerts` | Acciones de mesa (mesero, cuenta, limpiar) | `table`, `type` |

### 🔲 Pendientes

| Método   | Ruta            | Descripción                   |
|----------|-----------------|-------------------------------|
| `GET`    | `/orders/:mesa` | Consultar órdenes de una mesa |
| `PATCH`  | `/orders/:id`   | Actualizar estado de orden    |
| `DELETE` | `/orders/:id`   | Cancelar orden                |

---

✒️ **Autor:** [StejonDev](https://stejondev.com) — Proyecto final Hackaton cubepath
