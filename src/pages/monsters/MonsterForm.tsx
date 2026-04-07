import React, { useState, useEffect } from 'react';
import type { Monster, MonsterType, DieSide } from '../../types';
import { DIE_SIDES } from '../../lib/constants';
import { useWeaponStore } from '../../store';
import { useArmorStore } from '../../store';
import { useAccessoryStore } from '../../store';
import { useSpellStore } from '../../store';
import { useTriggerStore } from '../../store';
import { useReactionStore } from '../../store';

interface MonsterFormProps {
  initial?: Monster;
  onSubmit: (data: Omit<Monster, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const MONSTER_TYPES: MonsterType[] = ['Normal', 'Elite', 'Miniboss', 'Jefe'];

function StatSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: DieSide;
  onChange: (v: DieSide) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as DieSide)}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-gray-100 focus:outline-none focus:border-amber-500 text-sm"
      >
        {DIE_SIDES.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
  );
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { id: string; name: string }[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      {options.length === 0 ? (
        <p className="text-gray-500 text-xs italic">No hay registros disponibles.</p>
      ) : (
        <div className="max-h-32 overflow-y-auto border border-gray-600 rounded-lg divide-y divide-gray-700">
          {options.map((o) => (
            <label key={o.id} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-700/50 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(o.id)}
                onChange={() => toggle(o.id)}
                className="accent-amber-500"
              />
              <span className="text-sm text-gray-300">{o.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export function MonsterForm({ initial, onSubmit, onCancel }: MonsterFormProps) {
  const weapons = useWeaponStore((s) => s.items);
  const armors = useArmorStore((s) => s.items);
  const accessories = useAccessoryStore((s) => s.items);
  const spells = useSpellStore((s) => s.items);
  const triggers = useTriggerStore((s) => s.items);
  const reactions = useReactionStore((s) => s.items);

  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [monsterType, setMonsterType] = useState<MonsterType>(initial?.monsterType ?? 'Normal');
  const [level, setLevel] = useState(initial?.level ?? 1);
  const [POD, setPOD] = useState<DieSide>(initial?.POD ?? 'd6');
  const [DES, setDES] = useState<DieSide>(initial?.DES ?? 'd6');
  const [RES, setRES] = useState<DieSide>(initial?.RES ?? 'd6');
  const [ING, setING] = useState<DieSide>(initial?.ING ?? 'd6');
  const [HP, setHP] = useState(initial?.HP ?? 0);
  const [infiniteEV, setInfiniteEV] = useState(initial?.EV === 'infinito');
  const [EVNum, setEVNum] = useState(typeof initial?.EV === 'number' ? initial.EV : 0);
  const [AR, setAR] = useState(initial?.AR ?? 0);
  const [weaponId, setWeaponId] = useState(initial?.weaponId ?? '');
  const [armorId, setArmorId] = useState(initial?.armorId ?? '');
  const [accessoryIds, setAccessoryIds] = useState<string[]>(initial?.accessoryIds ?? []);
  const [spellIds, setSpellIds] = useState<string[]>(initial?.spellIds ?? []);
  const [triggerIds, setTriggerIds] = useState<string[]>(initial?.triggerIds ?? []);
  const [reactionIds, setReactionIds] = useState<string[]>(initial?.reactionIds ?? []);

  useEffect(() => {
    if (!initial) return;
    setName(initial.name);
    setDescription(initial.description);
    setMonsterType(initial.monsterType);
    setLevel(initial.level);
    setPOD(initial.POD);
    setDES(initial.DES);
    setRES(initial.RES);
    setING(initial.ING);
    setHP(initial.HP);
    setInfiniteEV(initial.EV === 'infinito');
    setEVNum(typeof initial.EV === 'number' ? initial.EV : 0);
    setAR(initial.AR);
    setWeaponId(initial.weaponId ?? '');
    setArmorId(initial.armorId ?? '');
    setAccessoryIds(initial.accessoryIds);
    setSpellIds(initial.spellIds);
    setTriggerIds(initial.triggerIds);
    setReactionIds(initial.reactionIds);
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      name,
      description,
      monsterType,
      level,
      POD,
      DES,
      RES,
      ING,
      HP,
      EV: infiniteEV ? 'infinito' : EVNum,
      AR,
      weaponId: weaponId || undefined,
      armorId: armorId || undefined,
      accessoryIds,
      spellIds,
      triggerIds,
      reactionIds,
    });
  }

  const inputCls = 'w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Nombre, nivel y tipo */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-300 mb-1">Nombre *</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
            placeholder="Nombre del monstruo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tipo *</label>
          <select
            value={monsterType}
            onChange={(e) => setMonsterType(e.target.value as MonsterType)}
            className={inputCls}
          >
            {MONSTER_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Nivel</label>
          <input
            type="number"
            min={1}
            max={10}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className={inputCls}
          />
        </div>
      </div>

      {/* Atributos */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Atributos</label>
        <div className="grid grid-cols-4 gap-3">
          <StatSelect label="POD" value={POD} onChange={setPOD} />
          <StatSelect label="DES" value={DES} onChange={setDES} />
          <StatSelect label="RES" value={RES} onChange={setRES} />
          <StatSelect label="ING" value={ING} onChange={setING} />
        </div>
      </div>

      {/* Stats derivados */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">HP</label>
          <input
            type="number"
            min={0}
            value={HP}
            onChange={(e) => setHP(Number(e.target.value))}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">EV</label>
          <div className="flex items-center gap-2">
            {infiniteEV ? (
              <div className={`${inputCls} text-purple-400 font-semibold`}>∞ Infinito</div>
            ) : (
              <input
                type="number"
                min={0}
                value={EVNum}
                onChange={(e) => setEVNum(Number(e.target.value))}
                className={inputCls}
              />
            )}
          </div>
          <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={infiniteEV}
              onChange={(e) => setInfiniteEV(e.target.checked)}
              className="accent-amber-500"
            />
            <span className="text-xs text-gray-400">EV infinito (Jefe)</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">AR</label>
          <input
            type="number"
            min={0}
            value={AR}
            onChange={(e) => setAR(Number(e.target.value))}
            className={inputCls}
          />
        </div>
      </div>

      {/* Equipamiento */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Arma</label>
          <select
            value={weaponId}
            onChange={(e) => setWeaponId(e.target.value)}
            className={inputCls}
          >
            <option value="">— Sin arma —</option>
            {weapons.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Armadura</label>
          <select
            value={armorId}
            onChange={(e) => setArmorId(e.target.value)}
            className={inputCls}
          >
            <option value="">— Sin armadura —</option>
            {armors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Colecciones */}
      <MultiSelect
        label="Accesorios"
        options={accessories}
        selected={accessoryIds}
        onChange={setAccessoryIds}
      />
      <MultiSelect
        label="Hechizos"
        options={spells}
        selected={spellIds}
        onChange={setSpellIds}
      />
      <MultiSelect
        label="Disparadores"
        options={triggers}
        selected={triggerIds}
        onChange={setTriggerIds}
      />
      <MultiSelect
        label="Reacciones"
        options={reactions}
        selected={reactionIds}
        onChange={setReactionIds}
      />

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className={`${inputCls} resize-none`}
          placeholder="Notas o trasfondo del monstruo"
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
          {initial ? 'Guardar cambios' : 'Crear monstruo'}
        </button>
      </div>
    </form>
  );
}
