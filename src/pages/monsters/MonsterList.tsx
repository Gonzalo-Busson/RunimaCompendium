import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useMonsterStore } from '../../store';
import { EntityCard } from '../../components/EntityCard';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { MonsterForm } from './MonsterForm';
import type { Monster } from '../../types';

export function MonsterList() {
  const { items, add, update, remove } = useMonsterStore();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Monster | undefined>();

  const filtered = items.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd(data: Omit<Monster, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    add({ ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now });
    setModalOpen(false);
  }

  function handleUpdate(data: Omit<Monster, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!editing) return;
    update(editing.id, { ...data, updatedAt: new Date().toISOString() });
    setEditing(undefined);
    setModalOpen(false);
  }

  function openEdit(monster: Monster) {
    setEditing(monster);
    setModalOpen(true);
  }

  function openCreate() {
    setEditing(undefined);
    setModalOpen(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-amber-400">Monstruos</h1>
          <p className="text-gray-400 text-sm">{items.length} monstruo(s) registrado(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-gray-900 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo monstruo
        </button>
      </div>
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar monstruos..." />
      </div>
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          {search ? 'No se encontraron monstruos.' : 'No hay monstruos registrados. ¡Crea el primero!'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((monster) => (
            <EntityCard
              key={monster.id}
              title={monster.name}
              onEdit={() => openEdit(monster)}
              onDelete={() => remove(monster.id)}
            >
              <div className="flex flex-wrap gap-1 mb-1">
                <Badge label={monster.monsterType} type="monsterType" />
                <Badge label={`Nv. ${monster.level}`} />
              </div>
              <div className="grid grid-cols-4 gap-1 text-xs text-center">
                {(['POD', 'DES', 'RES', 'ING'] as const).map((stat) => (
                  <div key={stat} className="bg-gray-700/60 rounded px-1 py-0.5">
                    <div className="text-gray-500">{stat}</div>
                    <div className="text-gray-200 font-semibold">{monster[stat]}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 text-xs mt-0.5">
                <span>HP: <span className="text-red-400 font-semibold">{monster.HP}</span></span>
                <span>
                  EV:{' '}
                  <span className="text-blue-400 font-semibold">
                    {monster.EV === 'infinito' ? '∞' : monster.EV}
                  </span>
                </span>
                <span>AR: <span className="text-yellow-400 font-semibold">{monster.AR}</span></span>
              </div>
              {monster.description && (
                <p className="line-clamp-2 text-gray-500">{monster.description}</p>
              )}
            </EntityCard>
          ))}
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(undefined); }}
        title={editing ? 'Editar monstruo' : 'Nuevo monstruo'}
      >
        <MonsterForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleAdd}
          onCancel={() => { setModalOpen(false); setEditing(undefined); }}
        />
      </Modal>
    </div>
  );
}
