# Refactorización del Proyecto - Estructura Mejorada

## Resumen de Cambios

Se ha refactorizado completamente el proyecto siguiendo principios de arquitectura limpia y separación de responsabilidades. La nueva estructura mejora la mantenibilidad, reutilización de código y escalabilidad.

## Nueva Estructura de Carpetas

```
src/
├── components/
│   ├── common/                    # Componentes compartidos
│   │   ├── Header/
│   │   └── Footer/
│   │
│   └── user/                      # Componentes de usuario
│       ├── Profile/
│       │   ├── PersonalInfo.jsx           # Info personal + edición
│       │   └── ChangePassword.jsx         # Cambio de contraseña
│       ├── Orders/
│       │   ├── OrderList.jsx              # Lista de pedidos
│       │   └── OrderDetailModal.jsx       # Detalle en modal
│       └── Wishlist/
│           └── WishlistGrid.jsx           # Grid de favoritos
│
├── pages/                         # Páginas/Vistas principales
│   ├── ClientSide/                # Páginas públicas
│   │   ├── HeroPage/
│   │   ├── About/
│   │   ├── Catalogo/
│   │   ├── Blogs/
│   │   └── Contacto/
│   └── user/                      # Páginas de usuario
│       └── UserProfile.jsx        # Perfil refactorizado
│
├── routes/                        # Componentes de rutas
│   ├── PrivateRoute.jsx           # HOC para rutas privadas
│   └── AdminRoute.jsx             # HOC para rutas de admin
│
├── services/                      # Capa de servicios (API calls)
│   ├── authService.js             # Login, signup, logout, getCurrentUser
│   ├── userService.js             # Profile, orders, favorites, cart
│   ├── mangaService.js            # Operaciones con manga
│   └── newsletterService.js       # Newsletter
│
└── utils/                         # Funciones auxiliares
    ├── auth.js                    # Funciones de autenticación
    └── roleChecker.js             # Verificación de roles
```

## Componentes Creados

### Services (Capa de API)

#### `authService.js`
- `login(email, password)` - Autenticación de usuario
- `signup(userData)` - Registro de nuevo usuario
- `getCurrentUser()` - Obtener usuario actual desde API
- `logout()` - Cerrar sesión
- `isAuthenticated()` - Verificar si está autenticado
- `getUser()` - Obtener usuario de localStorage
- `getToken()` - Obtener token
- `isAdmin()` - Verificar si es admin
- `isUser()` - Verificar si es usuario regular

#### `userService.js`
- `updateProfile(userId, userData)` - Actualizar perfil
- `getUserOrders(userId)` - Obtener pedidos del usuario
- `getOrderDetails(orderId)` - Obtener detalle de un pedido
- `getUserFavorites(userId)` - Obtener favoritos
- `addToFavorites(userId, mangaId)` - Agregar a favoritos
- `removeFromFavorites(favoritoId)` - Eliminar de favoritos
- `getUserCart(userId)` - Obtener carrito
- `addToCart(userId, mangaId, cantidad)` - Agregar al carrito
- `removeFromCart(carritoId)` - Eliminar del carrito
- `updateCartQuantity(carritoId, cantidad)` - Actualizar cantidad

### Utils (Funciones Auxiliares)

#### `auth.js`
- `isAuthenticated()` - Verificar autenticación
- `getCurrentUser()` - Obtener usuario actual
- `getAuthToken()` - Obtener token
- `saveUser(user)` - Guardar usuario en localStorage
- `saveToken(token)` - Guardar token
- `clearAuth()` - Limpiar datos de autenticación
- `validateEmail(email)` - Validar formato de email
- `validatePassword(password)` - Validar contraseña
- `passwordsMatch(pass1, pass2)` - Verificar que coincidan
- `getUserId()` - Obtener ID de usuario
- `getUserRole()` - Obtener rol
- `getUserName()` - Obtener nombre completo

#### `roleChecker.js`
- `isAdmin()` - Verificar si es admin
- `isUser()` - Verificar si es usuario
- `hasRole(role)` - Verificar rol específico
- `hasAnyRole(roles)` - Verificar múltiples roles
- `canAccessAdmin()` - Puede acceder al panel admin
- `canManageProducts()` - Puede gestionar productos
- `canManageUsers()` - Puede gestionar usuarios
- `canViewOrders()` - Puede ver pedidos
- `canManageAllOrders()` - Puede gestionar todos los pedidos
- `ownsResource(resourceUserId)` - Es dueño del recurso
- `canEditResource(resourceUserId)` - Puede editar recurso
- `canDeleteResource(resourceUserId)` - Puede eliminar recurso

### Routes (Protección de Rutas)

#### `PrivateRoute.jsx`
HOC que protege rutas que requieren autenticación. Redirige a home si no está autenticado.

**Uso:**
```jsx
<Route
  path="/perfil"
  element={
    <PrivateRoute>
      <UserProfile />
    </PrivateRoute>
  }
/>
```

