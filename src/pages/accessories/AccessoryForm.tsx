import React, { useState, useEffect } from 'react';
import type { Accessory, AccessoryUsage } from '../../types';

interface AccessoryFormProps {
  initial?: Accessory;
  onSubmit: (data: Omit<Accessory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const USAGES: AccessoryUsage[] = ['Pasivo', '1/combate', '1/sesión'];

export function AccessoryForm({ initial, onSubmit, onCancel }: AccessoryFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [bonus, setBonus] = useState(initial?.bonus ?? '');
  const [usage, setUsage] = useState<AccessoryUsage>(initial?.usage ?? 'Pasivo');

  useEffect(() => {
    if (!initial) return;
    setName(initial.name);
    setDescription(initial.description);
    setBonus(initial.bonus);
    setUsage(initial.usage);
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, description, bonus, usage });
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
          placeholder="Nombre del accesorio"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500 resize-none"
          placeholder="Descripción del accesorio"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Bonificación *</label>
        <input
          required
          value={bonus}
          onChange={(e) => setBonus(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500"
          placeholder="Ej: +1 AR temporal, +1d6 de daño"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Uso *</label>
        <select
          value={usage}
          onChange={(e) => setUsage(e.target.value as AccessoryUsage)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500"
        >
          {USAGES.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
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
          {initial ? 'Guardar cambios' : 'Crear accesorio'}
        </button>
      </div>
    </form>
  );
}
