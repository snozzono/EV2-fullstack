# MangaStore - Tienda de Mangas Online

## Descripción del Proyecto

**MangaStore** es una plataforma de comercio electrónico completa desarrollada para la venta de mangas y productos relacionados. El proyecto cuenta con dos componentes principales:

### Frontend (React + Vite)
Aplicación web moderna y responsive construida con React que ofrece:
- **Catálogo de productos** con búsqueda y filtrado avanzado
- **Sistema de usuarios** con perfiles personalizados
- **Panel de administración** completo para gestión de usuarios, productos y pedidos
- **Carrito de compras** y sistema de favoritos
- **Blog integrado** con noticias y reseñas
- **Formulario de contacto** para atención al cliente
- **Diseño responsive** optimizado para dispositivos móviles y desktop

### Backend (Spring Boot + MySQL)
API REST robusta que proporciona:
- **Gestión completa de usuarios** con diferentes roles (cliente, vendedor, super-admin)
- **CRUD de productos** (mangas) con control de stock
- **Sistema de pedidos** con seguimiento de estados
- **Categorías y editoriales** para organización de productos
- **Sistema de comentarios y calificaciones**
- **Carrito de compras persistente**
- **Favoritos de usuarios**
- **Blog con contenido dinámico**
- **Documentación automática** con Swagger/OpenAPI

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│  React 18 + Vite + React Router + Bootstrap 5               │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │   Cliente   │  │   Vendedor   │  │  Super Admin    │    │
│  │  Público    │  │   Gestión    │  │  Panel Control  │    │
│  └─────────────┘  └──────────────┘  └─────────────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API (HTTPS)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY                             │
│                   Xano / Spring Boot                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│              Spring Boot 3.5.6 + Java 21                     │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │ Controllers  │→ │   Services    │→ │  Repositories   │  │
│  │  (REST API)  │  │  (Business)   │  │   (JPA/Data)    │  │
│  └──────────────┘  └───────────────┘  └─────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ JDBC
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS                             │
│              MySQL 8.0 (mangaStore)                          │
│   14 Tablas | Relaciones | Índices | Constraints            │
└─────────────────────────────────────────────────────────────┘
```

---

## Tecnologías Utilizadas

### Frontend

| Categoría | Tecnología | Versión | Descripción |
|-----------|-----------|---------|-------------|
| **Framework** | React | 18.3.1 | Librería principal para UI |
| **Build Tool** | Vite | 5.4.10 | Empaquetador y servidor de desarrollo |
| **Routing** | React Router DOM | 7.1.1 | Navegación y rutas |
| **UI Framework** | Bootstrap | 5.3.3 | Framework CSS y componentes |
| **Icons** | Bootstrap Icons | 1.11.3 | Iconografía |
| **Lenguaje** | JavaScript (ES6+) | - | Lenguaje de programación |
| **Estilos** | CSS3 | - | Hojas de estilo personalizadas |

**DevDependencies:**
- ESLint 9.13.0 - Linter de código
- Vite Plugin React 4.3.3 - Integración React con Vite
- @vitejs/plugin-react 4.3.4 - Plugin oficial de Vite

### Backend

| Categoría | Tecnología | Versión | Descripción |
|-----------|-----------|---------|-------------|
| **Framework** | Spring Boot | 3.5.6 | Framework principal |
| **Lenguaje** | Java | 21 | Lenguaje de programación |
| **ORM** | Spring Data JPA | 3.5.6 | Persistencia y ORM |
| **Base de Datos** | MySQL | 8.0+ | Sistema de gestión de BD |
| **Validaciones** | Jakarta Validation | - | Validación de datos |
| **Documentación** | SpringDoc OpenAPI | 2.5.0 | Swagger UI y OpenAPI 3 |
| **Utilidades** | Lombok | - | Reducción de código boilerplate |
| **Testing** | JUnit Jupiter | - | Framework de testing |
| **Mocking** | Mockito | - | Mocking para tests |
| **Build Tool** | Maven | 3.x | Gestión de dependencias |

**Conectores y Drivers:**
- MySQL Connector Java (Runtime)
- Hibernate MySQL8Dialect

---

## Estructura del Proyecto

### Frontend - Estructura de Directorios

```
EV2-fullstack/
├── public/                          # Archivos estáticos públicos
│   ├── images/                      # Imágenes del sitio
│   └── favicon.ico                  # Icono del sitio
├── src/
│   ├── assets/                      # Recursos estáticos
│   ├── components/                  # Componentes reutilizables
│   │   ├── admin/
│   │   │   └── UserManagement/      # Gestión de usuarios admin
│   │   ├── common/
│   │   │   └── Header/              # Modal de login
│   │   ├── user/
│   │   │   ├── Orders/              # Pedidos del usuario
│   │   │   ├── Profile/             # Perfil de usuario
│   │   │   └── Wishlist/            # Lista de deseos
│   │   ├── Header/                  # Header principal
│   │   └── Footer/                  # Footer del sitio
│   ├── pages/                       # Páginas principales
│   │   ├── AdminSide/
│   │   │   └── AdminProfile.jsx     # Panel de administración
│   │   └── ClientSide/
│   │       ├── HeroPage/            # Página de inicio
│   │       ├── About/               # Sobre nosotros
│   │       ├── Catalogo/            # Catálogo de productos
│   │       ├── Blogs/               # Blog
│   │       ├── Contacto/            # Formulario de contacto
│   │       ├── ClientProfile/       # Perfil de cliente
│   │       └── UserProfile.jsx      # Perfil de usuario
│   ├── routes/                      # Configuración de rutas
│   │   ├── AdminRoute.jsx           # Rutas protegidas admin
│   │   └── PrivateRoute.jsx         # Rutas privadas
│   ├── services/                    # Servicios de API
│   │   ├── authService.js           # Autenticación
│   │   ├── userService.js           # Gestión de usuarios
│   │   ├── mangaService.js          # Gestión de mangas
│   │   └── newsletterService.js     # Newsletter
│   ├── utils/                       # Utilidades
│   │   ├── auth.js                  # Funciones de autenticación
│   │   └── roleChecker.js           # Verificación de roles
│   ├── App.jsx                      # Componente principal
│   ├── App.css                      # Estilos globales
│   └── main.jsx                     # Punto de entrada
├── index.html                       # HTML principal
├── package.json                     # Dependencias y scripts
├── vite.config.js                   # Configuración de Vite
└── README.md                        # Este archivo
```

### Backend - Estructura de Directorios

```
trabajo2.2/
├── src/main/java/com/duoc/trabajo22/
│   ├── Application.java             # Punto de entrada Spring Boot
│   ├── config/
│   │   └── OpenApiConfig.java       # Configuración Swagger
│   ├── controller/                  # Controladores REST
│   │   ├── AuthController.java      # Autenticación
│   │   ├── UsuarioController.java   # CRUD Usuarios
│   │   ├── MangaController.java     # CRUD Mangas
│   │   ├── BlogController.java      # CRUD Blog
│   │   └── CarritoController.java   # Carrito de compras
│   ├── service/                     # Lógica de negocio
│   │   ├── UsuarioService.java
│   │   ├── MangaService.java
│   │   ├── BlogService.java
│   │   └── CarritoService.java
│   ├── repository/                  # Repositorios JPA
│   │   ├── UsuarioRepository.java
│   │   ├── MangaRepository.java
│   │   ├── BlogRepository.java
│   │   ├── CarritoRepository.java
│   │   ├── CategoriaRepository.java
│   │   ├── EditorialRepository.java
│   │   ├── ComentarioRepository.java
│   │   ├── FavoritoRepository.java
│   │   ├── PedidoRepository.java
│   │   ├── DetallepedidoRepository.java
│   │   └── [otros repositorios...]
│   ├── model/                       # Entidades JPA
│   │   ├── Usuario.java
│   │   ├── Manga.java
│   │   ├── Categoria.java
│   │   ├── Editorial.java
│   │   ├── Pedido.java
│   │   ├── Detallepedido.java
│   │   ├── Carrito.java
│   │   ├── Comentario.java
│   │   ├── Favorito.java
│   │   ├── Blog.java
│   │   └── [otras entidades...]
│   └── dto/                         # Data Transfer Objects
│       ├── LoginRequest.java
│       └── LoginResponse.java
├── src/main/resources/
│   ├── application.properties       # Configuración de aplicación
│   ├── data.sql                     # Datos iniciales
│   └── data_corregido.sql           # Datos corregidos
├── src/test/java/                   # Tests unitarios
│   ├── ApplicationTests.java
│   └── service/
│       ├── MangaServiceTest.java
│       └── UsuarioServiceTest.java
├── pom.xml                          # Dependencias Maven
├── HELP.md                          # Ayuda de Spring Boot
└── RESUMEN_IMPLEMENTACION.md        # Documentación técnica
```

---

## Instrucciones de Instalación

### Requisitos Previos

#### Para el Frontend
- **Node.js** 18.x o superior
- **npm** 9.x o superior (incluido con Node.js)
- Un navegador web moderno (Chrome, Firefox, Edge, Safari)

#### Para el Backend
- **Java JDK** 21
- **Maven** 3.8+ (o usar el Maven Wrapper incluido)
- **MySQL** 8.0+ (puede ser XAMPP, WAMP, o instalación independiente)
- **IDE recomendado:** IntelliJ IDEA, Eclipse, o VS Code con extensiones Java

### Instalación del Frontend

1. **Clonar el repositorio (si aplica):**
```bash
git clone https://github.com/snozzono/EV2-fullstack.git
cd EV2-fullstack
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**

