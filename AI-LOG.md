# AI-LOG

## Herramientas usadas

Antigravity (asistente de IA integrado en VS Code, powered by Gemini/Claude). Usé el chat del editor para generar código, revisar errores y discutir decisiones de arquitectura.

## Stack y por qué

Elegí **Next.js + TypeScript + SQLite + JWT propio** porque:
- Con Next.js App Router tengo el frontend y las APIs en un solo proyecto, sin CORS ni configuración de dos servidores.
- SQLite no necesita instalar nada — el archivo se genera solo al correr el seed. En un proyecto de 2 horas eso es oro.
- Hice el JWT a mano con `jose` porque ya lo tengo implementado en producción (panel de Central Butcher) y lo entiendo línea por línea. Usar NextAuth o Clerk hubiese sido clonar lógica que no controlo.

## Prompts representativos

1. **Prompt:** "Armá la estructura base de la app: db.ts con el schema de usuarios, seed con al menos 30 usuarios variados, y el endpoint GET /api/users con búsqueda y paginación."  
   **Resultado:** Me dio la estructura completa. Tuve que ajustar el seed porque generó solo 4 usuarios hardcodeados en lugar de un loop dinámico.

2. **Prompt:** "Implementá el login con JWT en cookie httpOnly y el middleware que proteja /dashboard y /api/users."  
   **Resultado:** Casi perfecto. Solo cambié el tiempo de expiración del token de 1h a 8h para que no venza en medio de la evaluación.

3. **Prompt:** "Agregá búsqueda debounced en la tabla de usuarios con manejo de 401."  
   **Resultado:** Lo usé tal cual. El hook `useDebounce` quedó limpio y el reset de página al cambiar la búsqueda ya estaba contemplado.

## Algo que rechacé o modifiqué

La IA propuso acceder directo a la base de datos desde el Server Component del dashboard sin hacer uso de backend, diciendo que era "más eficiente". Lo rechacé porque tenía defino los enponint . Al final tome la decicion de usar  fetch pero construimos la URL de forma dinámica con los headers del request para no hardcodear el puerto.

## % estimado IA vs yo

~65% generado por IA, ~35% decisiones y ajustes míos (modelo de datos, estructura de la cookie, el rechazo de acceso directo a DB, el debounce, el manejo del 401 en cliente).

## Una cosa que la IA hizo excelente / una que hizo mal

**Excelente:** el setup completo de autenticación con JWT httpOnly — el signToken, verifyToken, el endpoint de login con bcrypt y el de logout borrando la cookie. Lo actualizo usando buenas practicas y principios solid.

**Mal:** inicialmente hardcodeó `http://localhost:3000` en el Server Component para hacer fetch a la propia API. Eso rompe si el puerto cambia. Tuve que señalarlo y forzar que lo leyera de los headers del request.
