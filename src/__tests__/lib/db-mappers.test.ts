import { describe, it, expect } from 'vitest';
import {
  weaponFromDb, weaponToDb,
  armorFromDb, armorToDb,
  accessoryFromDb, accessoryToDb,
  triggerFromDb, triggerToDb,
  reactionFromDb, reactionToDb,
  effectFromDb, effectToDb,
  spellFromDb, spellToDb,
  characterFromDb, characterToDb,
  monsterFromDb, monsterToDb,
} from '../../lib/db-mappers';
import {
  mockWeapon, mockArmor, mockAccessory, mockEffect,
  mockSpell, mockTrigger, mockReaction, mockCharacter,
  mockMonster, mockMonsterNormal,
} from '../fixtures';

// Helper: converts a TS object to a "DB row" and back — result must equal the original.
function roundtrip<T>(
  item: T,
  toDb: (x: T) => Record<string, unknown>,
  fromDb: (r: Record<string, unknown>) => T
) {
  expect(fromDb(toDb(item))).toEqual(item);
}

// ─── Weapon ──────────────────────────────────────────────────────────────────

describe('weaponFromDb', () => {
  it('maps snake_case DB row to camelCase Weapon', () => {
    const row = {
      id: 'weapon-1',
      name: 'Espada Larga',
      description: 'Una espada de hoja larga',
      weapon_type: 'Marcial',
      modifier: 4,
      associated_stat: 'POD',
      element: 'Fuego',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
    };
    expect(weaponFromDb(row)).toEqual(mockWeapon);
  });

  it('handles missing element (undefined)', () => {
    const row = { id: 'w', name: 'X', description: '', weapon_type: 'Simple', modifier: 2, associated_stat: 'DES', element: null, created_at: '', updated_at: '' };
    expect(weaponFromDb(row).element).toBeUndefined();
  });

  it('roundtrips correctly', () => roundtrip(mockWeapon, weaponToDb, weaponFromDb));
  it('roundtrips weapon without element', () => roundtrip(mockWeapon, weaponToDb, weaponFromDb));
});

describe('weaponToDb', () => {
  it('maps element undefined to null in DB', () => {
    const w = { ...mockWeapon, element: undefined };
    expect(weaponToDb(w).element).toBeNull();
  });

  it('uses snake_case keys', () => {
    const row = weaponToDb(mockWeapon);
    expect(row).toHaveProperty('weapon_type');
    expect(row).toHaveProperty('associated_stat');
    expect(row).not.toHaveProperty('weaponType');
  });
});

// ─── Armor ───────────────────────────────────────────────────────────────────