Crear/editar el archivo `archivo.env` en la raíz del proyecto:

```env
REACT_APP_API_URL=http://localhost:8080/v1
VITE_XANO_STORE_BASE=https://x8ki-letl-twmt.n7.xano.io/api:Qx1w8oou
VITE_XANO_AUTH_BASE=https://x8ki-letl-twmt.n7.xano.io/api:8a3HDoeS
```

> **Nota:** Actualmente el frontend está conectado a Xano. Para conectar al backend Spring Boot local, se deberá modificar los servicios en `src/services/`.

4. **Verificar instalación:**
```bash
npm list
```

### Instalación del Backend

1. **Navegar al directorio del backend:**
```bash
cd C:\Users\snozz\Desktop\Ev2-fullstack-back\trabajo2.2
```

2. **Configurar MySQL:**

- Iniciar el servidor MySQL (XAMPP, servicio de Windows, etc.)
- Crear la base de datos:

```sql
CREATE DATABASE mangaStore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **Configurar conexión a la base de datos:**

Editar `src/main/resources/application.properties`:

```properties
# Configuración de Base de Datos
spring.datasource.url=jdbc:mysql://localhost:3306/mangaStore
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Configuración JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# Configuración del Servidor
server.port=8080

# Otras configuraciones
spring.thymeleaf.cache=false
```

> **Importante:** Ajustar `username` y `password` según tu configuración de MySQL.

4. **Instalar dependencias Maven:**

Opción A - Con Maven instalado:
```bash
mvn clean install
```

Opción B - Con Maven Wrapper (incluido):
```bash
# Windows
mvnw.cmd clean install

