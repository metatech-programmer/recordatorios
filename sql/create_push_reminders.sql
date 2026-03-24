-- SQL para crear la tabla de suscripciones push en Supabase
-- Ejecuta en SQL Editor de Supabase

create table if not exists public.push_subscriptions (
  endpoint text primary key,
  device_id text,
  keys jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_push_subscriptions_device_id on public.push_subscriptions(device_id);

-- SQL para crear la tabla de recordatorios programados en Supabase
-- Ejecuta esto en el SQL Editor de Supabase

create table if not exists public.push_reminders (
  reminder_id text primary key,
  title text not null,
  body text,
  next_occurrence timestamptz not null,
  device_id text,
  sent boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_push_reminders_next_occurrence on public.push_reminders(next_occurrence);
create index if not exists idx_push_reminders_device_id on public.push_reminders(device_id);
