[⬅️ Volver al README principal](./README.md)

# 1. Mock inicial de productos

Prompt:

Estoy desarrollando un e-commerce con React y TypeScript. Necesito crear datos mock de productos para poder comenzar a desarrollar la interfaz antes de conectar la aplicación con una base de datos real. Quiero que cada producto tenga un identificador, título, descripción, precio, imagen y stock.

Resultado:

Creé un archivo de datos mock con una lista inicial de productos tipados mediante Product. Esto me permitió comenzar a desarrollar y probar el catálogo sin depender todavía de una base de datos externa. Cada producto contiene la información necesaria para ser mostrado en la interfaz, incluyendo su precio, imagen y stock.

# 2. Estrategia de documentación del proyecto

Prompt:

Estoy desarrollando un e-commerce con React y TypeScript que más adelante voy a tener que presentar y defender. Estoy aplicando una arquitectura por capas separando types, services, contexts, hooks, components y pages.

Quiero empezar a documentar el proyecto desde ahora para no dejar todo para el final. ¿Qué estrategia me recomendás para llevar la documentación? No sé si conviene ir actualizando el README.md a medida que agrego funcionalidades, o si sería mejor tener algún documento aparte donde pueda ir anotando fechas, avances, decisiones de arquitectura, problemas que surjan y una explicación de la responsabilidad de cada archivo.

Resultado:

Decidí separar la documentación en dos archivos con objetivos diferentes:

DEVLOG.md: utilizado como bitácora del proceso de desarrollo. En él registro avances, decisiones de arquitectura, problemas encontrados, soluciones aplicadas y próximos pasos.
README.md: utilizado como documentación final del proyecto. Allí explico el objetivo de la aplicación, las tecnologías utilizadas, la arquitectura y las funcionalidades principales.

Esta separación me permite mantener un historial del proceso de desarrollo sin convertir el README.md en un registro de cambios.

# 3. Implementación de addItem y removeItem en el carrito

Prompt:

Estoy trabajando en un proyecto de e-commerce con React, TypeScript, Context API y Providers. En mi `CartProvider` el estado del carrito es un `CartItem[]`, donde cada `CartItem` contiene `productId` y `quantity`. Además, tengo un tipo `Product` con toda la información del producto.

Quiero que `addItem` reciba un `Product`, busque si ya existe un `CartItem` con ese `productId` y, si existe, incremente su cantidad. Si no existe, quiero crear un nuevo `CartItem` con `quantity: 1`.

También quiero que `removeItem` reciba un `productId`, disminuya la cantidad y elimine el ítem cuando la cantidad llegue a 0.

Resultado:

Implementé la lógica para agregar y quitar productos del carrito.

Al agregar un producto, primero compruebo si ya existe un elemento con el mismo productId. Si existe, incremento su cantidad. Si no existe, agrego un nuevo elemento con una cantidad inicial de 1.

Para eliminar un producto, primero verifico si existe en el carrito. Si su cantidad es 1, elimino completamente el elemento. Si tiene una cantidad mayor, simplemente disminuyo la cantidad en una unidad.

# 4. Ordenamiento de productos

Prompt:

Estoy desarrollando un e-commerce y quiero implementar una función de ordenamiento de productos utilizando sort. El ordenamiento debe realizarse únicamente en el estado local de React y no debe modificar la información de la base de datos.

Tengo un componente genérico `FilterButton` cuyo onClick está tipado como `() => void`, pero mis funciones de ordenamiento reciben un array de productos y devuelven otro array ordenado. ¿Cómo puedo estructurar esta lógica correctamente y mantener el tipado de TypeScript?

Resultado:

Implementé una función genérica que recibe una operación de transformación de productos:
```js
const handleProductsChange = (
  operation: (products: Product[]) => Product[],
) => {
  setProducts(operation(products));
};
```
Esto permite reutilizar la misma función para diferentes operaciones de ordenamiento.

Por ejemplo, una función que ordena los productos por precio puede recibir el array actual y devolver uno nuevo ordenado. De esta forma, el ordenamiento se realiza en el estado local y no se modifica la base de datos. También entendí que el tipo:
```js
(products: Product[]) => Product[]
```
representa una función que recibe un array de productos y devuelve otro array de productos.

# 5. Creación del servicio de autenticación

Prompt:

Creá el servicio de autenticación en `src/services/firebase/auth.service.ts`  para un proyecto React + TypeScript con Firebase Authentication.

Necesito incluir las funciones `signUp`, `signIn`, `logout`, `signInWithPopup` y `getUserProfile`.