# Linux/Mac
./mvnw clean install
```

5. **Cargar datos iniciales:**

Ejecutar el archivo `src/main/resources/data.sql` en tu cliente MySQL:

```bash
mysql -u root -p mangaStore < src/main/resources/data.sql
```

O usando phpMyAdmin:
- Abrir phpMyAdmin
- Seleccionar la base de datos `mangaStore`
- Ir a la pestaña "SQL"
- Copiar y pegar el contenido de `data.sql`
- Ejecutar

6. **Verificar instalación:**
```bash
mvn test
```

Deberías ver que todos los tests pasan exitosamente.

---

## Instrucciones de Ejecución

### Ejecutar el Frontend

#### Modo Desarrollo (con hot reload)
```bash
# Desde la raíz del proyecto frontend
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

#### Modo Producción (build)
```bash
# Crear build de producción
npm run build

# Previsualizar build
npm run preview
```

El build se generará en la carpeta `dist/` y estará disponible en: **http://localhost:4173**

#### Scripts Disponibles
```bash
npm run dev         # Inicia servidor de desarrollo
npm run build       # Crea build de producción
npm run preview     # Previsualiza build de producción
npm run lint        # Ejecuta ESLint para revisar código
```

### Ejecutar el Backend

#### Desde la línea de comandos

Opción A - Con Maven instalado:
```bash
cd C:\Users\snozz\Desktop\Ev2-fullstack-back\trabajo2.2
mvn spring-boot:run
```

