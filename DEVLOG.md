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

## 09/07/2026

objetivos: 
- agregar llamado a firebase, conectar base de datos, indexs para filtrar productos
recordar: manejar try/catch para los errores
- agregar loading, succes, error para comunicar al usuario qué sucede en la app, depende del
estado que se va seteando cuando llega (o no) la respuesta del fetch a la base de datos
