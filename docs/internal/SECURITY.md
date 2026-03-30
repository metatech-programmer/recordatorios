# Seguridad

Encontré variables sensibles que estaban en un archivo `.env` y han sido eliminadas del repositorio. Pasos recomendados inmediatamente:

1. Rotar todas las claves potencialmente comprometidas:
   - `SUPABASE_SERVICE_ROLE_KEY` (genera una nueva desde Supabase)
   - `VAPID_PRIVATE_KEY` / VAPID public key (regenerar con `npx web-push generate-vapid-keys`)
   - Cualquier otro `SECRET` / `API_KEY` que estuviera en el `.env`

2. Asegurar que `.env` y `.env.local` están en `.gitignore` (ya está configurado en este repo).

3. Si el archivo `.env` fue empujado previamente a GitHub, considera eliminarlo del historial con herramientas como `git filter-repo` o `bfg` y forzar el push. Esto es invasivo y afecta el historial; procede con precaución.

4. Para desarrollo local, usa `.env.example` como plantilla y no subas valores reales al repositorio.

Si quieres, puedo ayudarte a:
- ejecutar el filtrado de historial para remover la clave de commits anteriores (requiere force-push),
- o a generar un checklist paso a paso para rotar las claves y reconfigurar Vercel/Supabase.