Opción B - Con Maven Wrapper:
```bash
# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

Opción C - Ejecutar JAR compilado:
```bash
mvn clean package
java -jar target/trabajo2.2-0.0.1-SNAPSHOT.jar
```

#### Desde un IDE (IntelliJ IDEA, Eclipse)

1. Abrir el proyecto en el IDE
2. Localizar la clase `Application.java` en `src/main/java/com/duoc/trabajo22/`
3. Hacer clic derecho → "Run 'Application.main()'"

#### Verificar que el backend está corriendo

Una vez iniciado, deberías ver en la consola:
```
Started Application in X.XXX seconds
```

El backend estará disponible en: **http://localhost:8080**

### Acceder a la Documentación de la API

Con el backend ejecutándose, puedes acceder a:

- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8080/v3/api-docs

---

## Credenciales de Prueba

### Usuarios Predefinidos (Backend)

#### Super Administrador
```
Email: admin@mangastore.com
Password: admin123
Rol: super-admin
Descripción: Acceso completo al sistema
```

#### Usuario de Prueba 1
```
Email: juan@example.com
Password: juan123
Rol: cliente
Descripción: Usuario cliente regular
```

#### Usuario de Prueba 2
```
Email: maria@example.com
Password: maria123
Rol: cliente
Descripción: Usuario cliente regular
```

### Datos de Prueba Disponibles

El sistema viene precargado con:

- **1 Usuario administrador** (admin@mangastore.com)
- **15 Productos/Mangas** con stock variado:
  - One Piece Vol. 1 ($9,990 - Stock: 50)
  - Naruto Vol. 1 ($8,990 - Stock: 40)
  - Attack on Titan Vol. 1 ($10,990 - Stock: 35)
  - Death Note Vol. 1 ($9,990 - Stock: 30)
  - My Hero Academia Vol. 1 ($8,990 - Stock: 60)
  - Y más...

- **7 Categorías:**
  - Shonen
  - Seinen
  - Shojo
  - Kodomo
  - Isekai
  - Acción
  - Romance

- **3 Editoriales:**
  - Shueisha (Japón)
  - Kodansha (Japón)
  - Panini Comics (Chile)

### Probar la API con cURL

#### Login de Usuario
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mangastore.com",
    "password": "admin123"
  }'
```

#### Obtener Todos los Productos
```bash
curl -X GET http://localhost:8080/api/productos
```

#### Crear un Nuevo Usuario
```bash
curl -X POST http://localhost:8080/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "apellidos": "Usuario",
    "email": "test@example.com",
    "password": "test123",
    "direccion": "Calle Test 123",
    "telefono": "+56912345678",
    "tipoUsuario": "cliente"
  }'
```

---

## Endpoints Principales de la API

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login de usuario |
| GET | `/api/auth/validar-admin/{id}` | Verificar si es admin/vendedor |

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/usuarios` | Obtener todos los usuarios |
| GET | `/api/usuarios/{id}` | Obtener usuario por ID |
| POST | `/api/usuarios` | Crear nuevo usuario |
| PUT | `/api/usuarios/{id}` | Actualizar usuario |
| DELETE | `/api/usuarios/{id}` | Eliminar usuario |
| PATCH | `/api/usuarios/{id}/inactivar` | Inactivar usuario |

### Productos (Mangas)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Obtener todos los productos |
| GET | `/api/productos/{id}` | Obtener producto por ID |
| POST | `/api/productos` | Crear nuevo producto |
| PUT | `/api/productos/{id}` | Actualizar producto |
| DELETE | `/api/productos/{id}` | Eliminar producto |
| PATCH | `/api/productos/{id}/inactivar` | Inactivar producto |
| PATCH | `/api/productos/{id}/stock` | Actualizar stock (query: cantidad) |

### Blog

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/v1/blogs` | Obtener todos los blogs |
| GET | `/v1/blogs/{id}` | Obtener blog por ID |
| POST | `/v1/blogs` | Crear nuevo blog |
| PUT | `/v1/blogs/{id}` | Actualizar blog |
| DELETE | `/v1/blogs/{id}` | Eliminar blog |

---

## Funcionalidades Implementadas

### Frontend

#### Funcionalidades Públicas
- ✅ Página de inicio (Hero Page) con productos destacados
- ✅ Catálogo de productos con búsqueda y filtros
- ✅ Vista detallada de productos
- ✅ Blog con artículos y noticias
- ✅ Página "Sobre Nosotros"
- ✅ Formulario de contacto
- ✅ Modal de login/registro
- ✅ Diseño responsive (mobile-first)

#### Funcionalidades de Usuario (Autenticado)
- ✅ Perfil de usuario editable
- ✅ Cambio de contraseña
- ✅ Lista de pedidos con historial
- ✅ Vista de detalles de pedidos
- ✅ Lista de deseos/favoritos
- ✅ Carrito de compras persistente

