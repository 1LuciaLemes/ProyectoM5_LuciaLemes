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

## 19/07/2026

# 1 Corrección de carrito

Acomodé el carrito para que diferenciara por usuarios, porque no estaba diferenciando los items añadidos al carrito.

# 2 Tests

Lo que hice relativo a test fue:
- Configurar para poder ejecutar los tests, creé un smoke test para verificar que la configuración sea correcta.
- Fixtures: usuarios (admin/customer), carrito, producto, snapshot de orden, orden
- renderWhitProviders: testeo que los providers se aplican de forma correcta, ahora los testeo directo en el smoke
- cartReducer: testear las funciones puras(no se comunican con el exterior): additem, removeitem, clearcart, cantidades (total y totalitems)
- useCart: verifico que useCart exponga correctamente el contexto y sus acciones
- mswServer: configuré mocks de respuestas para simular llamadas HTTP. Mockeo el flujo hacia la API de /presign para probar la comunicación entre frontend, BFF y AWS sin depender de servicios externos
- checkoutFlow: Testeo el ordersService, mockeo los datos así no tengo que hacer llamados a firebase, y testeo algunas funcionalidades básicas: createOrder, createOrderFromCartItems, getOrders, getUserOrders 

## 20/07/2026 - 21/07/2026

# 1 Agregado de estilos, y trabajo visual sobre la App.

Implementaciones funcionales y de lógica:
- Contexto de Favoritos, ahora hay un corazón que se le aplica un Toggle para poder añadir o no a favoritos
- Servicio para el carrito, para que permanezca en la base de datos la información de cada carrito por usuario
- Reducción del stock en base de datos, se puede visualizar en el carrito, el stock disminuye una vez hecha la orden (aunque aparezca como pendiente todavia)
- Las ordenes se pueden modificar de sus estados, pendiente, procesando, completa, cancelada, actualizando automáticamente la base de datos

Implementaciones visuales:
- Layout genérico en la página de productos, visto como un catálogo
- Modal que notifica cuando se quiere añadir al carrito un producto y no se está logueado
- Mejora visual en el carrito de compras, ordersPage, tanto para admin como para user
- Mejora visual en la distribución de los links de navegación entre páginas
- Footer con nombre

## 23/07/2026

# 1 Revisión de requisitos faltantes contra la consigna

Usé IA para hacer un análisis exhaustivo comparando los requerimientos funcionales de la consigna con el estado actual del proyecto. La IA revisó el código fuente completo y generó una tabla de requisitos faltantes clasificados por gravedad. Esto me permitió identificar funcionalidades que creía implementadas pero que en realidad no estaban, como la búsqueda con debounce, el detalle de producto, la actualización de cantidad en carrito y la simulación de pago.

# 2 Implementación de cantidad de productos en carrito (+/-)

La IA me ayudó a diseñar la implementación de las acciones `INCREASE_QUANTITY` y `DECREASE_QUANTITY` en el reducer del carrito. Analizamos juntos que `DECREASE_QUANTITY` debería eliminar el item si la cantidad llega a 1, en vez de dejarlo en 0. También me orientó sobre cómo persistir estos cambios en Firestore antes de despachar la acción al reducer, manteniendo la consistencia entre estado local y base de datos.

# 3 Búsqueda con debounce y creación de custom hook

La IA me explicó por qué la búsqueda en cada tecla generaba demasiadas consultas a Firestore y me propuso crear un custom hook `useDebounce` que retrase la ejecución de la búsqueda 300ms después del último keystroke. Aprendí que el debounce es un patrón que consiste en usar un timer: cada vez que el usuario escribe, se reinicia el timer, y solo cuando deja de escribir por el tiempo establecido se ejecuta la acción. Esto reduce significativamente las llamadas a la base de datos.

# 4 Flujo de checkout con simulación de pago

Originalmente el botón "Comprar" en el carrito creaba la orden directamente. La IA me sugirió separar esto en un paso intermedio: primero el usuario revisa su carrito, luego navega a una página de checkout con un formulario simulado de tarjeta de crédito, y recién ahí se procesa el pago y se crea la orden. Esto cumple con el requisito de "solo simulación de pago" de la consigna y mejora la experiencia de usuario al dar un paso de confirmación.

# 5 Testeos con renderHook e integración

La IA me ayudó a reescribir los tests del hook `useCart` utilizando `renderHook` de React Testing Library en vez del wrapper manual de componentes consumidores que usaba antes. Me explicó que `renderHook` es la forma estándar de testear custom hooks de forma aislada, ya que devuelve un objeto `result` con el valor retornado por el hook, y permite ejecutar acciones con `act()` para verificar cambios de estado. También creamos tests de integración que simulan flujos completos: agregar producto, verificar cantidad, aumentar, disminuir, y eliminar.

# 6 Detalle de producto y de órdenes

La IA me orientó sobre cómo crear las páginas de detalle de producto (`/products/:id`) y de detalle de órdenes (`/orders/:id`). Para el producto, reutilicé la función `getProductById` que ya existía en el service pero no tenía una página asociada. Para las órdenes, la IA me ayudó a validar que solo el usuario dueño de la orden (o un admin) pueda ver el detalle, agregando una verificación de `userId` antes de renderizar.

# 7 Toast notifications y skeleton animado

La IA me ayudó a crear un sistema simple de toast notifications sin dependencias externas, usando Context + estado. También me mostró cómo implementar un skeleton con animación CSS shimmer (gradiente que se desplaza) para mejorar la percepción de carga, reemplazando los textos planos de "Cargando..." que teníamos antes.

