import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import {
  characterFromDb, characterToDb,
  monsterFromDb,   monsterToDb,
  weaponFromDb,    weaponToDb,
  armorFromDb,     armorToDb,
  accessoryFromDb, accessoryToDb,
  spellFromDb,     spellToDb,
  triggerFromDb,   triggerToDb,
  reactionFromDb,  reactionToDb,
  effectFromDb,    effectToDb,
} from '../lib/db-mappers';
import type {
  Character, Monster, Weapon, Armor, Accessory,
  Spell, Trigger, Reaction, Effect,
} from '../types';

// Helper: builds a store for any entity with a single Supabase table.
// T = TypeScript type, toDb/fromDb = mapper functions, table = Supabase table name.
function makeStore<T extends { id: string }>(
  table: string,
  fromDb: (r: Record<string, unknown>) => T,
  toDb: (item: T) => Record<string, unknown>
) {
  interface Store {
    items: T[];
    loading: boolean;
    fetchAll: () => Promise<void>;
    add: (item: T) => Promise<void>;
    update: (id: string, partial: Partial<T>) => Promise<void>;
    remove: (id: string) => Promise<void>;
  }

  return create<Store>()((set, get) => ({
    items: [],
    loading: false,

    fetchAll: async () => {
      set({ loading: true });
      const { data, error } = await supabase.from(table).select('*').order('created_at');
      if (error) {
        console.error(`[${table}] fetchAll:`, error.message);
        set({ loading: false });
        return;
      }
      set({ items: (data ?? []).map(r => fromDb(r as Record<string, unknown>)), loading: false });
    },

    add: async (item) => {
      // Optimistic
      set((s) => ({ items: [...s.items, item] }));
      const { error } = await supabase.from(table).insert(toDb(item));
      if (error) console.error(`[${table}] add:`, error.message);
    },

    update: async (id, partial) => {
      // Optimistic
      set((s) => ({
        items: s.items.map((i) => (i.id === id ? { ...i, ...partial } : i)),
      }));
      // Build full updated item then convert to DB row (minus id and created_at)
      const current = get().items.find((i) => i.id === id);
      if (!current) return;
      const merged = { ...current, ...partial };
      const row = toDb(merged as T);
      delete (row as Record<string, unknown>).id;
      delete (row as Record<string, unknown>).created_at;
      const { error } = await supabase.from(table).update(row).eq('id', id);
      if (error) console.error(`[${table}] update:`, error.message);
    },

    remove: async (id) => {
      // Optimistic
      set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) console.error(`[${table}] remove:`, error.message);
    },
  }));
}

// ─── Stores ───────────────────────────────────────────────────────────────────

export const useCharacterStore  = makeStore<Character>('characters', characterFromDb, characterToDb);
export const useMonsterStore    = makeStore<Monster>  ('monsters',   monsterFromDb,   monsterToDb);
export const useWeaponStore     = makeStore<Weapon>   ('weapons',    weaponFromDb,    weaponToDb);
export const useArmorStore      = makeStore<Armor>    ('armors',     armorFromDb,     armorToDb);
export const useAccessoryStore  = makeStore<Accessory>('accessories',accessoryFromDb, accessoryToDb);
export const useSpellStore      = makeStore<Spell>    ('spells',     spellFromDb,     spellToDb);
export const useTriggerStore    = makeStore<Trigger>  ('triggers',   triggerFromDb,   triggerToDb);
export const useReactionStore   = makeStore<Reaction> ('reactions',  reactionFromDb,  reactionToDb);
export const useEffectStore     = makeStore<Effect>   ('effects',    effectFromDb,    effectToDb);
