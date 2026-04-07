import type {
  Character, Monster, Weapon, Armor, Accessory,
  Spell, Trigger, Reaction, Effect,
} from '../types';

export const mockWeapon: Weapon = {
  id: 'weapon-1',
  name: 'Espada Larga',
  description: 'Una espada de hoja larga',
  weaponType: 'Marcial',
  modifier: 4,
  associatedStat: 'POD',
  element: 'Fuego',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockWeapon2: Weapon = {
  id: 'weapon-2',
  name: 'Daga',
  description: '',
  weaponType: 'Simple',
  modifier: 2,
  associatedStat: 'DES',
  createdAt: '2024-01-02T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z',
};

export const mockArmor: Armor = {
  id: 'armor-1',
  name: 'Armadura de Placas',
  description: 'Armadura completa de metal',
  armorType: 'Pesada',
  AR: 6,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockAccessory: Accessory = {
  id: 'accessory-1',
  name: 'Anillo de Protección',
  description: '+1 a las tiradas de defensa',
  bonus: '+1 DEF',
  usage: 'Pasivo',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockEffect: Effect = {
  id: 'effect-1',
  name: 'Bola de Fuego',
  element: 'Fuego',
  cost: 3,
  effectType: 'Daño',
  description: 'Lanza una bola de fuego',
  salvationAttributes: 'RES',
  DC: '15',
  escaladoLv3: 'Daño aumentado',
  escaladoLv6: 'Daño máximo',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockSpell: Spell = {
  id: 'spell-1',
  name: 'Hechizo de Llamas',
  description: 'Un poderoso hechizo de fuego',
  magnitude: 'Medio',
  forma: 'Compleja',
  elements: ['Fuego'],
  effectIds: ['effect-1'],
  totalCost: 5,
  executionCost: 2,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockTrigger: Trigger = {
  id: 'trigger-1',
  name: 'Golpe Preciso',
  description: 'Un golpe certero',
  path: 'Combate',
  mechanicalEffect: '+2 al ataque',
  identity: 'Guerrero',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockReaction: Reaction = {
  id: 'reaction-1',
  name: 'Esquiva',
  description: 'Evita un ataque',
  path: 'Arma',
  triggerCondition: 'Cuando eres atacado',
  effect: 'Añade DES al AR',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockCharacter: Character = {
  id: 'character-1',
  name: 'Aragorn',
  description: 'Un valiente guerrero',
  level: 5,
  path: 'Combate',
  POD: 'd8',
  DES: 'd6',
  RES: 'd8',
  ING: 'd4',
  HP: 40,
  EV: 14,
  AR: 4,
  weaponId: 'weapon-1',
  armorId: 'armor-1',
  accessoryIds: ['accessory-1'],
  spellIds: [],
  triggerIds: ['trigger-1'],
  reactionIds: ['reaction-1'],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockMonster: Monster = {
  id: 'monster-1',
  name: 'Dragón Rojo',
  description: 'Un dragón ancestral',
  monsterType: 'Jefe',
  level: 10,
  POD: 'd12',
  DES: 'd8',
  RES: 'd12',
  ING: 'd6',
  HP: 100,
  EV: 'infinito',
  AR: 8,
  weaponId: undefined,
  armorId: undefined,
  accessoryIds: [],
  spellIds: ['spell-1'],
  triggerIds: [],
  reactionIds: [],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockMonsterNormal: Monster = {
  ...mockMonster,
  id: 'monster-2',
  name: 'Goblin',
  monsterType: 'Normal',
  EV: 8,
};
