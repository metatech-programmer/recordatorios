-- SQL para crear la tabla de suscripciones push en Supabase
-- Ejecuta en SQL Editor de Supabase

create table if not exists public.push_subscriptions (
  endpoint text primary key,
  device_id text,
  keys jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_push_subscriptions_device_id on public.push_subscriptions(device_id);
