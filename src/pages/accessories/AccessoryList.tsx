import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAccessoryStore } from '../../store';
import { EntityCard } from '../../components/EntityCard';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { AccessoryForm } from './AccessoryForm';
import type { Accessory } from '../../types';

export function AccessoryList() {
  const { items, add, update, remove } = useAccessoryStore();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Accessory | undefined>();

  const filtered = items.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd(data: Omit<Accessory, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    add({ ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now });
    setModalOpen(false);
  }

  function handleUpdate(data: Omit<Accessory, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!editing) return;
    update(editing.id, { ...data, updatedAt: new Date().toISOString() });
    setEditing(undefined);
    setModalOpen(false);
  }

  function openEdit(accessory: Accessory) {
    setEditing(accessory);
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
          <h1 className="text-2xl font-bold text-amber-400">Accesorios</h1>
          <p className="text-gray-400 text-sm">{items.length} accesorio(s) registrado(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-gray-900 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo accesorio
        </button>
      </div>
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar accesorios..." />
      </div>
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          {search ? 'No se encontraron accesorios.' : 'No hay accesorios registrados. ¡Crea el primero!'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((acc) => (
            <EntityCard
              key={acc.id}
              title={acc.name}
              onEdit={() => openEdit(acc)}
              onDelete={() => remove(acc.id)}
            >
              <div className="flex flex-wrap gap-1 mb-1">
                <Badge label={acc.usage} />
              </div>
              <p>Bonificación: <span className="text-amber-400">{acc.bonus}</span></p>
              {acc.description && (
                <p className="line-clamp-2 text-gray-500">{acc.description}</p>
              )}
            </EntityCard>
          ))}
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(undefined); }}
        title={editing ? 'Editar accesorio' : 'Nuevo accesorio'}
      >
        <AccessoryForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleAdd}
          onCancel={() => { setModalOpen(false); setEditing(undefined); }}
        />
      </Modal>
    </div>
  );
}
