create extension if not exists "uuid-ossp";
create extension if not exists vector;

create table if not exists objects (
  id uuid primary key default uuid_generate_v4(),
  owner uuid not null,
  world text not null,
  geometry text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists agent_memories (
  id uuid primary key default uuid_generate_v4(),
  agent_id text not null,
  embedding vector(1536),
  content text not null,
  created_at timestamptz default now()
);
