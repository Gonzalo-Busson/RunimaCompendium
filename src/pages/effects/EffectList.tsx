import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useEffectStore } from '../../store';
import { EntityCard } from '../../components/EntityCard';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { EffectForm } from './EffectForm';
import type { Effect } from '../../types';

export function EffectList() {
  const { items, add, update, remove } = useEffectStore();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Effect | undefined>();

  const filtered = items.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd(data: Omit<Effect, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    add({ ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now });
    setModalOpen(false);
  }

  function handleUpdate(data: Omit<Effect, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!editing) return;
    update(editing.id, { ...data, updatedAt: new Date().toISOString() });
    setEditing(undefined);
    setModalOpen(false);
  }

  function openEdit(effect: Effect) {
    setEditing(effect);
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
          <h1 className="text-2xl font-bold text-amber-400">Efectos</h1>
          <p className="text-gray-400 text-sm">{items.length} efecto(s) registrado(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-gray-900 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo efecto
        </button>
      </div>
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar efectos..." />
      </div>
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          {search ? 'No se encontraron efectos.' : 'No hay efectos registrados. ¡Crea el primero!'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((effect) => (
            <EntityCard
              key={effect.id}
              title={effect.name}
              onEdit={() => openEdit(effect)}
              onDelete={() => remove(effect.id)}
            >
              <div className="flex flex-wrap gap-1 mb-1">
                <Badge label={effect.element} type="element" />
                <Badge label={effect.effectType} />
              </div>
              <p>Coste: <span className="text-amber-400 font-semibold">{effect.cost}</span></p>
              {effect.salvationAttributes && (
                <p>Salvación: <span className="text-gray-300">{effect.salvationAttributes}</span></p>
              )}
              {effect.DC && (
                <p>DC: <span className="text-gray-300">{effect.DC}</span></p>
              )}
              <p className="line-clamp-2 text-gray-500">{effect.description}</p>
            </EntityCard>
          ))}
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(undefined); }}
        title={editing ? 'Editar efecto' : 'Nuevo efecto'}
      >
        <EffectForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleAdd}
          onCancel={() => { setModalOpen(false); setEditing(undefined); }}
        />
      </Modal>
    </div>
  );
}
