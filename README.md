ToDo App - Frontend

Arquitectura
- Sitio estático simple (HTML/CSS/JS) en `frontend/`.
- Se comunica con la API del backend en `http://localhost:5000/api` por defecto.

Archivos
- `index.html` - Interfaz y formularios para login/registro y listado de tareas.
- `app.js` - Lógica del cliente: login/register, almacenar token en localStorage, CRUD de tareas.
- `styles.css` - Estilos básicos.

Cómo usar
1. Ejecuta el backend (asegúrate de que el servidor esté corriendo y la variable `JWT_SECRET` y `MONGODB_URI` estén configuradas).
2. Abre `frontend/index.html` en el navegador (o sirve la carpeta con un servidor estático).

Notas
- El cliente asume los endpoints:
  - POST /api/auth/register
  - POST /api/auth/login (retorna { token, user })
  - GET/POST/PUT/DELETE /api/todos (autenticados con header Authorization: Bearer <token>)

Si tu backend usa rutas o puertos distintos, edita `frontend/app.js` y ajusta la constante `BASE_URL`.
