# ✅ Pre-Launch Checklist

Verificar estos puntos antes de desplegar a producción:

## 🔧 Setup Local

- [ ] `npm install` sin errores
- [ ] `npm run dev` ejecuta sin errores
- [ ] http://localhost:3000 carga correctamente
- [ ] No hay errores en DevTools Console
- [ ] Lagartija aparece en esquina inferior derecha

## 🎨 Interfaz

- [ ] Header se ve bien
- [ ] Navegación inferior funciona
- [ ] Todos los botones responden
- [ ] Animaciones son suaves (Framer Motion)
- [ ] Los colores pastel se ven correctos
- [ ] Iconos 📝📋📅📊 se muestran

## 🦎 Mascota Lagartija

- [ ] La lagartija aparece
- [ ] Se mueve/respira cuando inactivo
- [ ] Celebra al crear recordatorios (confeti)
- [ ] Se duerme después de 2 minutos
- [ ] Clickearla hace celebración extra
- [ ] Estados de sentimientos funcionan

## 💾 Base de Datos (IndexedDB)

- [ ] Puedo crear recordatorio
- [ ] Los recordatorios se guardan en IndexedDB
- [ ] Recargo la página y persisten
- [ ] Puedo editar recordatorios
- [ ] Puedo eliminar recordatorios
- [ ] Historial se registra

## 📋 Vistas

- [ ] **Home**: Carga rápido, tiene overview
- [ ] **Lista**: Muestra recordatorios, filtros funcionan
- [ ] **Calendario**: Mes completo visible, clickear días funciona
- [ ] **Registro**: Historial se ve, filtros por estado
- [ ] **Ajustes**: Modo oscuro toggle, botón notificaciones
- [ ] **Guía**: Instrucc iones legibles

## 🔔 Notificaciones Push

- [ ] En Ajustes puedo activar/desactivar
- [ ] Primeza vez pide permiso del navegador
- [ ] Si acepto, se suscribe correctamente
- [ ] DevTools → Application → Service Worker: activo
- [ ] DevTools → Application → Manifest: correcto

## ⚡ Rendimiento

- [ ] Página carga en < 3 segundos
- [ ] Creación de recordatorio < 500ms
- [ ] Transiciones entre páginas suaves
- [ ] Animations 60 fps (sin stuttering)

## 🌙 Tema Oscuro/Claro

- [ ] Toggle modo oscuro en Ajustes funciona
- [ ] Valores persisten en localStorage
- [ ] Colores son legibles en ambos modos
- [ ] Transición entre temas suave

## 📱 PWA & Instalación

- [ ] manifest.json existe y es válido
- [ ] icons en múltiples tamaños existen
- [ ] DevTools Lighthouse PWA: 100
- [ ] App se puede instalar (icono URL bar)
- [ ] Service Worker visible en DevTools

## 🔐 Seguridad y Privacidad

- [ ] Sin Firebase/Auth0/servicios de pago
- [ ] Sin Google Analytics/trackers
- [ ] Datos solo en IndexedDB local
- [ ] HTTPS en Vercel (automático)

## 📡 Environmen Variables

- [ ] `.env.example` existe con instrucciones
- [ ] `.env.local` tiene VAPID keys correctas
- [ ] `NEXT_PUBLIC_APP_URL` correcta
- [ ] `.env.local` NO está en Git (.gitignore)

## 📦 Build

```bash
npm run build
```

- [ ] Build completa sin errores
- [ ] Warnings son mínimos
- [ ] `.next/` se crea correctamente
- [ ] Tamaño del build razonable

## 📄 Documentación

- [ ] README.md completo y actualizado
- [ ] DEPLOYMENT.md con instrucciones claras
- [ ] QUICK_START.md es realmente 2 min
- [ ] FAQ.md resuelve dudas comunes
- [ ] STRUCTURE.md explica carpetas

## 🚀 Vercel Deployment

- [ ] Cuenta Vercel creada
- [ ] Repositorio Git conectado
- [ ] Variables de entorno configuradas en Vercel
- [ ] Primer deploy exitoso
- [ ] URL de Vercel accesible
- [ ] HTTPS automático funciona
- [ ] Redeploy automático con GitHub push

## ✅ Post-Deployment

- [ ] App carga desde URL Vercel
- [ ] Todas las vistas funcionan en producción
- [ ] Notificaciones funcionan en Vercel
- [ ] Lighthouse scores >= 90
- [ ] No hay console errors en producción
- [ ] Rendimiento es bueno (Network tab)

## 🎁 Bonus

- [ ] Favicon se ve en pestaña
- [ ] Meta tags Open Graph correctos
- [ ] Social media preview se ve bien
- [ ] Está pronto para compartir

## 🧪 Testing Rápido

```bash
# Probar cada sección:
□ Crear 3 recordatorios diferentes
□ Editar uno
□ Eliminar otro
□ Marcar uno como cumplido
□ Ver en calendario
□ Ver en registro
□ Cambiar a modo oscuro
□ Probar filtros
□ Activar notificaciones
□ Instalar como app
□ Recargar con app instalada
```

## 📊 Resultados Esperados

| Métrica | Objetivo | ✅/❌ |
|---------|----------|-------|
| Lighthouse Performance | 95+ | □ |
| Lighthouse SEO | 100 | □ |
| Lighthouse Accessibility | 95+ | □ |
| Lighthouse PWA | 100 | □ |
| Bundle Size | < 250KB | □ |
| First Load | < 3s | □ |
| Errores Console | 0 | □ |
| Costo Total | $0 | □ |

---

**Si todo está ✅, ¡felicidades! Tu PWA está lista para el mundo! 🚀🦎**

**Si hay ❌, revisa [FAQ.md](./FAQ.md) o [DEPLOYMENT.md](./DEPLOYMENT.md) para troubleshooting.**