Todas deben devolver el tipo `UserAuth` definido en `src/contexts/auth/auth.type.ts`. Quiero utilizar la instancia auth de Firebase, mapear los usuarios de Firebase a mi tipo `UserAuth`, manejar el caso de usuarios sin email y utilizar GoogleAuthProvider para el inicio de sesión mediante popup.

Resultado:

Creé un servicio separado para centralizar toda la lógica relacionada con Firebase Authentication.

De esta manera, los componentes y contextos no necesitan conocer directamente los detalles de Firebase Auth. El servicio se encarga de registrar usuarios, iniciar sesión, cerrar sesión, iniciar sesión con Google y obtener el perfil del usuario, manteniendo la lógica de autenticación separada del resto de la aplicación.

# 6. Control de rutas y roles

Prompt:

Implementá el control de rutas por autenticación y roles en este proyecto React + TypeScript utilizando react-router-dom.

Necesito que las rutas públicas sean `/` y `/products`. Las rutas `/cart` y `/orders` deben requerir un usuario autenticado. Las rutas `/admin`, `/admin/products` y `/admin/orders` deben estar disponibles únicamente para usuarios con rol admin.

Los usuarios no autenticados deben ser redirigidos al login cuando intenten acceder a una ruta protegida. Los usuarios autenticados que no sean administradores no deben poder acceder a /admin.

También quiero mantener la visibilidad de los enlaces de navegación según el estado del usuario.

Resultado:

Implementé un sistema de protección de rutas basado en autenticación y roles.

Los usuarios no autenticados no pueden acceder al carrito ni a sus órdenes. Los usuarios autenticados pueden utilizar las funcionalidades correspondientes a un cliente, mientras que los administradores también pueden acceder al panel de administración.

Además, la navegación se adapta al usuario actual: el carrito y las compras se muestran para usuarios autenticados, mientras que el acceso al panel de administración se muestra únicamente a usuarios con rol admin.

# 7. Paginación incremental de productos

Prompt:

Quiero implementar paginación incremental en la página de productos utilizando React, TypeScript y Firebase Firestore.

Al ingresar a la página quiero obtener inicialmente 10 productos. Cada vez que el usuario presione Cargar más, quiero obtener los siguientes 10 productos y agregarlos a los que ya están renderizados.

Quiero utilizar la paginación nativa de Firestore con limit, startAfter y el snapshot del último documento obtenido. No quiero volver a solicitar productos que ya fueron cargados.

Si la consulta devuelve menos de 10 productos, quiero ocultar el botón Cargar más. También quiero mantener los productos existentes visibles mientras se realiza la siguiente consulta y reutilizar los componentes de estado que ya existen en el proyecto.

Resultado:

Implementé una estrategia de paginación incremental utilizando el último documento obtenido como cursor.

La primera consulta obtiene los primeros productos y guarda el snapshot del último documento. Cuando el usuario solicita más productos, utilizo startAfter junto con ese snapshot para obtener únicamente los siguientes resultados.

Los nuevos productos se agregan a la lista existente sin reemplazar los anteriores. Además, se controla el estado de carga y se evita realizar múltiples solicitudes simultáneas mientras se está cargando la siguiente página.

# 8. Uso general de inteligencia artificial durante el desarrollo

Además de las consultas documentadas anteriormente, utilicé herramientas de inteligencia artificial como apoyo durante distintas etapas del desarrollo del proyecto. En muchos casos las utilicé para resolver dudas puntuales sobre React, TypeScript, Firebase, Firestore, CSS y la arquitectura del proyecto. También describí directamente algunas funcionalidades que necesitaba implementar y utilicé las respuestas obtenidas como base para desarrollar o adaptar el código a la estructura existente de mi aplicación.

La inteligencia artificial también fue utilizada como apoyo dentro del propio entorno de desarrollo, especialmente para resolver errores, sugerir soluciones y generar partes de código. En el caso de los estilos, la utilicé para obtener propuestas de CSS, mejorar la distribución de los componentes y adaptar los diseños para diferentes tamaños de pantalla mediante responsive design.

En todos los casos, el código generado fue revisado, adaptado e integrado manualmente al proyecto. Las decisiones finales sobre la estructura, la lógica y la implementación fueron tomadas considerando las necesidades específicas de la aplicación y la arquitectura que estaba utilizando. Por este motivo, la inteligencia artificial fue utilizada como una herramienta de apoyo durante el proceso de desarrollo, pero no como un reemplazo de la comprensión y toma de decisiones sobre el código implementado.