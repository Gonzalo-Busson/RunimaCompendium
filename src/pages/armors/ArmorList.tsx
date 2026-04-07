import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useArmorStore } from '../../store';
import { EntityCard } from '../../components/EntityCard';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { ArmorForm } from './ArmorForm';
import type { Armor } from '../../types';

export function ArmorList() {
  const { items, add, update, remove } = useArmorStore();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Armor | undefined>();

  const filtered = items.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd(data: Omit<Armor, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    add({ ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now });
    setModalOpen(false);
  }

  function handleUpdate(data: Omit<Armor, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!editing) return;
    update(editing.id, { ...data, updatedAt: new Date().toISOString() });
    setEditing(undefined);
    setModalOpen(false);
  }

  function openEdit(armor: Armor) {
    setEditing(armor);
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
          <h1 className="text-2xl font-bold text-amber-400">Armaduras</h1>
          <p className="text-gray-400 text-sm">{items.length} armadura(s) registrada(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-gray-900 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva armadura
        </button>
      </div>
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar armaduras..." />
      </div>
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          {search ? 'No se encontraron armaduras.' : 'No hay armaduras registradas. ¡Crea la primera!'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((armor) => (
            <EntityCard
              key={armor.id}
              title={armor.name}
              onEdit={() => openEdit(armor)}
              onDelete={() => remove(armor.id)}
            >
              <div className="flex flex-wrap gap-1 mb-1">
                <Badge label={armor.armorType} />
              </div>
              <p>AR: <span className="text-amber-400 font-semibold">{armor.AR}</span></p>
              {armor.description && (
                <p className="line-clamp-2 text-gray-500">{armor.description}</p>
              )}
            </EntityCard>
          ))}
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(undefined); }}
        title={editing ? 'Editar armadura' : 'Nueva armadura'}
      >
        <ArmorForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleAdd}
          onCancel={() => { setModalOpen(false); setEditing(undefined); }}
        />
      </Modal>
    </div>
  );
}
