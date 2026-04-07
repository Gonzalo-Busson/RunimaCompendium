import React, { useState, useEffect, useMemo } from 'react';
import type { Spell, SpellMagnitude, SpellForma } from '../../types';
import { MAGNITUDES, FORMAS, ELEMENTS, calcSpellCost } from '../../lib/constants';
import { useEffectStore } from '../../store';

interface SpellFormProps {
  initial?: Spell;
  onSubmit: (data: Omit<Spell, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function SpellForm({ initial, onSubmit, onCancel }: SpellFormProps) {
  const allEffects = useEffectStore((s) => s.items);

  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [magnitude, setMagnitude] = useState<SpellMagnitude>(initial?.magnitude ?? 'Básico');
  const [forma, setForma] = useState<SpellForma>(initial?.forma ?? 'Simple');
  const [elements, setElements] = useState<string[]>(initial?.elements ?? []);
  const [effectIds, setEffectIds] = useState<string[]>(initial?.effectIds ?? []);

  useEffect(() => {
    if (!initial) return;
    setName(initial.name);
    setDescription(initial.description);
    setMagnitude(initial.magnitude);
    setForma(initial.forma);
    setElements(initial.elements);
    setEffectIds(initial.effectIds);
  }, [initial]);

  function toggleElement(el: string) {
    if (elements.includes(el)) {
      setElements(elements.filter((e) => e !== el));
    } else if (elements.length < 2) {
      setElements([...elements, el]);
    }
  }

  function toggleEffect(id: string) {
    if (effectIds.includes(id)) {
      setEffectIds(effectIds.filter((e) => e !== id));
    } else if (effectIds.length < 2) {
      setEffectIds([...effectIds, id]);
    }
  }

  const selectedEffects = useMemo(
    () => allEffects.filter((e) => effectIds.includes(e.id)),
    [allEffects, effectIds]
  );

  const baseCost = calcSpellCost(magnitude, forma);
  const elementsCost = elements.length;
  const effectsCost = selectedEffects.reduce((sum, e) => sum + e.cost, 0);
  const totalCost = baseCost + elementsCost + effectsCost;
  const executionCost = Math.ceil(totalCost / 2);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      name,
      description,
      magnitude,
      forma,
      elements,
      effectIds,
      totalCost,
      executionCost,
    });
  }

  const inputCls = 'w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Nombre *</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
          placeholder="Nombre del hechizo"
        />
      </div>

      {/* Magnitud y Forma */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Magnitud *</label>
          <select
            value={magnitude}
            onChange={(e) => setMagnitude(e.target.value as SpellMagnitude)}
            className={inputCls}
          >
            {MAGNITUDES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Forma *</label>
          <select
            value={forma}
            onChange={(e) => setForma(e.target.value as SpellForma)}
            className={inputCls}
          >
            {FORMAS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Elementos (máx 2) */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Elementos <span className="text-gray-500 text-xs">(máx. 2 — +1 PC c/u)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {ELEMENTS.map((el) => {
            const selected = elements.includes(el);
            const disabled = !selected && elements.length >= 2;
            return (
              <button
                key={el}
                type="button"
                disabled={disabled}
                onClick={() => toggleElement(el)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  selected
                    ? 'bg-amber-500 border-amber-500 text-gray-900'
                    : disabled
                    ? 'bg-gray-700/40 border-gray-600 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-amber-500/50'
                }`}
              >
                {el}
              </button>
            );
          })}
        </div>
      </div>

      {/* Efectos (máx 2) */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Efectos <span className="text-gray-500 text-xs">(máx. 2)</span>
        </label>
        {allEffects.length === 0 ? (
          <p className="text-gray-500 text-xs italic">No hay efectos registrados.</p>
        ) : (
          <div className="max-h-40 overflow-y-auto border border-gray-600 rounded-lg divide-y divide-gray-700">
            {allEffects.map((effect) => {
              const selected = effectIds.includes(effect.id);
              const disabled = !selected && effectIds.length >= 2;
              return (
                <label
                  key={effect.id}
                  className={`flex items-center gap-2 px-3 py-1.5 ${disabled ? 'opacity-40' : 'hover:bg-gray-700/50 cursor-pointer'}`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    disabled={disabled}
                    onChange={() => toggleEffect(effect.id)}
                    className="accent-amber-500"
                  />
                  <span className="text-sm text-gray-300 flex-1">{effect.name}</span>
                  <span className="text-xs text-amber-400 font-semibold">{effect.cost} PC</span>
                  <span className="text-xs text-gray-500">{effect.element}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Costo calculado */}
      <div className="bg-gray-700/40 border border-gray-600 rounded-lg px-4 py-3 text-sm">
        <div className="flex justify-between text-gray-400 mb-1">
          <span>Base (Magnitud × Forma)</span>
          <span className="text-gray-300">{baseCost} PC</span>
        </div>
        <div className="flex justify-between text-gray-400 mb-1">
          <span>Elementos ({elements.length})</span>
          <span className="text-gray-300">+{elementsCost} PC</span>
        </div>
        <div className="flex justify-between text-gray-400 mb-2">
          <span>Efectos ({selectedEffects.length})</span>
          <span className="text-gray-300">+{effectsCost} PC</span>
        </div>
        <div className="border-t border-gray-600 pt-2 flex justify-between font-semibold">
          <span className="text-gray-200">Coste de aprendizaje</span>
          <span className="text-amber-400">{totalCost} PC</span>
        </div>
        <div className="flex justify-between text-gray-400 text-xs mt-1">
          <span>Coste de ejecución</span>
          <span className="text-blue-400">{executionCost} PC</span>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`${inputCls} resize-none`}
          placeholder="Descripción del hechizo"
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
          {initial ? 'Guardar cambios' : 'Crear hechizo'}
        </button>
      </div>
    </form>
  );
}
