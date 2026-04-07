import React, { useState, useEffect } from 'react';
import type { Armor, ArmorType } from '../../types';

interface ArmorFormProps {
  initial?: Armor;
  onSubmit: (data: Omit<Armor, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const ARMOR_TYPES: ArmorType[] = ['Ligera', 'Media', 'Pesada'];
const ARMOR_AR: Record<ArmorType, number> = { Ligera: 2, Media: 3, Pesada: 4 };

export function ArmorForm({ initial, onSubmit, onCancel }: ArmorFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [armorType, setArmorType] = useState<ArmorType>(initial?.armorType ?? 'Ligera');

  const AR = ARMOR_AR[armorType];

  useEffect(() => {
    if (!initial) return;
    setName(initial.name);
    setDescription(initial.description);
    setArmorType(initial.armorType);
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, description, armorType, AR });
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
          placeholder="Nombre de la armadura"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500 resize-none"
          placeholder="Descripción de la armadura"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de armadura *</label>
          <select
            value={armorType}
            onChange={(e) => setArmorType(e.target.value as ArmorType)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500"
          >
            {ARMOR_TYPES.map((t) => (
              <option key={t} value={t}>
                {t} (AR {ARMOR_AR[t]})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">AR (Armadura)</label>
          <div className="w-full bg-gray-600 border border-gray-600 rounded-lg px-3 py-2 text-gray-300">
            {AR}
          </div>
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
          {initial ? 'Guardar cambios' : 'Crear armadura'}
        </button>
      </div>
    </form>
  );
}
