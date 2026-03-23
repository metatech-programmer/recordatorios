# ⚡ Quick Start (2 minutos)

Sigue estos pasos y tendrás la app corriendo localmente en 2 minutos.

## 1️⃣ Clonar y instalar

```bash
# Clonar (o descargar ZIP si prefieres)
git clone <tu-repo>
cd recordatorios

# Instalar dependencias
npm install
```

## 2️⃣ Configurar .env.local

```bash
# Copiar plantilla
cp .env.example .env.local

# Generar VAPID keys (necesarias para push, gratis)
npx web-push generate-vapid-keys

# Editar .env.local y pegar las keys:
# NEXT_PUBLIC_VAPID_PUBLIC_KEY=<la public key>
# VAPID_PRIVATE_KEY=<la private key>
# VAPID_SUBJECT=mailto:tuEmail@gmail.com
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3️⃣ Ejecutar

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) 🚀

## ✅ Verificar

- [ ] Ves la página principal con la lagartija
- [ ] Puedes hacer clic en "Crear Recordatorio"
- [ ] Los recordatorios se guardan
- [ ] No hay errores en DevTools Console

## 🚀 Desplegar a Vercel (5 minutos extra)

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones paso a paso.

---

**Próximos pasos:**
- Leer [README.md](./README.md) para todas las features
- Revisar [FAQ.md](./FAQ.md) para preguntas comunes
- Ir a http://localhost:3000/guia para entender cómo usar la app