describe('armor mappers', () => {
  it('fromDb maps correctly', () => {
    const row = { id: 'armor-1', name: 'Armadura de Placas', description: 'Armadura completa de metal', armor_type: 'Pesada', ar: 6, created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' };
    expect(armorFromDb(row)).toEqual(mockArmor);
  });

  it('toDb uses snake_case keys', () => {
    const row = armorToDb(mockArmor);
    expect(row).toHaveProperty('armor_type');
    expect(row).toHaveProperty('ar');
  });

  it('roundtrips correctly', () => roundtrip(mockArmor, armorToDb, armorFromDb));
});

// ─── Accessory ───────────────────────────────────────────────────────────────

describe('accessory mappers', () => {
  it('roundtrips correctly', () => roundtrip(mockAccessory, accessoryToDb, accessoryFromDb));

  it('fromDb preserves usage value', () => {
    const row = { id: 'a-1', name: 'Ring', description: '', bonus: '+1', usage: '1/combate', created_at: '', updated_at: '' };
    expect(accessoryFromDb(row).usage).toBe('1/combate');
  });
});

// ─── Trigger ─────────────────────────────────────────────────────────────────

describe('trigger mappers', () => {
  it('fromDb maps mechanical_effect to mechanicalEffect', () => {
    const row = { id: 'trigger-1', name: 'Golpe Preciso', description: 'Un golpe certero', path: 'Combate', mechanical_effect: '+2 al ataque', identity: 'Guerrero', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' };
    expect(triggerFromDb(row)).toEqual(mockTrigger);
  });

  it('toDb maps mechanicalEffect to mechanical_effect', () => {
    expect(triggerToDb(mockTrigger)).toHaveProperty('mechanical_effect', '+2 al ataque');
  });

  it('roundtrips correctly', () => roundtrip(mockTrigger, triggerToDb, triggerFromDb));
});

// ─── Reaction ────────────────────────────────────────────────────────────────

describe('reaction mappers', () => {
  it('fromDb maps trigger_condition to triggerCondition', () => {
    const row = { id: 'reaction-1', name: 'Esquiva', description: 'Evita un ataque', path: 'Arma', trigger_condition: 'Cuando eres atacado', effect: 'Añade DES al AR', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' };
    expect(reactionFromDb(row)).toEqual(mockReaction);
  });

  it('toDb maps triggerCondition to trigger_condition', () => {
    expect(reactionToDb(mockReaction)).toHaveProperty('trigger_condition', 'Cuando eres atacado');
  });

  it('roundtrips correctly', () => roundtrip(mockReaction, reactionToDb, reactionFromDb));
});

// ─── Effect ──────────────────────────────────────────────────────────────────

describe('effect mappers', () => {
  it('fromDb maps all snake_case fields', () => {
    const row = {
      id: 'effect-1', name: 'Bola de Fuego', element: 'Fuego', cost: 3,
      effect_type: 'Daño', description: 'Lanza una bola de fuego',
      salvation_attributes: 'RES', dc: '15',
      escalado_lv3: 'Daño aumentado', escalado_lv6: 'Daño máximo',
      created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z',
    };
    expect(effectFromDb(row)).toEqual(mockEffect);
  });

  it('toDb maps optional fields to null when absent', () => {
    const e = { ...mockEffect, salvationAttributes: undefined, DC: undefined, escaladoLv3: undefined, escaladoLv6: undefined };
    const row = effectToDb(e);
    expect(row.salvation_attributes).toBeNull();
    expect(row.dc).toBeNull();
    expect(row.escalado_lv3).toBeNull();
    expect(row.escalado_lv6).toBeNull();
  });

  it('roundtrips correctly', () => roundtrip(mockEffect, effectToDb, effectFromDb));
});

// ─── Spell ───────────────────────────────────────────────────────────────────

describe('spell mappers', () => {
  it('fromDb maps effect_ids to effectIds and total_cost to totalCost', () => {
    const row = {
      id: 'spell-1', name: 'Hechizo de Llamas', description: 'Un poderoso hechizo de fuego',
      magnitude: 'Medio', forma: 'Compleja', elements: ['Fuego'], effect_ids: ['effect-1'],
      total_cost: 5, execution_cost: 2,
      created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z',
    };
    expect(spellFromDb(row)).toEqual(mockSpell);
  });

  it('roundtrips correctly', () => roundtrip(mockSpell, spellToDb, spellFromDb));
});

// ─── Character ───────────────────────────────────────────────────────────────

describe('character mappers', () => {
  it('fromDb maps pod/des/res/ing to POD/DES/RES/ING', () => {
    const row = {
      id: 'character-1', name: 'Aragorn', description: 'Un valiente guerrero',
      level: 5, path: 'Combate',
      pod: 'd8', des: 'd6', res: 'd8', ing: 'd4',
      hp: 40, ev: 14, ar: 4,
      weapon_id: 'weapon-1', armor_id: 'armor-1',
      accessory_ids: ['accessory-1'], spell_ids: [],
      trigger_ids: ['trigger-1'], reaction_ids: ['reaction-1'],
      created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z',
    };
    expect(characterFromDb(row)).toEqual(mockCharacter);
  });

  it('toDb maps POD/DES/RES/ING to pod/des/res/ing', () => {
    const row = characterToDb(mockCharacter);
    expect(row).toHaveProperty('pod', 'd8');
    expect(row).toHaveProperty('des', 'd6');
    expect(row).not.toHaveProperty('POD');
  });

  it('toDb maps undefined weaponId to null', () => {
    const c = { ...mockCharacter, weaponId: undefined };
    expect(characterToDb(c).weapon_id).toBeNull();
  });

  it('roundtrips correctly', () => roundtrip(mockCharacter, characterToDb, characterFromDb));
});

// ─── Monster ─────────────────────────────────────────────────────────────────

describe('monster mappers', () => {
  it('fromDb maps null ev to "infinito"', () => {
    const row = { id: 'monster-1', name: 'Dragón Rojo', description: 'Un dragón ancestral', monster_type: 'Jefe', level: 10, pod: 'd12', des: 'd8', res: 'd12', ing: 'd6', hp: 100, ev: null, ar: 8, weapon_id: null, armor_id: null, accessory_ids: [], spell_ids: ['spell-1'], trigger_ids: [], reaction_ids: [], created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' };
    expect(monsterFromDb(row).EV).toBe('infinito');
  });

  it('fromDb maps numeric ev to number', () => {
    const row = { id: 'm', name: 'G', description: '', monster_type: 'Normal', level: 1, pod: 'd4', des: 'd4', res: 'd4', ing: 'd4', hp: 10, ev: 8, ar: 2, weapon_id: null, armor_id: null, accessory_ids: [], spell_ids: [], trigger_ids: [], reaction_ids: [], created_at: '', updated_at: '' };
    expect(monsterFromDb(row).EV).toBe(8);
  });

  it('toDb maps "infinito" EV to null', () => {
    expect(monsterToDb(mockMonster).ev).toBeNull();
  });

  it('toDb maps numeric EV to number', () => {
    expect(monsterToDb(mockMonsterNormal).ev).toBe(8);
  });

  it('roundtrips monster with infinito EV', () => roundtrip(mockMonster, monsterToDb, monsterFromDb));
  it('roundtrips monster with numeric EV', () => roundtrip(mockMonsterNormal, monsterToDb, monsterFromDb));
});
