# Boda Meli & Kev

App privada de gestión del casamiento (10/10/2026, El Arena, Santa Fe). Next.js + Supabase + Vercel, todo en planes gratuitos.

## 1. Supabase

1. Creá un proyecto nuevo en [supabase.com](https://supabase.com) (plan Free).
2. Andá a **SQL Editor** y corré, en orden, el contenido de:
   - `supabase/migrations/0001_init.sql` (tablas + RLS)
   - `supabase/migrations/0002_storage.sql` (bucket público `inspo` + policies)
3. En **Project Settings → API** copiá:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (¡nunca la expongas al cliente!)

## 2. Variables de entorno

Copiá `.env.example` a `.env.local` y completá:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
APP_PASSWORD=       # contraseña compartida para entrar a la app
SYNC_SECRET=        # secret para /api/sync-rsvp
RSVP_SHEET_ID=      # el ID de la Google Sheet (de la URL)
```

## 3. Desarrollo local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) — te va a pedir la contraseña de `APP_PASSWORD`.

## 4. Google Sheet de confirmaciones (RSVP)

La sheet "Confirmaciones Boda - Meli & Kev" (pestaña `Confirmaciones`) tiene que estar compartida como **"Cualquiera con el link puede ver"**. El endpoint `/api/sync-rsvp` la lee vía su URL pública de export CSV, matchea los nombres contra `invitados` y:

- Si hay una sola coincidencia → confirma ese invitado.
- Si hay cero o varias coincidencias → lo manda a la pestaña **"Para revisar"** dentro de `/invitados`, para que lo asignes o crees a mano.

Podés probarlo manualmente en:

```
https://tu-app.vercel.app/api/sync-rsvp?secret=TU_SYNC_SECRET
```

## 5. Deploy en Vercel

1. Importá el repo en [vercel.com](https://vercel.com) (plan Hobby).
2. Cargá las mismas variables de entorno del paso 2 en **Project Settings → Environment Variables**.
3. Editá `vercel.json` y reemplazá `REPLACE_WITH_SYNC_SECRET` por el valor real de `SYNC_SECRET` antes de deployar (Vercel llama al cron por URL, no puede leer env vars ahí).

> **Importante sobre el cron:** el plan Hobby de Vercel sólo permite ejecutar Cron Jobs **una vez por día**, no cada 15 minutos (eso requiere plan Pro). Por eso `vercel.json` quedó configurado con `0 12 * * *` (una vez por día, 12:00 UTC ≈ 9am Argentina). Si en algún momento querés sincronizar más seguido, alternativas gratuitas:
> - Un cron externo gratuito (ej. [cron-job.org](https://cron-job.org)) que pegue a la URL de arriba cada 15 minutos.
> - Un GitHub Action con `schedule` que haga un `curl` al endpoint.
> - Mientras tanto, también podés pegarle a la URL manualmente (o desde el buscador) cuando quieras forzar una sincronización.

## 6. Estructura

- `src/app/(app)` — páginas protegidas por el gate de contraseña (dashboard + todas las secciones).
- `src/app/login` — pantalla de login.
- `src/app/api/sync-rsvp` — sincronización de RSVP.
- `src/components/table/EditableTable` — patrón de tabla editable inline, reutilizado en todas las secciones tipo planilla.
- `src/lib/supabase` — clientes de Supabase (browser/anon y server/service-role).
- `supabase/migrations` — esquema SQL.
