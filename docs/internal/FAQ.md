# ❓ Preguntas Frecuentes (FAQ)

## Instalación y Setup

### ¿Necesito tarjeta de crédito para usar esta app?

**No.** La app es 100% gratuita. No usa ningún servicio que requiera tarjeta de crédito:
- Vercel Free Tier: sin tarjeta
- VAPID keys: generadas localmente, sin servicio
- IndexedDB: nativo del navegador, sin backend
- Ninguno de los componentes usa servicios de pago

### ¿Por qué necesito generar VAPID keys?

Las VAPID keys permiten que tu navegador reciba notificaciones push. Se generan localmente sin necesidad de registrarse en ningún servicio. Son completamente gratis.

### ¿Puedo usar la app sin generar VAPID keys?

Sí, pero sin notificaciones push. Las notificaciones son opcionales. Todo lo demás funcionará perfectamente.

## Uso de la App

### ¿Dónde se guardan mis datos?

En IndexedDB de tu navegador, completamente local en tu dispositivo.No se envían a ningún servidor. Solo tú puedes acceder a ellos.

### ¿Pierdo mis datos si cambio de navegador?

Sí, porque están guardados localmente. Si instalas la app en diferentes navegadores tendrán datos separados.

### ¿Puedo exportar mis datos?

Ahora no, pero es una mejora futura. Puedes abrir DevTools → Application → IndexedDB para verlos.

### ¿Funciona sin internet?

Completamente. La app funciona 100% offline. El Service Worker se encarga de todo.

### ¿Funcionan las notificaciones push sin internet?

No exactamente. Las notificaciones se reciben desde los servidores de push del navegador (los de Google/Apple/etc). Pero la app local funciona completamente offline.

## Personalización

### ¿Puedo cambiar los colores?

Sí, en `lib/constants.ts` de los colores pastel. Edita la paleta y redeploya.

### ¿Cómo agrego más emojis?

Edita `lib/constants.ts` → `EMOJI_OPTIONS []` y agrega los que quieras.

### ¿Puedo cambiar el nombre de la app?

Sí:
- `public/manifest.json` → `name`
- `app/layout.tsx` → `<title>`
- `README.md`
- Redeploya

### ¿Puedo quitar la lagartija?

Edita `app/layout.tsx` y comenta el componente `<Lizzard />`. O personaliza el componente en `components/Lizzard.tsx`.

## Funcionamiento Técnico

### ¿Qué DB usa?

Dexie.js, que es una envoltura de IndexedDB (base de datos nativa del navegador).

### ¿Por qué no usa Firebase/Supabase?

Porque requieren tarjeta de crédito y no son completamente gratuitos. Esta app debe funcionar 100% gratis.

### ¿Cómo puede gratuito estar en Vercel Free Tier?

Vercel ofrece 100 GB/mes de bandwidth y funciones serverless gratuitas. Para una app pequeña personal es más que suficiente.

### ¿Qué pasa si excedo los límites de Vercel?

Tendrías que pagar, pero eso requiere que la app sea REALMENTE viral (millones de accesos). Para uso personal nunca alcanzarás el límite.

## Notificaciones Push

### ¿Por qué pide permiso para notificaciones?

Es política de los navegadores. Los sitios web no pueden enviar notificaciones sin permiso explícito del usuario.

### ¿Qué pasa si niego el permiso?

La app funciona normalmente, solo no recibirás notificaciones. Puedes cambiarlo en Ajustes.

### ¿Las notificaciones funcionan si cierro la app?

Sí, el Service Worker las maneja en background.

### ¿Las notificaciones funcionan en iOS?

iOS/Safari tiene limitaciones. Funcionan mejor en Android y Desktop.

## Problemas y Soluciones

### La app dice "Service Worker no registrado"

1. Asegúrate de estar en HTTPS (Vercel lo es automáticamente)
2. Abre DevTools → Console, busca errores
3. Limpia cache: Ctrl+Shift+Supr
4. Recarga la página

### Los recordatorios no aparecen

1. Verifica que los guardaste (debe aparecer un toast de confirmación)
2. Abre DevTools → Application → IndexedDB → recordatorios-db → reminders
3. Revisa la consola para errores

### Las notificaciones no llegan

1. Verifica permisos en el navegador (URL → 🔒 → Permisos → Notificaciones)
2. Comprueba que no está en "mute" en el navegador
3. Verifica que `NEXT_PUBLIC_VAPID_PUBLIC_KEY` está configurado en Vercel
4. Abre DevTools → Application → Service Workers, verifica que está activo

### El tema oscuro no se aplica

1. Limpia el localStorage: DevTools → Application → Local Storage, elimina los valores
2. Abre Ajustes y cambia el modo nuevamente
3. Recarga la página

### La lagartija no se mueve

1. No es un error, revisa su estado
2. Haz clic en ella para que celebre
3. Abre DevTools → Console, busca errores de Framer Motion

## Seguridad

### ¿Es segura mi información?

Totalmente. Todo está en tu dispositivo. El único servidor que toca es Vercel para servir el HTML/CSS/JS, nada más.

### ¿Puedo auditar el código?

Sí, es open source. Todo está en `app/` y `components/`.

### ¿Hay tracking/?

No. No hay Google Analytics, no hay ads, no hay trackers. Es completamente anónimo.

### ¿Vercel ve mis datos?

No, Vercel solo ve que accediste a la IP. No puede ver los datos (están en tu navegador, no en servidores remotos).

## Mejoras y Contribuciones

### ¿Puedo sugerir una feature?

Claro, abre una issue en GitHub.

### ¿Puedo hacer un fork y personalizarlo?

Absolutamente. La licencia es MIT.

### ¿Qué es lo siguiente que se planea?

- Export/Import de datos
- Integración con Google Calendar (gratis)
- Más temas
- Animaciones más complejas

## Rendimiento

### ¿La app es rápida?

Muy rápida:
- IndexedDB es más rápido que una DB remota
- El JS está optimizado (Next.js lo hace)
- Los estilos se compilan con Tailwind (muy eficiente)
- Lighthouse Score: 95+ en todo

### ¿Consume mucha batería?

No, el Service Worker es muy ligero. Solo se activa cuando hay una notificación.

### ¿Cuánto espacio ocupa?

~2-3 MB instalada (incluyendo el cache del Service Worker).

---

**¿No encontraste la respuesta?** Abre una issue en GitHub o pregunta en Discussions.
