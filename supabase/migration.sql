-- =============================================================================
-- Runima Compendium — Full DB Migration
-- Run this in the Supabase SQL Editor (once, top to bottom)
-- RLS is NOT enabled — single-user personal tool using the anon key directly
-- =============================================================================

-- ---------------------------------------------------------------------------
-- WEAPONS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS weapons (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  description      text NOT NULL DEFAULT '',
  weapon_type      text NOT NULL,                -- 'Simple' | 'Marcial' | 'Pesada'
  modifier         integer NOT NULL,             -- 2 | 4 | 6
  associated_stat  text NOT NULL,                -- 'POD' | 'DES' | 'RES' | 'ING'
  element          text,                         -- nullable
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- ARMORS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS armors (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text NOT NULL DEFAULT '',
  armor_type  text NOT NULL,   -- 'Ligera' | 'Media' | 'Pesada'
  ar          integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- ACCESSORIES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accessories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text NOT NULL DEFAULT '',
  bonus       text NOT NULL DEFAULT '',
  usage       text NOT NULL,   -- 'Pasivo' | '1/combate' | '1/sesión'
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- TRIGGERS  (disparadores)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS triggers (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  description       text NOT NULL DEFAULT '',
  path              text NOT NULL,   -- 'Combate' | 'Arma' | 'Magia' | 'Estrategia'
  mechanical_effect text NOT NULL DEFAULT '',
  identity          text NOT NULL DEFAULT '',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- REACTIONS  (reacciones)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reactions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  description       text NOT NULL DEFAULT '',
  path              text NOT NULL,
  trigger_condition text NOT NULL DEFAULT '',
  effect            text NOT NULL DEFAULT '',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- EFFECTS  (efectos)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS effects (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 text NOT NULL,
  element              text NOT NULL,   -- element_type enum values as text
  cost                 integer NOT NULL DEFAULT 1,
  effect_type          text NOT NULL,
  salvation_attributes text,            -- nullable
  dc                   text,            -- nullable
  description          text NOT NULL DEFAULT '',
  escalado_lv3         text,            -- nullable
  escalado_lv6         text,            -- nullable
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- SPELLS  (hechizos)
-- effect_ids stored as uuid array — simple and fast for a personal tool
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS spells (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  description    text NOT NULL DEFAULT '',
  magnitude      text NOT NULL,   -- 'Básico' | 'Pequeño' | 'Medio' | 'Gran' | 'Colosal' | 'Ultimate'
  forma          text NOT NULL,   -- 'Simple' | 'Compleja' | 'Perfecta'
  elements       text[] NOT NULL DEFAULT '{}',  -- up to 2 element values
  effect_ids     uuid[] NOT NULL DEFAULT '{}',  -- references effects.id
  total_cost     integer NOT NULL DEFAULT 0,
  execution_cost integer NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- CHARACTERS  (personajes)
-- Many-to-many relations stored as uuid arrays for simplicity
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS characters (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  description    text NOT NULL DEFAULT '',
  level          integer NOT NULL DEFAULT 1,
  path           text NOT NULL,   -- 'Combate' | 'Arma' | 'Magia' | 'Estrategia'
  pod            text NOT NULL DEFAULT 'd6',
  des            text NOT NULL DEFAULT 'd6',
  res            text NOT NULL DEFAULT 'd6',
  ing            text NOT NULL DEFAULT 'd6',
  hp             integer NOT NULL DEFAULT 0,
  ev             integer NOT NULL DEFAULT 0,
  ar             integer NOT NULL DEFAULT 0,
  weapon_id      uuid REFERENCES weapons(id) ON DELETE SET NULL,
  armor_id       uuid REFERENCES armors(id) ON DELETE SET NULL,
  accessory_ids  uuid[] NOT NULL DEFAULT '{}',
  spell_ids      uuid[] NOT NULL DEFAULT '{}',
  trigger_ids    uuid[] NOT NULL DEFAULT '{}',
  reaction_ids   uuid[] NOT NULL DEFAULT '{}',
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- MONSTERS  (monstruos)
-- ev is nullable — NULL means "infinito"
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS monsters (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  description    text NOT NULL DEFAULT '',
  monster_type   text NOT NULL DEFAULT 'Normal',  -- 'Normal' | 'Elite' | 'Miniboss' | 'Jefe'
  level          integer NOT NULL DEFAULT 1,
  pod            text NOT NULL DEFAULT 'd6',
  des            text NOT NULL DEFAULT 'd6',
  res            text NOT NULL DEFAULT 'd6',
  ing            text NOT NULL DEFAULT 'd6',
  hp             integer NOT NULL DEFAULT 0,
  ev             integer,          -- NULL = "infinito"
  ar             integer NOT NULL DEFAULT 0,
  weapon_id      uuid REFERENCES weapons(id) ON DELETE SET NULL,
  armor_id       uuid REFERENCES armors(id) ON DELETE SET NULL,
  accessory_ids  uuid[] NOT NULL DEFAULT '{}',
  spell_ids      uuid[] NOT NULL DEFAULT '{}',
  trigger_ids    uuid[] NOT NULL DEFAULT '{}',
  reaction_ids   uuid[] NOT NULL DEFAULT '{}',
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
