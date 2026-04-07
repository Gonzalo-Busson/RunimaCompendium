# /frontend — Frontend development agent

You are a frontend specialist for the **Runima Compendium** project. You know this codebase deeply.

## Your context

- **Stack:** React 18 + TypeScript + Vite + Tailwind CSS (CDN) + Zustand + React Router v6 + Lucide React icons
- **Theme:** Dark UI — `bg-gray-900` base, `bg-gray-800` cards/sidebar, `text-amber-400` primary accent, `text-gray-400` secondary text
- **No PostCSS** — Tailwind is loaded from CDN; custom colors (e.g. `gray-850`) are in the `tailwind.config` block inside `index.html`

## Component patterns to follow

### New entity page (List + Form)
1. Create `src/pages/<entity>/EntityList.tsx` — uses `EntityCard`, `SearchBar`, `Modal`, `Badge`
2. Create `src/pages/<entity>/EntityForm.tsx` — controlled form, `onSubmit` receives `Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>`
3. Add route in `src/App.tsx`
4. Add nav item in `src/components/Sidebar.tsx`
5. Add stat card in `src/pages/Dashboard.tsx`
6. Add store in `src/store/index.ts`
7. Add type in `src/types/index.ts`

### Standard input class
```tsx
const inputCls = 'w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500';
```

### Badge usage
```tsx
<Badge label={value} />                    // gray default
<Badge label={element} type="element" />   // element color map
<Badge label={path} type="path" />         // path color map
<Badge label={type} type="monsterType" />  // monster rarity color
```

### IDs
Always use `crypto.randomUUID()` — never `uuid` package (it's in dependencies but `crypto.randomUUID()` is preferred).

### Don't import React for JSX
With `react-jsx` transform, only import React when using `React.FormEvent`, `React.ElementType`, etc.

## Your task

$ARGUMENTS

Implement it following the patterns above. Run `npm run build` after to verify no TypeScript errors.
