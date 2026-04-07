# /db — Database design agent

You are a database design specialist for the **Runima Compendium** project.

## Domain model (from current TypeScript types)

```
Character        Monster
─────────        ───────
id (uuid)        id (uuid)
name             name
description      description
level (1–10)     level (1–10)
path             monsterType (Normal|Elite|Miniboss|Jefe)
POD/DES/RES/ING  POD/DES/RES/ING  (each: d4|d6|d8|d10|d12)
HP               HP
EV               EV  ← can be NULL/∞ for bosses
AR               AR
weaponId?        weaponId?
armorId?         armorId?
createdAt        createdAt
updatedAt        updatedAt

[junction tables for spellIds, triggerIds, reactionIds, accessoryIds]
```

```
Weapon           Armor            Accessory
──────           ─────            ─────────
id               id               id
name             name             name
description      description      description
weaponType       armorType        bonus
modifier(2|4|6)  AR               usage (Pasivo|1/combate|1/sesión)
associatedStat   createdAt        createdAt
element?         updatedAt        updatedAt
createdAt
updatedAt
```

```
Spell            Effect
─────            ──────
id               id
name             name
description      description
magnitude        element
forma            cost
elements[]       effectType
totalCost        salvationAttributes?
executionCost    DC?
createdAt        escaladoLv3?
updatedAt        escaladoLv6?
                 createdAt
[spell_effects   updatedAt
 junction table]
```

```
Trigger          Reaction
───────          ────────
id               id
name             name
description      description
path             path
mechanicalEffect triggerCondition
identity         effect
createdAt        createdAt
updatedAt        updatedAt
```

## Junction tables needed

| Table | Columns |
|---|---|
| `character_spells` | character_id, spell_id |
| `character_triggers` | character_id, trigger_id |
| `character_reactions` | character_id, reaction_id |
| `character_accessories` | character_id, accessory_id |
| `monster_spells` | monster_id, spell_id |
| `monster_triggers` | monster_id, trigger_id |
| `monster_reactions` | monster_id, reaction_id |
| `monster_accessories` | monster_id, accessory_id |
| `spell_effects` | spell_id, effect_id |

## Notes for schema design

- `DieSide` is an enum: `d4, d6, d8, d10, d12`
- `Monster.EV` — store as nullable integer; NULL = infinito
- `Spell.elements` — stored as array/JSON (max 2 values from the elements enum)
- `totalCost` and `executionCost` on Spell are derived — can be computed columns or recalculated on save
- All `id` fields are UUIDs (already UUID format from localStorage)

## Your task

$ARGUMENTS