#### `AdminRoute.jsx`
HOC que protege rutas que requieren rol de administrador. Redirige a home si no es admin.

**Uso:**
```jsx
<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminPanel />
    </AdminRoute>
  }
/>
```

### Components - User

#### `PersonalInfo.jsx`
Componente reutilizable que muestra y edita información personal del usuario.

**Props:**
- `user` - Objeto usuario
- `editMode` - Boolean modo edición
- `formData` - Datos del formulario
- `setFormData` - Función para actualizar form
- `onEdit` - Callback al hacer click en editar
- `onSave` - Callback al guardar
- `onCancel` - Callback al cancelar

#### `OrderList.jsx`
Lista de pedidos del usuario con tabla responsive y badges de estado.

**Props:**
- `orders` - Array de pedidos
- `onViewDetails` - Callback para ver detalle (pedidoId)

#### `OrderDetailModal.jsx`
Modal de Bootstrap con detalle completo del pedido y sus productos.

**Props:**
- `order` - Objeto pedido con detalles

#### `WishlistGrid.jsx`
Grid responsive de mangas favoritos con cards.

**Props:**
- `favoritos` - Array de favoritos
- `onRemove` - Callback para eliminar (favoritoId)

#### `ChangePassword.jsx`
Formulario para cambiar contraseña con validación.

**Props:**
- `passwordData` - Objeto con contraseñas
- `setPasswordData` - Función para actualizar
- `onSubmit` - Callback al enviar formulario

## Páginas Refactorizadas

### `UserProfile.jsx` (antes ClientProfile.jsx)
Página principal del perfil de usuario completamente refactorizada usando los nuevos componentes.

**Características:**
- Usa `authService` y `userService` en lugar de fetch directo
- Componentes pequeños y reutilizables
- Lógica de negocio separada
- Más limpio y mantenible (200 líneas vs 660)

## Migración y Compatibilidad

### Rutas Actualizadas
- `/perfil` - Ahora usa `UserProfile` con `PrivateRoute`
- `/profile` - Mantenida para compatibilidad (se puede eliminar)

### Cambios en App.jsx
- Importa `PrivateRoute` para proteger rutas
- Rutas organizadas por tipo (públicas, protegidas)
- Comentarios claros sobre cada sección

## Beneficios de la Refactorización

1. **Separación de Responsabilidades**
   - Services maneja todas las llamadas API
   - Utils tiene funciones auxiliares reutilizables
   - Components son pequeños y enfocados

2. **Reutilización de Código**
   - Componentes pueden usarse en múltiples páginas
   - Services centralizan lógica de API
   - Utils evitan duplicación

3. **Mantenibilidad**
   - Código más fácil de entender
   - Cambios localizados
   - Testing más sencillo

4. **Escalabilidad**
   - Fácil agregar nuevas features
   - Estructura clara para el equipo
   - Preparado para crecer

5. **Seguridad**
   - Rutas protegidas con HOCs
   - Verificación de roles centralizada
   - Validaciones en utils

## Próximos Pasos Sugeridos

### Componentes Pendientes
- [ ] Refactorizar Header en subcomponentes (AuthButtons, NavLinks)
- [ ] Crear Layout component común
- [ ] Crear componentes de admin (Dashboard, MangaManagement, etc)

### Features Adicionales
- [ ] Implementar cambio de contraseña en backend
- [ ] Agregar toast notifications en lugar de alerts
- [ ] Implementar loading states en componentes
- [ ] Agregar manejo de errores más robusto

### Testing
- [ ] Tests unitarios para services
- [ ] Tests de integración para components
- [ ] Tests E2E para flujos principales

## Uso de los Nuevos Servicios

### Ejemplo: Login
```javascript
import authService from './services/authService';

// Login
const handleLogin = async (email, password) => {
  try {
    const data = await authService.login(email, password);
    // data contiene { user, authToken }
    console.log('Usuario logueado:', data.user);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### Ejemplo: Obtener Pedidos
```javascript
import userService from './services/userService';
import { getUserId } from './utils/auth';

const loadOrders = async () => {
  try {
    const userId = getUserId();
    const orders = await userService.getUserOrders(userId);
    console.log('Pedidos:', orders);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### Ejemplo: Verificar Rol
```javascript
import { isAdmin, canManageProducts } from './utils/roleChecker';

if (isAdmin()) {
  console.log('Usuario es administrador');
}

if (canManageProducts()) {
  // Mostrar opciones de gestión
}
```

## Notas Importantes

1. **Backward Compatibility**: El `ClientProfile.jsx` original se mantiene para evitar romper código existente

2. **Migration Path**: Se recomienda migrar gradualmente:
   - Fase 1: Usar nuevos services en páginas existentes
   - Fase 2: Refactorizar componentes grandes
   - Fase 3: Eliminar código legacy

3. **Testing**: Probar todas las funcionalidades después de la refactorización

4. **Documentation**: Mantener este documento actualizado con nuevos cambios
