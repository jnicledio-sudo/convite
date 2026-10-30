-- Executar no SQL Editor do projecto Supabase.
create table if not exists public.guest_confirmations (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 2 and 100),
  created_at timestamptz not null default now()
);

-- A tabela não fica acessível directamente ao público.
alter table public.guest_confirmations enable row level security;

-- Não criar políticas públicas de SELECT, UPDATE ou DELETE.
-- As funções da Vercel usam a SUPABASE_SERVICE_ROLE_KEY no servidor.
-- A aplicação não disponibiliza qualquer funcionalidade para apagar registos.