#### Panel de Administración
- ✅ Dashboard con estadísticas (en desarrollo)
- ✅ **Gestión de Usuarios:**
  - ✅ Ver lista completa de usuarios
  - ✅ Buscar usuarios por nombre, apellidos o email
  - ✅ Filtrar por rol (usuario/admin)
  - ✅ Editar datos de usuarios
  - ✅ Cambiar rol de usuarios
  - ✅ Eliminar usuarios
  - ✅ Conectado con backend Xano
- ⏳ Gestión de productos (pendiente)
- ⏳ Gestión de pedidos (pendiente)
- ⏳ Gestión de blog (pendiente)
- ⏳ Configuración del sistema (pendiente)

#### Características Técnicas
- ✅ Routing con React Router v7
- ✅ Rutas protegidas (PrivateRoute)
- ✅ Rutas de admin (AdminRoute)
- ✅ Autenticación con localStorage
- ✅ Servicios de API modulares
- ✅ Componentes reutilizables
- ✅ Diseño modular y escalable

### Backend

#### Sistema de Usuarios
- ✅ CRUD completo de usuarios
- ✅ Autenticación básica (email + password)
- ✅ Roles: cliente, vendedor, super-admin
- ✅ Activación/desactivación de usuarios
- ✅ Búsqueda por email
- ⚠️ Contraseñas en texto plano (ADVERTENCIA: implementar BCrypt para producción)

#### Sistema de Productos
- ✅ CRUD completo de mangas/productos
- ✅ Gestión de stock con validaciones
- ✅ Búsquedas avanzadas:
  - Por título (español u original)
  - Por autor
  - Por categoría
  - Por editorial
  - Por rango de precio
  - Por año de publicación
  - Por estado de serie
  - Por idioma
- ✅ Productos con stock crítico
- ✅ Productos más vendidos
- ✅ Productos recientes
- ✅ Control de stock (no permite negativos)

#### Catálogo y Clasificación
- ✅ Categorías (Shonen, Seinen, Shojo, etc.)
- ✅ Editoriales con información del país
- ✅ Relaciones Many-to-Many entre Manga y Categoría

#### Sistema de Compras
- ✅ Modelo de Carrito (sin endpoints completos)
- ✅ Modelo de Pedidos con estados
- ✅ Detalle de pedidos
- ✅ Estados: pendiente, procesando, enviado, entregado
- ✅ Métodos de pago: webpay, transferencia, efectivo

#### Interacción de Usuarios
- ✅ Sistema de comentarios en productos
- ✅ Calificaciones (1-5 estrellas)
- ✅ Sistema de favoritos
- ✅ Mensajes de contacto

#### Blog
- ✅ CRUD de artículos de blog
- ✅ Contenido enriquecido (LONGTEXT)
- ✅ Imágenes de portada
- ✅ Publicación con fecha

#### Documentación y Testing
- ✅ Swagger UI integrado
- ✅ OpenAPI 3.0 specification
- ✅ Tests unitarios con JUnit 5 y Mockito
- ✅ 7 tests implementados (todos pasando)

---

## Características Técnicas Destacadas

### Frontend

#### Optimizaciones
- **Code splitting** con React Router
- **Lazy loading** de componentes
- **Hot Module Replacement (HMR)** con Vite
- Build optimizado para producción

#### Buenas Prácticas
- Componentes funcionales con Hooks
- Separación de lógica de negocio en servicios
- Utilidades reutilizables
- CSS modular por componente
- Validación de formularios

### Backend

#### Arquitectura
- **Patrón MVC/N-Tier** (Controller → Service → Repository → Database)
- **Inyección de dependencias** con Spring
- **DTOs** para transferencia de datos
- **Validaciones** con Jakarta Validation
- **Manejo de excepciones** centralizado

#### Base de Datos
- **ORM:** Hibernate/JPA
- **Estrategia de generación:** update (desarrollo), validate/none (producción recomendado)
- **Lazy loading** en relaciones
- **Cascade types** configurados
- **OnDelete.CASCADE** para integridad referencial
- **Índices** en campos únicos

#### Testing
- Tests unitarios con **JUnit Jupiter**
- Mocking con **Mockito**
- Cobertura de servicios críticos
- Tests de integración preparados

---

## Próximos Pasos y Mejoras Recomendadas

