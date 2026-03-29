🎨 Tabula | Menú Digital & Experiencia de Usuario
Tabula es una interfaz moderna de pedidos diseñada para optimizar la experiencia del comensal en restaurantes de servicio rápido. El enfoque principal ha sido crear una navegación fluida, minimalista y con micro-interacciones que mejoren la percepción de marca.

🚀 Características Principales
- Interfaz Ultra-Rápida: Construida con React y Vite para una carga instantánea.

- Micro-interacciones: Sistema de partículas personalizado y animaciones de feedback visual al añadir productos.

- Gestión de Carrito en Tiempo Real: Persistencia y cálculo automático de totales.

- Diseño Mobile-First: Optimizado para ser consultado desde códigos QR en mesas físicas.

- Arquitectura Desacoplada: Frontend independiente conectado a una API REST técnica.

🛠️ Stack Tecnológico

Framework: React 18

Estilos: CSS Modules (para un diseño modular y evitar colisiones de clases).

Animaciones: Framer Motion (manejo de estados de presencia y transiciones suaves).

Bundler: Vite

Despliegue: VPS de cubepath.


🛰️ Integración con el Backend
El frontend consume una API REST propia alojada en un VPS independiente en cubepath. Actualmente, el sistema utiliza un flujo de datos dinámico para:

Obtener el catálogo completo de productos.

Procesar el envío de órdenes de compra.

✒️ Autor: StejonDev

Nota para Evaluadores: Este proyecto fue desarrollado como trabajo final para la hackaton de cubepath. Se priorizó la implementación de una arquitectura limpia y la optimización del rendimiento en dispositivos móviles.