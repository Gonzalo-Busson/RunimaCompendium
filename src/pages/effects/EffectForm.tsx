import React, { useState, useEffect } from 'react';
import type { Effect, Element } from '../../types';
import { ELEMENTS } from '../../lib/constants';

interface EffectFormProps {
  initial?: Effect;
  onSubmit: (data: Omit<Effect, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const EFFECT_TYPES = ['Daño', 'Control', 'Estado', 'Curación', 'Barrera', 'Invocación', 'Utilidad'];

export function EffectForm({ initial, onSubmit, onCancel }: EffectFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [element, setElement] = useState<Element>(initial?.element ?? 'No elemental');
  const [cost, setCost] = useState(initial?.cost ?? 1);
  const [effectType, setEffectType] = useState(initial?.effectType ?? 'Daño');
  const [customType, setCustomType] = useState('');
  const [salvationAttributes, setSalvationAttributes] = useState(initial?.salvationAttributes ?? '');
  const [DC, setDC] = useState(initial?.DC ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [escaladoLv3, setEscaladoLv3] = useState(initial?.escaladoLv3 ?? '');
  const [escaladoLv6, setEscaladoLv6] = useState(initial?.escaladoLv6 ?? '');

  useEffect(() => {
    if (!initial) return;
    setName(initial.name);
    setElement(initial.element);
    setCost(initial.cost);
    setEffectType(initial.effectType);
    setSalvationAttributes(initial.salvationAttributes ?? '');
    setDC(initial.DC ?? '');
    setDescription(initial.description);
    setEscaladoLv3(initial.escaladoLv3 ?? '');
    setEscaladoLv6(initial.escaladoLv6 ?? '');
  }, [initial]);

  const resolvedType = effectType === '__custom__' ? customType : effectType;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      name,
      element,
      cost,
      effectType: resolvedType,
      salvationAttributes: salvationAttributes || undefined,
      DC: DC || undefined,
      description,
      escaladoLv3: escaladoLv3 || undefined,
      escaladoLv6: escaladoLv6 || undefined,
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
          placeholder="Nombre del efecto"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Elemento *</label>
          <select
            value={element}
            onChange={(e) => setElement(e.target.value as Element)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500"
          >
            {ELEMENTS.map((el) => (
              <option key={el} value={el}>{el}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Coste *</label>
          <input
            type="number"
            required
            min={1}
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de efecto *</label>
        <select
          value={effectType}
          onChange={(e) => setEffectType(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500"
        >
          {EFFECT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
          <option value="__custom__">Otro (personalizado)</option>
        </select>
        {effectType === '__custom__' && (
          <input
            required
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            className="mt-2 w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500"
            placeholder="Escribe el tipo de efecto"
          />
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Atributos de salvación</label>
          <input
            value={salvationAttributes}
            onChange={(e) => setSalvationAttributes(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500"
            placeholder="Ej: RES+RES"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">DC</label>
          <input
            value={DC}
            onChange={(e) => setDC(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500"
            placeholder="Ej: HR"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Descripción *</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500 resize-none"
          placeholder="Descripción del efecto"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Escalado Lv 3</label>
        <input
          value={escaladoLv3}
          onChange={(e) => setEscaladoLv3(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500"
          placeholder="Efecto mejorado al nivel 3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Escalado Lv 6</label>
        <input
          value={escaladoLv6}
          onChange={(e) => setEscaladoLv6(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500"
          placeholder="Efecto mejorado al nivel 6"
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
          {initial ? 'Guardar cambios' : 'Crear efecto'}
        </button>
      </div>
    </form>
  );
}