### Seguridad
- [ ] Implementar **BCrypt** para encriptación de contraseñas
- [ ] Agregar **JWT** (JSON Web Tokens) para sesiones
- [ ] Implementar **CORS** configurado correctamente
- [ ] Agregar **Spring Security** con roles
- [ ] Validar entrada de datos con sanitización
- [ ] Implementar rate limiting para endpoints públicos

### Funcionalidades Backend
- [ ] Completar endpoints de Carrito
- [ ] Completar endpoints de Pedidos
- [ ] Implementar integración con **Webpay Plus**
- [ ] Sistema de notificaciones por email
- [ ] Subida de imágenes (CloudStorage/S3)
- [ ] Paginación en todos los listados
- [ ] Sistema de búsqueda con **Elasticsearch**

### Funcionalidades Frontend
- [ ] Conectar frontend con backend Spring Boot (reemplazar Xano)
- [ ] Completar panel de administración:
  - Gestión de productos
  - Gestión de pedidos
  - Gestión de blog
  - Estadísticas en tiempo real
- [ ] Implementar pasarela de pago (Webpay)
- [ ] Agregar sistema de reseñas y comentarios
- [ ] Notificaciones en tiempo real (WebSocket)
- [ ] Wishlist compartible
- [ ] Sistema de cupones/descuentos

### Optimizaciones
- [ ] Implementar caché con **Redis**
- [ ] Optimizar consultas SQL (índices, queries)
- [ ] CDN para imágenes estáticas
- [ ] Compresión de respuestas (Gzip)
- [ ] Lazy loading de imágenes
- [ ] Infinite scroll en catálogo
- [ ] PWA (Progressive Web App)

### DevOps y Deployment
- [ ] Containerización con **Docker**
- [ ] Docker Compose para stack completo
- [ ] CI/CD con GitHub Actions
- [ ] Deploy en AWS/Azure/Heroku
- [ ] Configuración de entornos (dev, staging, prod)
- [ ] Monitoreo con Prometheus/Grafana
- [ ] Logging centralizado (ELK Stack)

### Testing
- [ ] Aumentar cobertura de tests al 80%+
- [ ] Tests de integración completos
- [ ] Tests E2E con Cypress/Playwright
- [ ] Tests de carga con JMeter
- [ ] Tests de seguridad

---

## Solución de Problemas Comunes

### Frontend

#### Error: "Cannot find module"
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### Puerto 5173 ocupado
```bash
# Cambiar puerto en vite.config.js
export default defineConfig({
  server: {
    port: 3000 // o el puerto que desees
  }
})
```

#### CORS Error
- Verificar que el backend tenga CORS habilitado
- Verificar las URLs en los servicios

### Backend

#### Error: "Access denied for user"
```bash
# Verificar credenciales en application.properties
# Asegurarse de que MySQL esté corriendo
# Verificar que la base de datos 'mangaStore' exista
```

#### Error: "Table doesn't exist"
```bash
# Opción 1: Dejar que Hibernate cree las tablas (ddl-auto=update)
# Opción 2: Ejecutar data.sql manualmente en MySQL
mysql -u root -p mangaStore < src/main/resources/data.sql
```

#### Puerto 8080 ocupado
```properties
# Cambiar puerto en application.properties
server.port=8081
```

#### Tests fallan
```bash
# Verificar que MySQL esté corriendo
# Verificar configuración de test en application-test.properties
# Ejecutar tests individuales para identificar el problema
mvn test -Dtest=UsuarioServiceTest
```

#### Maven no encuentra dependencias
```bash
# Limpiar caché de Maven
mvn clean
mvn dependency:purge-local-repository
mvn install
```

---

## Contribución

