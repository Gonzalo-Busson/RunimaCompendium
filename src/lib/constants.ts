import type { DieSide, Path, SpellMagnitude, SpellForma } from '../types';

export const DIE_SIDES: DieSide[] = ['d4', 'd6', 'd8', 'd10', 'd12'];

export const PATHS: Path[] = ['Combate', 'Arma', 'Magia', 'Estrategia'];

export const ELEMENTS = [
  'Fuego',
  'Agua',
  'Aire',
  'Tierra',
  'Luz',
  'Oscuridad',
  'No elemental',
] as const;

export const MAGNITUDES: SpellMagnitude[] = [
  'Básico',
  'Pequeño',
  'Medio',
  'Gran',
  'Colosal',
  'Ultimate',
];

export const FORMAS: SpellForma[] = ['Simple', 'Compleja', 'Perfecta'];

// Base cost per magnitude
export const MAGNITUDE_TABLE: Record<SpellMagnitude, number> = {
  Básico: 1,
  Pequeño: 2,
  Medio: 4,
  Gran: 7,
  Colosal: 11,
  Ultimate: 16,
};

// Multiplier per forma
export const FORMA_TABLE: Record<SpellForma, number> = {
  Simple: 1,
  Compleja: 1.5,
  Perfecta: 2,
};

export function calcSpellCost(
  magnitude: SpellMagnitude,
  forma: SpellForma
): number {
  const base = MAGNITUDE_TABLE[magnitude];
  const multiplier = FORMA_TABLE[forma];
  return Math.ceil(base * multiplier);
}

export const ELEMENT_COLORS: Record<string, string> = {
  Fuego: 'bg-red-600 text-white',
  Agua: 'bg-blue-600 text-white',
  Aire: 'bg-cyan-500 text-white',
  Tierra: 'bg-yellow-600 text-white',
  Luz: 'bg-yellow-300 text-gray-900',
  Oscuridad: 'bg-purple-700 text-white',
  'No elemental': 'bg-gray-500 text-white',
};

export const PATH_COLORS: Record<string, string> = {
  Combate: 'bg-red-700 text-white',
  Arma: 'bg-orange-600 text-white',
  Magia: 'bg-violet-600 text-white',
  Estrategia: 'bg-green-700 text-white',
};

export const MONSTER_TYPE_COLORS: Record<string, string> = {
  Normal: 'bg-gray-500 text-white',
  Elite: 'bg-blue-600 text-white',
  Miniboss: 'bg-purple-600 text-white',
  Jefe: 'bg-red-700 text-white',
};
