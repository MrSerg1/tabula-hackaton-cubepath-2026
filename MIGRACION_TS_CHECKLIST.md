# Migracion a TypeScript - Checklist por sesiones

Este archivo nos sirve como tablero de seguimiento para migrar Tabula de JS a TS sin romper funcionalidades.

> Uso rapido: marca cada tarea completada con `- [x]`.

---

## Sesion 0 - Baseline y criterio de no regresion

- [x] Definir checklist de comportamiento actual (menu, carrito, orden, panel mesero).
- [x] Acordar criterio de "no regresiones" por sesion.
- [x] Registrar riesgos actuales (duplicidad de catalogo, `mesa` vs `table`).

### Baseline funcional actual

- [x] Home carga y muestra CTA hacia menu con query `mesa`.
- [x] Menu valida `mesa` en query y carga catalogo paginado con `limit` y `offset`.
- [x] Paginacion mantiene `page` en URL y permite navegar sin recargar app.
- [x] Seleccion de ingredientes "sin ..." funciona por producto.
- [x] Carrito agrega/remueve items y distingue combinaciones por ingredientes excluidos.
- [x] Carrito sincroniza estado en URL (`cart`, `sin`) y rehidrata al recargar.
- [x] Envio de orden hace `POST /orders` con `mesa` y `items`.
- [x] Acciones de mesa hacen `POST /alerts` con `table` y `type`.
- [x] Panel de mesero (`/waiter`) lista mesas activas con alertas y ordenes pendientes.

- [x] Sesion 0 completada.

### Criterio de no regresion por sesion

- [x] El flujo principal debe seguir funcionando: Home -> Menu -> Carrito -> Orden -> Waiter.
- [x] No se cambia contrato de API sin actualizar frontend y documentar el cambio.
- [x] Toda sesion debe cerrar con `lint`, `build` y `typecheck` del paquete tocado.
- [x] Si una sesion deja errores de tipos, no se avanza a la siguiente.
- [x] Los cambios de UI/UX no se mezclan con migracion de tipos en la misma sesion.

### Riesgos registrados al iniciar migracion

- [x] Duplicidad de catalogo: `frontend/src/assets/menuProducts.json` y `backend/data/products.json` no estan alineados.
- [x] Contrato mixto de mesa: backend usa `mesa` en ordenes y `table` en alertas/dashboard.
- [x] `useMenuUrlSync` depende de catalogo local del frontend para resolver slugs.
- [x] No hay suite de tests automatizados para validar regresiones funcionales.
- [x] Limites temporales en persistencia (`TEMPORARY_MAX_STORED_*`) pueden ocultar comportamientos.

### Evidencia tecnica (Sesion 0)

- [x] Backend OK en `GET /health`.
- [x] Backend OK en `GET /menu?mesa=1&limit=6&offset=0`.
- [x] Backend OK en `POST /orders`.
- [x] Backend OK en `POST /alerts`.
- [x] Backend OK en `GET /waiter`.
- [x] Frontend `pnpm lint` en verde tras limpiar errores de hooks/imports/contexto.
- [x] Frontend `pnpm build` en verde despues de migrar `useMenuUrlSync` a IDs + backend.

## Sesion 1 - Setup TypeScript en frontend

- [x] Instalar TypeScript y tipos necesarios en `frontend`.
- [x] Crear `frontend/tsconfig.json` y `frontend/vite-env.d.ts`.
- [x] Configurar migracion gradual (`allowJs`) para convivir JS + TS.
- [x] Verificar que `lint` y `build` del frontend sigan pasando.

- [x] Sesion 1 completada.

## Sesion 2 - Tipos base frontend

- [ ] Crear tipos base: `Product`, `CartItem`, `OrderPayload`, `AlertType`, `WaiterTable`.
- [ ] Tipar utilidades (`requestJson`, `formatPrice`, hooks simples).
- [ ] Definir tipos de respuesta de API para frontend.
- [ ] Ejecutar smoke test de menu y carrito.

## Sesion 3 - Nucleo menu/carrito frontend

- [ ] Migrar stores (`useCartStore`, `useOrderStore`) a TS.
- [ ] Migrar componentes clave (`MenuCatalog`, `DishCard`, `CartSheet`) a TS.
- [ ] Corregir warnings de tipos en props, estado y handlers.
- [ ] Validar flujo completo: agregar, quitar, enviar orden.

## Sesion 4 - Panel mesero frontend

- [ ] Migrar `Waiter` y componentes de mesa (`TableCard`, `TableDetailSheet`) a TS.
- [ ] Tipar estructuras de alertas y ordenes agrupadas por mesa.
- [ ] Revisar estados de carga/error con tipos estrictos.
- [ ] Validar panel mesero con datos reales del backend.

## Sesion 5 - Setup TypeScript en backend

- [ ] Instalar TypeScript y tipos de Node/Express en `backend`.
- [ ] Crear `backend/tsconfig.json` para entorno ESM.
- [ ] Definir scripts de `dev`, `build` y `typecheck`.
- [ ] Confirmar que el servidor inicia correctamente.

## Sesion 6 - Rutas y controladores backend

- [ ] Migrar `server` y `routes` a TS.
- [ ] Migrar `controllers` con tipos de `Request/Response`.
- [ ] Tipar validaciones de query/body y manejo de errores.
- [ ] Validar endpoints: `health`, `menu`, `orders`, `alerts`, `waiter`.

## Sesion 7 - Modelos y persistencia backend

- [ ] Migrar `models` a TS (`product`, `order`, `alert`).
- [ ] Tipar estructuras persistidas de `products`, `orders`, `alerts`.
- [ ] Normalizar contrato de mesa (`mesa` y/o `table`) en DTOs.
- [ ] Validar lectura/escritura de archivos JSON.

## Sesion 8 - Integracion frontend/backend y limpieza final

- [ ] Centralizar contratos compartidos (tipos comunes FE/BE).
- [ ] Eliminar dependencia del catalogo local en frontend si aplica.
- [ ] Endurecer TS (`strict`) y reducir `any` residuales.
- [ ] Cerrar deuda tecnica de tipado y refactor.

---

## Criterio de cierre por sesion

- [x] `lint` pasa en el paquete tocado.
- [x] `build` pasa en el paquete tocado.
- [x] `typecheck` pasa en el paquete tocado.
- [ ] Smoke test manual minimo completado (Home -> Menu -> Carrito -> Orden -> Waiter).