Si deseas contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit tus cambios (`git commit -m 'Add: Nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abre un Pull Request

### Convenciones de Código

#### Frontend
- Usar **camelCase** para variables y funciones
- Usar **PascalCase** para componentes React
- Comentar funciones complejas
- Mantener componentes pequeños y enfocados

#### Backend
- Seguir **Java naming conventions**
- Documentar métodos públicos con Javadoc
- Usar anotaciones de Spring apropiadamente
- Mantener servicios con responsabilidad única

---

## Licencia

Este proyecto es de uso académico para la asignatura **Fullstack II (DSY1104)** de Duoc UC.

---

## Autores

- **Desarrollador Principal:** [Tu Nombre]
- **Institución:** Duoc UC
- **Asignatura:** Fullstack II (DSY1104)
- **Semestre:** Cuarto Semestre
- **Evaluación:** Evaluación 2

---

## Contacto

Para preguntas o sugerencias sobre el proyecto:

- **Email:** admin@mangastore.com (proyecto demo)
- **GitHub:** [https://github.com/snozzono/EV2-fullstack](https://github.com/snozzono/EV2-fullstack)
- **Backend Repository:** [https://github.com/snozzono/EV2-FULLSTACK2-BACKEND](https://github.com/snozzono/EV2-FULLSTACK2-BACKEND)

---

## Referencias y Recursos

### Documentación Oficial
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/)

### APIs y Servicios
- **Xano API (actual):**
  - Auth: https://x8ki-letl-twmt.n7.xano.io/api:8a3HDoeS
  - CRUD: https://x8ki-letl-twmt.n7.xano.io/api:Qx1w8oou

### Herramientas Recomendadas
- **Frontend:** VS Code con extensiones React Developer Tools
- **Backend:** IntelliJ IDEA Community o Ultimate
- **Base de Datos:** MySQL Workbench, phpMyAdmin, DBeaver
- **API Testing:** Postman, Insomnia, Thunder Client
- **Version Control:** Git, GitHub Desktop

---

## Changelog

### Versión 2.0.0 (Actual)
- ✅ Frontend completamente funcional con React + Vite
- ✅ Backend Spring Boot con 15 productos iniciales
- ✅ Panel de administración con gestión de usuarios
- ✅ Conexión Frontend-Xano funcional
- ✅ Tests unitarios en backend
- ✅ Documentación Swagger/OpenAPI
- ✅ Sistema de usuarios con roles

### Versión 1.0.0 (Anterior)
- Estructura básica del proyecto
- CRUD inicial de usuarios y productos
- Interfaz preliminar

---

## Estado del Proyecto

### Entregables

| Entregable | Estado | Enlace/Ubicación |
|-----------|--------|------------------|
| ✅ Enlace GitHub público del proyecto frontend | Completo | https://github.com/snozzono/EV2-fullstack/ |
| ⚠️ Enlace GitHub público del proyecto backend | Parcial | https://github.com/snozzono/EV2-FULLSTACK2-BACKEND |
| ✅ Proyecto frontend comprimido | Completo | - |
| ✅ Proyecto backend comprimido | Completo | - |
| ✅ Documento ERS | Completo | - |
| ❌ Manual de usuario | Pendiente | - |
| ❌ Documento de cobertura del testing | Pendiente | - |
| ✅ Documentación de APIs | Completo | Auth: https://x8ki-letl-twmt.n7.xano.io/api:8a3HDoeS<br>CRUD: https://x8ki-letl-twmt.n7.xano.io/api:Qx1w8oou |
| ❌ Documento APIs e Integración | Pendiente | - |

### Progreso General

```
Frontend:        ████████████████████░░ 85%
Backend:         ████████████████░░░░░░ 70%
Integración:     ██████████░░░░░░░░░░░░ 40%
Testing:         ████████░░░░░░░░░░░░░░ 35%
Documentación:   ████████████████░░░░░░ 75%
```

---

## Notas Importantes

### Advertencias de Seguridad

⚠️ **IMPORTANTE:** Este proyecto está en desarrollo y tiene las siguientes limitaciones de seguridad:

1. **Contraseñas sin encriptar:** Las contraseñas se almacenan en texto plano. NO usar en producción.
2. **Sin JWT:** No hay tokens de sesión. La autenticación es básica.
3. **CORS abierto:** Puede tener configuración permisiva de CORS.
4. **Validaciones básicas:** Las validaciones de entrada pueden no ser exhaustivas.

### Migración Pendiente

El proyecto actualmente usa **Xano** como backend temporal. Se planea migrar completamente al backend **Spring Boot** ubicado en `C:\Users\snozz\Desktop\Ev2-fullstack-back\trabajo2.2`.

### Recomendaciones para Producción

Antes de llevar a producción, implementar:
- Encriptación de contraseñas (BCrypt)
- JWT para sesiones
- HTTPS obligatorio
- Variables de entorno seguras
- Respaldos automáticos de BD
- Monitoreo y logging
- Rate limiting
- Validación exhaustiva de inputs
- Sanitización de datos

---

**¡Gracias por revisar el proyecto MangaStore!** 🎌📚

Si tienes preguntas o encuentras algún problema, no dudes en abrir un issue en GitHub o contactar al equipo de desarrollo.

---

*Última actualización: Octubre 2025*
