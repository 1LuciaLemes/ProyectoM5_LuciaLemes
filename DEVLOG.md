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

# 2. Añadir UI de filtros básica

Añadí la UI referente a los filtros, para además visualizar que los cambios se estén aplicando.

Modifiqué el archivo, porque habia hecho un botón genérico y sobre ese
otro que en verdad trabajaban igual.

# 3. Añadir estados base reutilizables

Agregué los estados de loading, error, empty (falta succes) para manejar los estados visuales que se le informan al usuario cuando carga productos.

## 13/07/2026

# El carrito pasa de trabajar con useState a useReducer

Se modifica la lógica de cómo trabaja el carrito, pasando de useState a useReducer.

Elegí useReducer porque el carrito tiene varias operaciones que afectan el mismo estado. En lugar de realizar varias actualizaciones con useState, con useReducer cada operación se representa mediante una acción, por ejemplo ADD_ITEM, REMOVE_ITEM o CLEAR_CART, que se envía mediante dispatch.

El reducer recibe esa acción y, según el valor de action.type, ejecuta la lógica correspondiente para devolver el nuevo estado. De esta forma, toda la lógica de actualización queda centralizada en un solo lugar, haciendo el código más organizado, fácil de mantener y escalable.

## 14/07/2026

# Authentication

Añadí la lógica para la autenticación desde firebase, con los roles incluídos, de customer y de admin, realicé el service, el type, context.

## 15/07/2026

# Seed

Realicé el seed para cargar los productos (por ahora con imagenes random), aproveche para modificar los filtros y añadir un filtro por marca, y probarlo visualmente. (Me sigue faltando generar toda la estética general)

## 17/07/2026

# 1 Navegación de la app

Implementé la navegación de la app, generé cada página que planeo precisar, por ahora (me falta la pagina del producto individual). Falta implementar las paginas con autenticación, para admin y para user.

# 2 Diferenciar logueo entre admin y usuario

Agregué ProtectedRoute para diferenciar el logueo entre usuarios y admin.

- La sesión persiste aunque se recargue la página
- Se diferencia entre rol admin/customer, cada cual ve las rutas que debe
- Se añadió formulario para iniciar sesión/registrarse 
- Añadi el componente (btn) para cerrar sesión
- Páginas de admin, /admin/products, /admin/orders

# 3 Paginacion

Implementé que cuando cargo la página de productos, comienza con un límite, y existe un botón (Cargar más) que carga más productos y mantiene un snapshot de los anteriores, por lo que no se pierden y se muestran los nuevos y los anteriores.

- Se cargan 10 productos máximo

## 18/07/2026

# 1 Admin CRUD

Implementé los CRUD de admin, donde puedo editar, crear y eliminar producto.
Generé el bucket, el cual falta implementar.

- Separé el componente "searchBar" para reutilizarlo también en admin así busca por nombre los productos
- Genero y reutilizo el formulario tanto para editar/crear producto, el form tiene sus propias validaciones
- Añado la paginación también en los productos mostrados a admin

# 2 Conexión Front - BFF - AWS

1. El administrador selecciona una imagen en el formulario.
2. El frontend envía una solicitud a la Serverless Function (/api/presign).
3. La Serverless Function genera una URL prefirmada utilizando las credenciales de AWS.
4. El frontend realiza un PUT directo al bucket S3 usando esa URL.
5. AWS almacena la imagen y esta queda accesible mediante una URL pública.
6. El frontend crea el producto en Firestore guardando esa URL pública en el campo `image`.

# 3 Gestión de órdenes

Añadí el CRUD de órdenes, donde se crean, y se muestran.
- Un usuario puede ver sólo sus órdenes
- Admin puede ver todas las órdenes

## 18/07/2026

# 1 Corrección de carrito

Acomodé el carrito para que diferenciara por usuarios, porque no estaba diferenciando los items añadidos al carrito.