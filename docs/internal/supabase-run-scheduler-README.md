Supabase Edge Function: run-scheduler

Purpose
-------
This Edge Function calls your deployed app endpoint `/api/push/run-scheduler` and forwards a `CRON_SECRET` header. Use it to schedule server-side push deliveries from Supabase.

Deploy
------
1. Install Supabase CLI: https://supabase.com/docs/guides/cli
2. Login: `supabase login`
3. From this repo root deploy the function:

```bash
cd supabase/functions/run-scheduler
supabase functions deploy run-scheduler --project-ref <your-project-ref>
```

Environment variables
---------------------
Set these in Supabase (Project → Settings → API → Environment Variables for Functions) or via the CLI:

- `DEPLOY_URL` = https://recordatorios.vercel.app (or your deploy URL)
- `CRON_SECRET` = same secret value you configured in your app (used to authorize the call)

Schedule
--------
In Supabase Dashboard → Functions → Scheduled → New Scheduled Function (or via CLI) add a schedule using cron syntax. Example every minute:

```
*/1 * * * *
```

Testing
-------
After deploy and environment variables set, run:

```bash
supabase functions invoke run-scheduler --project-ref <your-project-ref>
```

Or call the function URL (visible in Supabase UI) which will forward the request to your app.
