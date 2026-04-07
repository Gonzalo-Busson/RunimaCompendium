import React, { useState, useEffect } from 'react';
import type { Trigger, Path } from '../../types';
import { PATHS } from '../../lib/constants';

interface TriggerFormProps {
  initial?: Trigger;
  onSubmit: (data: Omit<Trigger, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function TriggerForm({ initial, onSubmit, onCancel }: TriggerFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [path, setPath] = useState<Path>(initial?.path ?? 'Combate');
  const [mechanicalEffect, setMechanicalEffect] = useState(initial?.mechanicalEffect ?? '');
  const [identity, setIdentity] = useState(initial?.identity ?? '');

  useEffect(() => {
    if (!initial) return;
    setName(initial.name);
    setDescription(initial.description);
    setPath(initial.path);
    setMechanicalEffect(initial.mechanicalEffect);
    setIdentity(initial.identity);
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, description, path, mechanicalEffect, identity });
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
          placeholder="Nombre del disparador"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500 resize-none"
          placeholder="Descripción del disparador"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Senda *</label>
        <select
          value={path}
          onChange={(e) => setPath(e.target.value as Path)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500"
        >
          {PATHS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Efecto mecánico *</label>
        <textarea
          required
          value={mechanicalEffect}
          onChange={(e) => setMechanicalEffect(e.target.value)}
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500 resize-none"
          placeholder="Efecto mecánico del disparador"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Identidad *</label>
        <input
          required
          value={identity}
          onChange={(e) => setIdentity(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500"
          placeholder="Identidad del disparador"
        />
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
          {initial ? 'Guardar cambios' : 'Crear disparador'}
        </button>
      </div>
    </form>
  );
}
