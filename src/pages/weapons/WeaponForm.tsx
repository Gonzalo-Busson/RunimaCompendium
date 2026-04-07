import React, { useState, useEffect } from 'react';
import type { Weapon, WeaponType } from '../../types';
import { ELEMENTS } from '../../lib/constants';

interface WeaponFormProps {
  initial?: Weapon;
  onSubmit: (data: Omit<Weapon, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const WEAPON_TYPES: WeaponType[] = ['Simple', 'Marcial', 'Pesada'];
const WEAPON_MODIFIERS: Record<WeaponType, 2 | 4 | 6> = {
  Simple: 2,
  Marcial: 4,
  Pesada: 6,
};
const STATS = ['POD', 'DES', 'RES', 'ING'] as const;

export function WeaponForm({ initial, onSubmit, onCancel }: WeaponFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [weaponType, setWeaponType] = useState<WeaponType>(initial?.weaponType ?? 'Simple');
  const [associatedStat, setAssociatedStat] = useState<'POD' | 'DES' | 'RES' | 'ING'>(
    initial?.associatedStat ?? 'POD'
  );
  const [element, setElement] = useState(initial?.element ?? '');

  const modifier = WEAPON_MODIFIERS[weaponType];

  useEffect(() => {
    if (!initial) return;
    setName(initial.name);
    setDescription(initial.description);
    setWeaponType(initial.weaponType);
    setAssociatedStat(initial.associatedStat);
    setElement(initial.element ?? '');
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      name,
      description,
      weaponType,
      modifier,
      associatedStat,
      element: element || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Nombre *</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500"
          placeholder="Nombre del arma"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500 resize-none"
          placeholder="Descripción del arma"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de arma *</label>
          <select
            value={weaponType}
            onChange={(e) => setWeaponType(e.target.value as WeaponType)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500"
          >
            {WEAPON_TYPES.map((t) => (
              <option key={t} value={t}>
                {t} (+{WEAPON_MODIFIERS[t]})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Modificador</label>
          <div className="w-full bg-gray-600 border border-gray-600 rounded-lg px-3 py-2 text-gray-300">
            +{modifier}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Estadística asociada *</label>
          <select
            value={associatedStat}
            onChange={(e) => setAssociatedStat(e.target.value as 'POD' | 'DES' | 'RES' | 'ING')}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500"
          >
            {STATS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Elemento (opcional)</label>
          <select
            value={element}
            onChange={(e) => setElement(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500"
          >
            <option value="">Sin elemento</option>
            {ELEMENTS.map((el) => (
              <option key={el} value={el}>{el}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-amber-500 text-gray-900 font-semibold hover:bg-amber-400 transition-colors"
        >
          {initial ? 'Guardar cambios' : 'Crear arma'}
        </button>
      </div>
    </form>
  );
}
