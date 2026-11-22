# ChaskiRepu

**Tu repuesto, sin dar vueltas.** Marketplace web para encontrar repuestos de autos y motos (a gasolina, híbridos y eléctricos): originales, alternativos, usados y restaurados.

Proyecto del Abstracthon 2026 (track Ayuda tecnológica).

## Qué hace

- **Vehículo 3D interactivo:** eliges auto o moto, tocas la zona que falla (llantas, frenos, motor, luces...) y la cámara se acerca; un panel te muestra las piezas de esa zona para identificar la correcta, o puedes subir una foto.
- **Búsqueda y filtros:** por nombre o descripción, precio, condición (original, alternativo, usado, restaurado) y disponibilidad.
- **Detalle del repuesto y reserva:** reserva con una comisión, elección de recoger en tienda o envío a domicilio, y pago simulado con QR.
- **Para tiendas:** inicio de sesión por rol, formulario de datos de la tienda y panel con inventario, reservas y oportunidades de venta.

## Tecnologías

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- Three.js con React Three Fiber y Drei para el vehículo 3D
- Supabase (base de datos PostgreSQL)

## Cómo correrlo

```bash
npm install
cp .env.example .env   # y completa las dos variables
npm run dev
```

Abre http://localhost:3000.

Variables de entorno (`.env`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

La app lee las tablas `proveedores` y `repuestos` de Supabase. Sin esas variables la web carga, pero sin repuestos reales.

## Estado del prototipo

Esto es un prototipo para el hackathon. Lo que es de demostración:

- **Pagos:** el pago P2P y el QR son una simulación; no se mueve dinero.
- **Inicio de sesión:** todavía no valida credenciales; solo elige el rol (buscar repuestos o tienda).
- **Datos de ejemplo:** además de los repuestos de la base de datos, se muestran algunos de ejemplo marcados con la etiqueta "Ejemplo".
- **IA:** la identificación de la pieza por foto está pendiente; hoy se sube la foto y se busca con la descripción.
- **Entrega:** la reserva y el envío no se guardan todavía en la base de datos.

## Estructura

```
app/          páginas (inicio, buscar, repuesto, entrar, tienda)
components/   interfaz y el vehículo 3D
lib/          tipos, datos de Supabase, piezas por zona
```
