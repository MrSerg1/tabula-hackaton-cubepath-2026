# 🍽️ Tabula — Menú Digital

> Interfaz moderna de pedidos para restaurantes. Consulta el menú, personaliza tu plato y ordena directo desde la mesa.

🔗 [stejondev.com](https://stejondev.com)

---

## ✨ Características

| | |
|---|---|
| ⚡ **Ultra-rápida** | React + Vite para carga instantánea |
| 📱 **Mobile-first** | Optimizada para escaneo QR en mesa |
| 🛒 **Carrito en tiempo real** | Persistencia con Zustand y useContext |
| 🎛️ **Personalización** | Excluye ingredientes por producto |
| 🔔 **Acciones de mesa** | Llamar mesero, pedir cuenta, limpiar mesa |
| 🎨 **Animaciones fluidas** | Framer Motion para transiciones |
| 🔗 **Arquitectura desacoplada** | Frontend conectado a API REST propia |

---

## 🛠️ Stack

- **Framework** — React 19
- **Bundler** — Vite
- **Estilos** — CSS Modules
- **Routing** — React Router v7
- **Estado** — Zustand + Context
- **Animaciones** — Framer Motion
- **Notificaciones** — Sileo
- **Despliegue** — VPS cubepath

---

## 🛰️ Backend

El frontend consume una API REST propia alojada en VPS independiente. Endpoints activos:

- `GET /menu` — Catálogo de productos con paginación
- `POST /orders` — Envío de órdenes de compra
- `POST /alerts` — Acciones de mesa (llamar mesero, pedir cuenta, limpiar)

---

## 🚀 Desarrollo local

```bash
pnpm install
pnpm dev
```

> Requiere variable `VITE_API_URL` apuntando al backend, o corre por defecto en `http://localhost:3000`.

---

✒️ **Autor:** [StejonDev](https://stejondev.com) — Proyecto final Hackaton cubepath