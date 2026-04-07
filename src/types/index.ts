export type DieSide = 'd4' | 'd6' | 'd8' | 'd10' | 'd12';
export type Path = 'Combate' | 'Arma' | 'Magia' | 'Estrategia';
export type Element =
  | 'Fuego'
  | 'Agua'
  | 'Aire'
  | 'Tierra'
  | 'Luz'
  | 'Oscuridad'
  | 'No elemental';

export interface Character {
  id: string;
  name: string;
  description: string;
  level: number;
  path: Path;
  POD: DieSide;
  DES: DieSide;
  RES: DieSide;
  ING: DieSide;
  HP: number;
  EV: number;
  AR: number;
  weaponId?: string;
  armorId?: string;
  accessoryIds: string[];
  spellIds: string[];
  triggerIds: string[];
  reactionIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type MonsterType = 'Normal' | 'Elite' | 'Miniboss' | 'Jefe';

export interface Monster {
  id: string;
  name: string;
  description: string;
  monsterType: MonsterType;
  level: number;
  POD: DieSide;
  DES: DieSide;
  RES: DieSide;
  ING: DieSide;
  HP: number;
  EV: number | 'infinito';
  AR: number;
  weaponId?: string;
  armorId?: string;
  accessoryIds: string[];
  spellIds: string[];
  triggerIds: string[];
  reactionIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type WeaponType = 'Simple' | 'Marcial' | 'Pesada';

export interface Weapon {
  id: string;
  name: string;
  description: string;
  weaponType: WeaponType;
  modifier: 2 | 4 | 6;
  associatedStat: 'POD' | 'DES' | 'RES' | 'ING';
  element?: string;
  createdAt: string;
  updatedAt: string;
}

export type ArmorType = 'Ligera' | 'Media' | 'Pesada';

export interface Armor {
  id: string;
  name: string;
  description: string;
  armorType: ArmorType;
  AR: number;
  createdAt: string;
  updatedAt: string;
}

export type AccessoryUsage = 'Pasivo' | '1/combate' | '1/sesión';

export interface Accessory {
  id: string;
  name: string;
  description: string;
  bonus: string;
  usage: AccessoryUsage;
  createdAt: string;
  updatedAt: string;
}

export type SpellMagnitude =
  | 'Básico'
  | 'Pequeño'
  | 'Medio'
  | 'Gran'
  | 'Colosal'
  | 'Ultimate';

export type SpellForma = 'Simple' | 'Compleja' | 'Perfecta';

export interface Spell {
  id: string;
  name: string;
  description: string;
  magnitude: SpellMagnitude;
  forma: SpellForma;
  elements: string[];
  effectIds: string[];
  totalCost: number;
  executionCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface Trigger {
  id: string;
  name: string;
  description: string;
  path: Path;
  mechanicalEffect: string;
  identity: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reaction {
  id: string;
  name: string;
  description: string;
  path: Path;
  triggerCondition: string;
  effect: string;
  createdAt: string;
  updatedAt: string;
}

export interface Effect {
  id: string;
  name: string;
  element: Element;
  cost: number;
  effectType: string;
  salvationAttributes?: string;
  DC?: string;
  description: string;
  escaladoLv3?: string;
  escaladoLv6?: string;
  createdAt: string;
  updatedAt: string;
}
