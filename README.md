# 🦎 Recordatorios PWA

Una aplicación web progresiva (PWA) minimalista, adorable y completamente **gratis** para gestionar tus recordatorios personales con éxito. Incluye tu propia lagartija mascota virtual que reacciona a tus acciones.

## ✨ Características

- 📱 **PWA Instalable**: Funciona como app nativa en Android, iOS y desktop
- 🔔 **Notificaciones Push**: Alertas incluso con la app cerrada (100% gratis)
- ⚡ **100% Offline**: Todo funciona sin conexión a internet
- 🗄️ **IndexedDB Local**: Tus datos nunca salen de tu dispositivo
- 🎨 **Diseño Pastel Cute**: Interfaz adorable con animaciones Framer Motion
- 🦎 **Lagartija Mascota**: Reacciona a tus acciones y estados del sistema
- 🔄 **Recordatorios Recurrentes**: Diarios, semanales, mensuales, anuales o personalizados
- 📊 **Historial**: Registra todos tus recordatorios cumplidos
- 🌙 **Modo Oscuro**: Con persistencia automática

## 🚀 Despliegue en Vercel (5 pasos)

### 1️⃣ Generar VAPID Keys (una sola vez)

Las VAPID keys son necesarias para las notificaciones push. Se generan completamente gratis y localmente:

```bash
npm install -g web-push
npx web-push generate-vapid-keys
```

Verás algo como:
```
Public Key: BCxyAbc...defGH
Private Key: privateKeyStringHere...
```

### 2️⃣ Clonar y configurar el proyecto

```bash
# Clonar el repositorio
git clone <tu-repo>
cd recordatorios

# Instalar dependencias
npm install
```

### 3️⃣ Llenar el archivo `.env.local`

Copia `.env.example` a `.env.local` y completa con tus valores:

```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega:

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BCxyAbc...defGH
VAPID_PRIVATE_KEY=privateKeyStringHere...
VAPID_SUBJECT=mailto:tuemail@gmail.com
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
```

### 4️⃣ Desplegar en Vercel

```bash
# Instalar Vercel CLI (opcional pero recomendado)
npm i -g vercel

# Desplegar
vercel
```

O simplemente empuja a GitHub y conecta tu repo a Vercel desde el dashboard.

### 5️⃣ Actualizar URL en .env

Una vez Vercel te asigne la URL (ej: `https://recordatorios-abc123.vercel.app`):

```bash
# Copia la URL y actualiza NEXT_PUBLIC_APP_URL en .env.local
# Luego redeploya
vercel
```

✅ **¡Listo!** Tu app está online y visible en la URL que Vercel te asignó.

## 🏃 Ejecutar localmente

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 📦 Stack Completo (100% Gratuito)

| Componente | Tecnología | Costo |
|---|---|---|
| Framework | Next.js 14 (open source) | $0 |
| Estilos | Tailwind CSS | $0 |
| Animaciones | Framer Motion | $0 |
| Base de datos | Dexie.js + IndexedDB (navegador) | $0 |
| Notificaciones | Web Push API nativa + VAPID local | $0 |
| Hosting | Vercel Free Tier | $0 |
| Dominio | Vercel (*.vercel.app) | $0 |
| **TOTAL** | | **$0** |

❌ **Cero servicios de pago** · ❌ **No requiere tarjeta de crédito** · ❌ **Sin backend remoto**

## 🎨 Características Principales

### 📋 Vistas Disponibles

- **Home**: Resumen y acceso rápido a todas las funciones
- **Lista**: Todos tus recordatorios próximos, filtrados y ordenados
- **Calendario**: Vista mensual para visualizar en qué días tienes recordatorios
- **Registro**: Historial completo de recordatorios cumplidos/saltados
- **Ajustes**: Tema, notificaciones, información y borrar datos

### 🦎 Mascota Lagartija

Tu compañera lagartija tiene varios estados:

- 😊 **Feliz**: Celebra cuando cumples un recordatorio
- 😴 **Dormida**: Se duerme después de 2 minutos de inactividad
- 😟 **Preocupada**: Te advierte si hay recordatorios vencidos
- ❓ **Curiosa**: Se asoma cuando cambias de vista
- 😴 **Respirando**: Estado idle normal

Haz clic en ella para un extra de diversión 🎉

### 🔔 Notificaciones Push

Las notificaciones funcionan 100% en la app:

1. Actívalas en **Ajustes → Notificaciones Push**
2. Permite permisos cuando se te pida
3. Recibirás alertas en tiempo real
4. Botones de acción directamente en la notificación: "✅ Lo cumplí" / "❌ No lo cumplí"

Funcionan incluso con la app cerrada, gracias al Service Worker.

