# Cuaderno de desarrollo

## 07/07/2026

# Organización inicial del proyecto

Se definió la arquitectura inicial del proyecto utilizando una separación por capas.

La estructura se organizó en:

- types
- contexts
- providers
- hooks
- components
- pages
- services
- styles

El objetivo de esta organización es separar responsabilidades, mantener el código modular y facilitar futuras modificaciones o incorporación de nuevas funcionalidades.

---

# 1. Implementación inicial: Productos

Como primera funcionalidad del e-commerce se comenzó trabajando sobre el dominio de productos.

Se creó la estructura necesaria para manejar los productos utilizando:

- TypeScript para definir el contrato de los datos.
- Context API para manejar el estado global de productos.
- Providers para exponer la información a la aplicación.
- Custom Hooks para consumir el contexto de forma segura mediante validaciones.

---

# Datos mockeados

Debido a que la integración con base de datos todavía no fue realizada, se implementaron datos mockeados para poder avanzar con el desarrollo y probar el funcionamiento del flujo de productos.

La capa de servicios queda preparada para que posteriormente estos datos puedan ser reemplazados por información proveniente de una API o base de datos sin afectar la lógica de la interfaz.

---
# 2. Implementación inicial: Cart
Se continuó con la funcionalidad de Cart.

Donde se creó la estructura necesaria para manejar el carrito:

- TypeScript para definir el contrato del carrito.
- Context API para manejar el estado global del carrito,
- El Provider para exponer la información a la app.
- Custom Hook para validar el uso del contexto correctamente.

## 11/07/2026

# Conexión de Firebase con Firestore para productos

En esta parte del desarrollo realicé la conexión del proyecto con Firebase para empezar a trabajar con una base de datos real.

Hasta este momento los productos se estaban obteniendo desde un mock, por lo que actualicé el `productsService` para que ahora pueda hacer las consultas directamente a Firestore y traer la información almacenada en la base de datos.

Los cambios principales fueron:

- Configuré Firebase dentro del proyecto.
- Conecté la aplicación con Firestore.
- Modifiqué las funciones de `productsService` para reemplazar la lógica anterior por consultas a Firestore.
- Probé la obtención de productos desde la base de datos.

## 12/07/2026

# 1. Implementación de filtros 
Realicé los filtros de búsqueda necesarios para la página, modifiqué el type de products para que sea
compatible con las categorias.

- Filtros con consultas directas a firestone: Los filtros por género (masculino, femenino, unisex) y por
categoría (adulto, niño) son consultas a la base de datos en Firestone para lograr una mejor escalabilidad el día de mañana.

- Ordenamiento de productos: son los "filtros" que reciben ya los productos de la base de datos y los ordenan, en este caso por: menor/mayor precio y por último añadido al catálogo. 
