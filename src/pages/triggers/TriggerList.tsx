import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTriggerStore } from '../../store';
import { EntityCard } from '../../components/EntityCard';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { TriggerForm } from './TriggerForm';
import type { Trigger } from '../../types';

export function TriggerList() {
  const { items, add, update, remove } = useTriggerStore();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Trigger | undefined>();

  const filtered = items.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd(data: Omit<Trigger, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    add({ ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now });
    setModalOpen(false);
  }

  function handleUpdate(data: Omit<Trigger, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!editing) return;
    update(editing.id, { ...data, updatedAt: new Date().toISOString() });
    setEditing(undefined);
    setModalOpen(false);
  }

  function openEdit(trigger: Trigger) {
    setEditing(trigger);
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
          <h1 className="text-2xl font-bold text-amber-400">Disparadores</h1>
          <p className="text-gray-400 text-sm">{items.length} disparador(es) registrado(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-gray-900 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo disparador
        </button>
      </div>
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar disparadores..." />
      </div>
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          {search ? 'No se encontraron disparadores.' : 'No hay disparadores registrados. ¡Crea el primero!'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((trigger) => (
            <EntityCard
              key={trigger.id}
              title={trigger.name}
              onEdit={() => openEdit(trigger)}
              onDelete={() => remove(trigger.id)}
            >
              <div className="flex flex-wrap gap-1 mb-1">
                <Badge label={trigger.path} type="path" />
              </div>
              <p className="text-gray-300">Identidad: <span className="text-amber-400">{trigger.identity}</span></p>
              <p className="line-clamp-2 text-gray-500">{trigger.mechanicalEffect}</p>
            </EntityCard>
          ))}
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(undefined); }}
        title={editing ? 'Editar disparador' : 'Nuevo disparador'}
      >
        <TriggerForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleAdd}
          onCancel={() => { setModalOpen(false); setEditing(undefined); }}
        />
      </Modal>
    </div>
  );
}