### 📱 Instalación como App

#### Android
1. Abre la app en Chrome o navegador moderno
2. Toca el menú (⋮) → "Instalar app"
3. Confirma

#### iOS (iPad/iPhone)
1. Abre en Safari
2. Toca Compartir (↗️)
3. Selecciona "Agregar a pantalla de inicio"
4. Elige un nombre y confirma

#### Desktop
1. Abre en Chrome/Edge/Brave
2. Haz clic en el ícono de instalación en la barra de dirección
3. Confirma

## 🛠️ Estructura del Proyecto

```
recordatorios/
├── app/
│   ├── layout.tsx              # Layout principal con PWA
│   ├── page.tsx                # Home
│   ├── crear/page.tsx          # Crear recordatorio
│   ├── lista/page.tsx          # Lista de recordatorios
│   ├── calendario/page.tsx     # Vista calendario
│   ├── registro/page.tsx       # Historial
│   ├── ajustes/page.tsx        # Configuración
│   ├── guia/page.tsx           # Guía de uso
│   ├── recordatorio/[id]/page.tsx    # Detalle del recordatorio
│   ├── editar/[id]/page.tsx         # Editar recordatorio
│   ├── api/push/
│   │   ├── subscribe/route.ts  # Suscribir a notificaciones
│   │   ├── send/route.ts       # Enviar notificaciones
│   │   └── action/route.ts     # Manejar acciones
│   └── globals.css
├── components/
│   ├── Lizzard.tsx             # Mascota lagartija
│   ├── Header.tsx
│   ├── Navigation.tsx
│   ├── ReminderCard.tsx
│   ├── EmptyState.tsx
│   ├── Toast.tsx
│   └── ConfettiCelebration.tsx
├── lib/
│   ├── db.ts                   # Dexie.js + IndexedDB
│   ├── types.ts                # TypeScript types
│   ├── constants.ts            # Emojis, colores, etc.
│   └── vapid.ts                # Web Push utilities
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service Worker
│   ├── robots.txt
│   ├── offline.html
│   └── icons/                  # Íconos (72-512px)
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── vercel.json                 # Configuración Vercel
├── .env.example
└── README.md
```

## 🔐 Privacidad y Seguridad

- ✅ **100% Local**: Todos los datos se guardan en IndexedDB de tu dispositivo
- ✅ **Sin Sincronización**: Nunca se envían datos a servidores remotos
- ✅ **Sin Analytics**: No hay trackers ni Google Analytics
- ✅ **Open Source**: Puedes auditar todo el código
- ✅ **HTTPS**: Vercel asegura conexión cifrada

## ⏱️ Recurrencias Soportadas

- Sin repetición (una sola vez)
- Cada 3 / 5 / 8 horas
- Cada día
- Cada 3 meses
- Cada mes
- Cada año
- Personalizado (configura tu propio intervalo)

## 📊 Lighthouse Scores

Objetivo para la app:

- **Performance**: 95+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100
- **PWA**: 100

## 🐛 Troubleshooting

### Las notificaciones no funcionan

1. Verifica que los permisos están activados en el navegador
2. Comprueba que `NEXT_PUBLIC_VAPID_PUBLIC_KEY` está bien en `.env.local`
3. Asegúrate de que estás en HTTPS (Vercel lo proporciona automáticamente)

### La app no carga

1. Borra cache: Ctrl+Shift+Supr (Windows) o Cmd+Shift+Supr (Mac)
2. Abre DevTools y revisa la consola para errores
3. Verifica que todas las dependencias están instaladas: `npm install`

### Datos locales se borran

Los datos en IndexedDB persisten mientras el navegador no limpie el almacenamiento. Si cambias de navegador o limpias datos, se perderán (pero eso es por privacidad 🔐).

## 🚀 Próximas Mejoras (Roadmap)

- [ ] Export/Import de datos locales
- [ ] Integración con Google Calendar (opcional, gratuita)
- [ ] Más emojis y personalizaciones
- [ ] Animaciones más complejas de la lagartija
- [ ] Tema de sistema (detección automática Dark/Light)
- [ ] Múltiples listas de recordatorios

## 📄 Licencia

MIT - Usa libremente para lo que quieras 🎉

---

## 💪 Hecho con

- Next.js 14+
- TypeScript
- Tailwind CSS + Framer Motion
- Dexie.js
- Web Push API
- ❤️ Amor por la minimalismo

## 📞 Soporte

Si encuentras un bug o tienes una idea, abre una [issue en GitHub](https://github.com/tuusuario/recordatorios/issues).

---

**🦎 Tu lagartija está esperando. ¡Comienza ahora!**
