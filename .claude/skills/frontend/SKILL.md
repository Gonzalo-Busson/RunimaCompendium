---
name: Frontend Development
description: React/TypeScript frontend specialist for Runima Compendium. Creates pages, components, store slices, and routes following the project's dark-theme Tailwind + Zustand patterns.
---

# Frontend Development

Specialist skill for building UI features in the Runima Compendium React + TypeScript SPA.

## What This Skill Does

Invokes the `frontend-dev` agent to implement frontend tasks while enforcing the project's existing conventions: dark theme, Tailwind CDN (no PostCSS), Zustand persist stores, React Router v6 routes, and the 7-step new-entity checklist.

**Key Capabilities:**
- New entity pages (List + Form + route + sidebar + dashboard + store + types)
- New reusable components following existing Badge/EntityCard patterns
- Store slice additions and modifications
- Route and sidebar wiring
- Build verification after every change (`npm run build` + `npm run test:run`)

## Quick Start

Invoke via the `/frontend` command:

```
/frontend add a new page for tracking campaign sessions
```

```
/frontend add a DiceRoller component to the Dashboard
```

```
/frontend fix the spell cost calculation display in SpellCard
```

## Agent

This skill delegates to the **`frontend-dev`** agent defined at:
`.claude/agents/development/dev-frontend.md`

The agent knows the full stack (React 18, TypeScript, Vite, Tailwind CDN, Zustand, React Router v6, Lucide React) and the Runima game-domain types (POD/DES/RES/ING attributes, elements, paths, spell cost formula).

## Conventions enforced

| Convention | Detail |
|---|---|
| Input class | `bg-gray-700 border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:border-amber-500` |
| IDs | `crypto.randomUUID()` only |
| JSX | No `import React` unless needed for a type |
| Tailwind custom colors | Defined in `index.html` tailwind config block |
| Store shape | `{ items, add, update, remove }` with `persist` middleware |
| Form contract | `onSubmit` receives `Omit<Entity, 'id' \| 'createdAt' \| 'updatedAt'>` |

## New Entity Checklist

The agent always completes all 7 steps when adding a new entity:

1. `src/pages/<entity>/EntityList.tsx`
2. `src/pages/<entity>/EntityForm.tsx`
3. Route in `src/App.tsx`
4. Nav item in `src/components/Sidebar.tsx`
5. Stat card in `src/pages/Dashboard.tsx`
6. Store slice in `src/store/index.ts`
7. Type in `src/types/index.ts`

## Related

- `/frontend` command: `.claude/commands/frontend.md`
- Backend agent: `.claude/agents/development/dev-backend-api.md`
- Orchestrator: `.claude/agents/v3/sparc-orchestrator.md`
