/**
 * DB ↔ TypeScript type converters.
 * DB uses snake_case; TypeScript types use camelCase.
 * Monster.ev is nullable in DB (null = "infinito").
 */

import type {
  Character,
  Monster,
  Weapon,
  Armor,
  Accessory,
  Spell,
  Trigger,
  Reaction,
  Effect,
  DieSide,
  Element,
  Path,
  WeaponType,
  ArmorType,
  AccessoryUsage,
  SpellMagnitude,
  SpellForma,
  MonsterType,
} from '../types';

// ─── Weapon ──────────────────────────────────────────────────────────────────

export function weaponFromDb(r: Record<string, unknown>): Weapon {
  return {
    id: r.id as string,
    name: r.name as string,
    description: (r.description as string) ?? '',
    weaponType: r.weapon_type as WeaponType,
    modifier: r.modifier as 2 | 4 | 6,
    associatedStat: r.associated_stat as 'POD' | 'DES' | 'RES' | 'ING',
    element: (r.element as string) ?? undefined,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export function weaponToDb(w: Weapon): Record<string, unknown> {
  return {
    id: w.id,
    name: w.name,
    description: w.description,
    weapon_type: w.weaponType,
    modifier: w.modifier,
    associated_stat: w.associatedStat,
    element: w.element ?? null,
    created_at: w.createdAt,
    updated_at: w.updatedAt,
  };
}

// ─── Armor ───────────────────────────────────────────────────────────────────

export function armorFromDb(r: Record<string, unknown>): Armor {
  return {
    id: r.id as string,
    name: r.name as string,
    description: (r.description as string) ?? '',
    armorType: r.armor_type as ArmorType,
    AR: r.ar as number,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export function armorToDb(a: Armor): Record<string, unknown> {
  return {
    id: a.id,
    name: a.name,
    description: a.description,
    armor_type: a.armorType,
    ar: a.AR,
    created_at: a.createdAt,
    updated_at: a.updatedAt,
  };
}

// ─── Accessory ───────────────────────────────────────────────────────────────

export function accessoryFromDb(r: Record<string, unknown>): Accessory {
  return {
    id: r.id as string,
    name: r.name as string,
    description: (r.description as string) ?? '',
    bonus: (r.bonus as string) ?? '',
    usage: r.usage as AccessoryUsage,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export function accessoryToDb(a: Accessory): Record<string, unknown> {
  return {
    id: a.id,
    name: a.name,
    description: a.description,
    bonus: a.bonus,
    usage: a.usage,
    created_at: a.createdAt,
    updated_at: a.updatedAt,
  };
}

// ─── Trigger ─────────────────────────────────────────────────────────────────

export function triggerFromDb(r: Record<string, unknown>): Trigger {
  return {
    id: r.id as string,
    name: r.name as string,
    description: (r.description as string) ?? '',
    path: r.path as Path,
    mechanicalEffect: (r.mechanical_effect as string) ?? '',
    identity: (r.identity as string) ?? '',
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export function triggerToDb(t: Trigger): Record<string, unknown> {
  return {
    id: t.id,
    name: t.name,
    description: t.description,
    path: t.path,
    mechanical_effect: t.mechanicalEffect,
    identity: t.identity,
    created_at: t.createdAt,
    updated_at: t.updatedAt,
  };
}

// ─── Reaction ────────────────────────────────────────────────────────────────

export function reactionFromDb(r: Record<string, unknown>): Reaction {
  return {
    id: r.id as string,
    name: r.name as string,
    description: (r.description as string) ?? '',
    path: r.path as Path,
    triggerCondition: (r.trigger_condition as string) ?? '',
    effect: (r.effect as string) ?? '',
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export function reactionToDb(rx: Reaction): Record<string, unknown> {
  return {
    id: rx.id,
    name: rx.name,
    description: rx.description,
    path: rx.path,
    trigger_condition: rx.triggerCondition,
    effect: rx.effect,
    created_at: rx.createdAt,
    updated_at: rx.updatedAt,
  };
}

// ─── Effect ──────────────────────────────────────────────────────────────────

export function effectFromDb(r: Record<string, unknown>): Effect {
  return {
    id: r.id as string,
    name: r.name as string,
    element: r.element as Element,
    cost: r.cost as number,
    effectType: r.effect_type as string,
    salvationAttributes: (r.salvation_attributes as string) ?? undefined,
    DC: (r.dc as string) ?? undefined,
    description: (r.description as string) ?? '',
    escaladoLv3: (r.escalado_lv3 as string) ?? undefined,
    escaladoLv6: (r.escalado_lv6 as string) ?? undefined,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export function effectToDb(e: Effect): Record<string, unknown> {
  return {
    id: e.id,
    name: e.name,
    element: e.element,
    cost: e.cost,
    effect_type: e.effectType,
    salvation_attributes: e.salvationAttributes ?? null,
    dc: e.DC ?? null,
    description: e.description,
    escalado_lv3: e.escaladoLv3 ?? null,
    escalado_lv6: e.escaladoLv6 ?? null,
    created_at: e.createdAt,
    updated_at: e.updatedAt,
  };
}

// ─── Spell ───────────────────────────────────────────────────────────────────

export function spellFromDb(r: Record<string, unknown>): Spell {
  return {
    id: r.id as string,
    name: r.name as string,
    description: (r.description as string) ?? '',
    magnitude: r.magnitude as SpellMagnitude,
    forma: r.forma as SpellForma,
    elements: (r.elements as string[]) ?? [],
    effectIds: (r.effect_ids as string[]) ?? [],
    totalCost: r.total_cost as number,
    executionCost: r.execution_cost as number,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export function spellToDb(s: Spell): Record<string, unknown> {
  return {
    id: s.id,
    name: s.name,
    description: s.description,
    magnitude: s.magnitude,
    forma: s.forma,
    elements: s.elements,
    effect_ids: s.effectIds,
    total_cost: s.totalCost,
    execution_cost: s.executionCost,
    created_at: s.createdAt,
    updated_at: s.updatedAt,
  };
}

// ─── Character ───────────────────────────────────────────────────────────────

export function characterFromDb(r: Record<string, unknown>): Character {
  return {
    id: r.id as string,
    name: r.name as string,
    description: (r.description as string) ?? '',
    level: r.level as number,
    path: r.path as Path,
    POD: r.pod as DieSide,
    DES: r.des as DieSide,
    RES: r.res as DieSide,
    ING: r.ing as DieSide,
    HP: r.hp as number,
    EV: r.ev as number,
    AR: r.ar as number,
    weaponId: (r.weapon_id as string) ?? undefined,
    armorId: (r.armor_id as string) ?? undefined,
    accessoryIds: (r.accessory_ids as string[]) ?? [],
    spellIds: (r.spell_ids as string[]) ?? [],
    triggerIds: (r.trigger_ids as string[]) ?? [],
    reactionIds: (r.reaction_ids as string[]) ?? [],
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export function characterToDb(c: Character): Record<string, unknown> {
  return {
    id: c.id,
    name: c.name,
    description: c.description,
    level: c.level,
    path: c.path,
    pod: c.POD,
    des: c.DES,
    res: c.RES,
    ing: c.ING,
    hp: c.HP,
    ev: c.EV,
    ar: c.AR,
    weapon_id: c.weaponId ?? null,
    armor_id: c.armorId ?? null,
    accessory_ids: c.accessoryIds,
    spell_ids: c.spellIds,
    trigger_ids: c.triggerIds,
    reaction_ids: c.reactionIds,
    created_at: c.createdAt,
    updated_at: c.updatedAt,
  };
}

// ─── Monster ─────────────────────────────────────────────────────────────────

export function monsterFromDb(r: Record<string, unknown>): Monster {
  return {
    id: r.id as string,
    name: r.name as string,
    description: (r.description as string) ?? '',
    monsterType: r.monster_type as MonsterType,
    level: r.level as number,
    POD: r.pod as DieSide,
    DES: r.des as DieSide,
    RES: r.res as DieSide,
    ING: r.ing as DieSide,
    HP: r.hp as number,
    EV: r.ev === null ? 'infinito' : (r.ev as number),
    AR: r.ar as number,
    weaponId: (r.weapon_id as string) ?? undefined,
    armorId: (r.armor_id as string) ?? undefined,
    accessoryIds: (r.accessory_ids as string[]) ?? [],
    spellIds: (r.spell_ids as string[]) ?? [],
    triggerIds: (r.trigger_ids as string[]) ?? [],
    reactionIds: (r.reaction_ids as string[]) ?? [],
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export function monsterToDb(m: Monster): Record<string, unknown> {
  return {
    id: m.id,
    name: m.name,
    description: m.description,
    monster_type: m.monsterType,
    level: m.level,
    pod: m.POD,
    des: m.DES,
    res: m.RES,
    ing: m.ING,
    hp: m.HP,
    ev: m.EV === 'infinito' ? null : m.EV,
    ar: m.AR,
    weapon_id: m.weaponId ?? null,
    armor_id: m.armorId ?? null,
    accessory_ids: m.accessoryIds,
    spell_ids: m.spellIds,
    trigger_ids: m.triggerIds,
    reaction_ids: m.reactionIds,
    created_at: m.createdAt,
    updated_at: m.updatedAt,
  };
}
