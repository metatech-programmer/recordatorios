# 🚀 Guía de Despliegue en Vercel

Este documento te guía paso a paso para desplegar la app PWA de Recordatorios en Vercel sin errores.

## Requisitos

- Git instalado
- Node.js 18+ instalado (`npm --version` para verificar)
- Cuenta en Vercel (gratis en https://vercel.com/signup)
- Terminal/CMD abierto en la carpeta del proyecto

## Paso 1: Generar las VAPID Keys (una sola vez) ⚙️

```bash
# Instalar web-push globalmente
npm install -g web-push

# Generar las keys
npx web-push generate-vapid-keys
```

**Verás algo como esto:**
```
Public Key: BCIhkdo7ZXgeK9...
Private Key: qL3_-9K4mS2xYz...
```

**Copia ambas** - las necesitarás en el siguiente paso.

## Paso 2: Configurar Variables de Entorno 🔐

### Local (desarrollo)

1. En la carpeta del proyecto, copia el archivo de ejemplo:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` y pega tus valores:
   ```
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=BCIhkdo7ZXgeK9...
   VAPID_PRIVATE_KEY=qL3_-9K4mS2xYz...
   VAPID_SUBJECT=mailto:tuEmail@gmail.com
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Vercel (producción)

Actualizaremos esto después del primer despliegue.

## Paso 3: Instalar Dependencias 📦

```bash
npm install
```

Espera a que termine (tarda 2-3 minutos la primera vez).

## Paso 4: Probar Localmente 🧪

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

**Verifica que:**
- ✅ La página carga sin errores
- ✅ La lagartija aparece abajo a la derecha
- ✅ Puedes crear un recordatorio
- ✅ El servidor corre sin errores en la terminal

Presiona `Ctrl+C` para detener el servidor.

## Paso 5: Subir a GitHub 🐙

```bash
# Inicializar repositorio (si no lo hiciste ya)
git init
git add .
git commit -m "Initial commit: PWA Recordatorios"

# Conectar con repositorio remoto
git remote add origin https://github.com/tuUsuario/recordatorios.git
git branch -M main
git push -u origin main
```

## Paso 6: Conectar con Vercel 🔗

Dos opciones:

### Opción A: Desde Vercel Dashboard (recomendado)

1. Ve a https://vercel.com/dashboard
2. Haz clic en "Add New..." → "Project"
3. Selecciona tu repositorio de GitHub
4. Vercel detectará que es Next.js automáticamente
5. **En "Environment Variables"**, agrega:
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY` = (tu public key)
   - `VAPID_PRIVATE_KEY` = (tu private key)
   - `VAPID_SUBJECT` = `mailto:tuEmail@gmail.com`
6. Haz clic en "Deploy"

Espera 2-3 minutos. ¡Vercel te dará una URL! Debería verse como:
```
🎉 Production: https://recordatorios-abc123.vercel.app
```

### Opción B: Desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

Sigue el asistente interactivo.

## Paso 7: Actualizar URL en Variables de Entorno 🌐

Una vez que Vercel te asigne tu URL (ej: `https://recordatorios-abc123.vercel.app`):

1. Ve al Dashboard de Vercel → Tu Proyecto → Settings
2. Settings → Environment Variables
3. Edita o agrega: `NEXT_PUBLIC_APP_URL=https://recordatorios-abc123.vercel.app`
4. Guarda cambios

Vercel redesplegará automáticamente.

## Paso 8: Verificar Despliegue ✅

1. Abre tu URL en el navegador
2. Verifica que todo funciona igual que en local
3. Prueba crear un recordatorio
4. Abre DevTools (F12) → Console para revisar que no hay errores

## 🎨 Personalizaciones Opcionales

### Dominio personalizado (gratis)

Si tienes un dominio registrado:

1. En Vercel → Settings → Domains
2. Agrega tu dominio
3. Sigue las instrucciones para configurar DNS

### Configurar Github webhooks (automático)

Vercel ya lo hace automáticamente con GitHub. Cada commit a `main` redesplegará tu app.

## 🚨 Troubleshooting

### "Command not found: npx"

```bash
# Instala Node.js desde https://nodejs.org
# Luego reinicia tu terminal
```

### Las variables de entorno no se cargan

```bash
# En Vercel, redeploy manualmente:
1. Dashboard → Deployments
2. Último deployment → Redeploy
```

### Error "NEXT_PUBLIC_VAPID_PUBLIC_KEY is undefined"

Revisa que en Vercel → Settings → Environment Variables está configurado correctamente.

### La app funciona pero sin notificaciones

```bash
# Verifica que la política de permisos permita notificaciones:
# En tu navegador → URL → 🔒 → Permisos → Notificaciones → Permitir
```

## 📊 Ver logs en Vercel

```bash
vercel logs <url>
```

O desde el dashboard → Deployments → Logs.

## ✨ ¡Listo!

Tu app PWA está online y lista. Ahora puedes:

- ✅ Acceder desde cualquier dispositivo
- ✅ Instalarla como app nativa
- ✅ Recibir notificaciones push
- ✅ Funciona offline

## 🔄 Para futuros cambios

Simplemente modifica los archivos, commit a Git:

```bash
git add .
git commit -m "tu mensaje"
git push
```

Vercel se encargará del despliegue automáticamente.

---

**¿Problemas?** Revisa la [Documentación de Vercel](https://vercel.com/docs) o abre un issue en GitHub.
