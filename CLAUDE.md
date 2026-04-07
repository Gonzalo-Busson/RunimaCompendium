# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # Type-check with tsc, then bundle with Vite
npm run preview   # Preview the production build locally
npm run test:run  # Run unit tests once (required before commit)
```

## Commit gate

Before committing any changes, always run:

```bash
npm run test:run
```

If tests fail, stop and do not create the commit until the failures are fixed.

## Architecture

Pure client-side React + TypeScript SPA. No backend — all data is persisted to `localStorage` via Zustand's `persist` middleware.

**Entry point:** `index.html` → `src/main.tsx` → `src/App.tsx` (BrowserRouter + routes) → `src/components/Layout.tsx` (fixed sidebar + `<Outlet />`).

**State:** `src/store/index.ts` exports one Zustand store per entity (`useCharacterStore`, `useMonsterStore`, `useWeaponStore`, `useArmorStore`, `useAccessoryStore`, `useSpellStore`, `useTriggerStore`, `useReactionStore`, `useEffectStore`). Each store has `items`, `add`, `update`, `remove`.

**Types:** All interfaces and union types are in `src/types/index.ts`. Monster EV can be `number | 'infinito'`.

**Constants & formulas:** `src/lib/constants.ts` contains die sides, paths, elements, spell magnitudes/forms, color maps, and `calcSpellCost(magnitude, forma)`. Spell total cost = `calcSpellCost` + elements count + sum of selected effect costs; execution cost = `Math.ceil(totalCost / 2)`.

**Page pattern:** Every entity has a `*List.tsx` (search, grid of `EntityCard`, modal trigger) and a `*Form.tsx` (controlled form, calls `onSubmit` with data minus `id/createdAt/updatedAt`). IDs are generated with `crypto.randomUUID()` in the List component.

**Routes** (`src/App.tsx`):
| Path | Component |
|---|---|
| `/` | Dashboard |
| `/personajes` | CharacterList |
| `/monstruos` | MonsterList |
| `/armas` | WeaponList |
| `/armaduras` | ArmorList |
| `/accesorios` | AccessoryList |
| `/hechizos` | SpellList |
| `/disparadores` | TriggerList |
| `/reacciones` | ReactionList |
| `/efectos` | EffectList |

**Styling:** Tailwind CSS loaded from CDN (no PostCSS/build step). Dark theme: `bg-gray-900` base, `text-amber-400` accent. Custom color `gray-850` defined in `index.html` tailwind config block.

## Game rules summary (Runima TTRP)

- **Attributes:** POD, DES, RES, ING — each a die (`d4`–`d12`). Default `d6`; raising one requires lowering another.
- **Paths:** Combate, Arma, Magia, Estrategia — determines trigger/reaction access.
- **Elements:** Fuego, Agua, Aire, Tierra, Luz, Oscuridad, No elemental.
- **Spells:** built from Magnitude × Forma + up to 2 elements (1 PC each) + up to 2 effects. Spells reference Effects by ID; Characters/Monsters reference Spells, Triggers, Reactions, Weapon, Armor, Accessories by ID.
- **Effects** are the building blocks for spells, organized by element with optional DC/salvation attributes and Lv3/Lv6 escalation.
