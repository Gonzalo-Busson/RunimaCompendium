import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useReactionStore } from '../../store';
import { EntityCard } from '../../components/EntityCard';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { ReactionForm } from './ReactionForm';
import type { Reaction } from '../../types';

export function ReactionList() {
  const { items, add, update, remove } = useReactionStore();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Reaction | undefined>();

  const filtered = items.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd(data: Omit<Reaction, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    add({ ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now });
    setModalOpen(false);
  }

  function handleUpdate(data: Omit<Reaction, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!editing) return;
    update(editing.id, { ...data, updatedAt: new Date().toISOString() });
    setEditing(undefined);
    setModalOpen(false);
  }

  function openEdit(reaction: Reaction) {
    setEditing(reaction);
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
          <h1 className="text-2xl font-bold text-amber-400">Reacciones</h1>
          <p className="text-gray-400 text-sm">{items.length} reacción(es) registrada(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-gray-900 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva reacción
        </button>
      </div>
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar reacciones..." />
      </div>
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          {search ? 'No se encontraron reacciones.' : 'No hay reacciones registradas. ¡Crea la primera!'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((reaction) => (
            <EntityCard
              key={reaction.id}
              title={reaction.name}
              onEdit={() => openEdit(reaction)}
              onDelete={() => remove(reaction.id)}
            >
              <div className="flex flex-wrap gap-1 mb-1">
                <Badge label={reaction.path} type="path" />
              </div>
              <p className="text-gray-300">
                Disparador: <span className="text-gray-400 line-clamp-1">{reaction.triggerCondition}</span>
              </p>
              <p className="line-clamp-2 text-gray-500">{reaction.effect}</p>
            </EntityCard>
          ))}
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(undefined); }}
        title={editing ? 'Editar reacción' : 'Nueva reacción'}
      >
        <ReactionForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleAdd}
          onCancel={() => { setModalOpen(false); setEditing(undefined); }}
        />
      </Modal>
    </div>
  );
}
