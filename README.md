# DevPanel — Oscar Villalta

Panel de administración de usuarios con autenticación JWT. Proyecto de evaluación técnica.

## Stack

Next.js 16 + TypeScript + SQLite (`better-sqlite3`) + JWT propio (`jose`). Todo en un solo repo, sin base de datos externa ni Docker.

## Prerrequisitos

- Node.js 20+
- pnpm (`npm install -g pnpm`)

## Cómo correrlo

```bash
# 1. Clonar e instalar dependencias
pnpm install

# 2. Crear el archivo de variables de entorno
cp .env.example .env

# 3. Poblar la base de datos con usuarios de prueba
pnpm db:seed

# 4. Levantar el servidor de desarrollo
pnpm dev
```

Abrí http://localhost:3000 — te redirige automáticamente al login.

## Credenciales de prueba

| Email | Contraseña | Rol |
|---|---|---|
| admin@devpanel.com | password123 | admin |
| manager@devpanel.com | password123 | manager |
| user@devpanel.com | password123 | user |

## Decisiones técnicas

- **JWT en cookie httpOnly**: el token nunca toca JavaScript del cliente, lo que protege contra ataques XSS. Es el mismo patrón que ya uso en producción.
- **SQLite sin ORM**: cero configuración de servidor, cero Docker. El archivo `.db` se genera localmente al correr el seed.
- **Next.js full-stack**: un solo repo maneja tanto el frontend como las API routes, sin necesidad de separar proyectos ni configurar CORS.
- **Búsqueda con debounce (300ms)**: el input de búsqueda espera que el usuario termine de escribir antes de hacer el fetch, evitando una request por cada letra.

## Oportunidad de escalamiento

- No hay CRUD: los usuarios solo se pueden ver, no crear, editar ni eliminar desde la UI.
- No hay filtro por rol en la tabla (solo búsqueda por nombre/email).
- La cookie no tiene el flag `Secure` porque corre en HTTP local; en producción sí se activaría.
- No hay tests unitarios ni de integración.

