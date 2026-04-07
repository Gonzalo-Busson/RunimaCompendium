import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useSpellStore } from '../../store';
import { EntityCard } from '../../components/EntityCard';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { SpellForm } from './SpellForm';
import type { Spell } from '../../types';

export function SpellList() {
  const { items, add, update, remove } = useSpellStore();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Spell | undefined>();

  const filtered = items.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd(data: Omit<Spell, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    add({ ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now });
    setModalOpen(false);
  }

  function handleUpdate(data: Omit<Spell, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!editing) return;
    update(editing.id, { ...data, updatedAt: new Date().toISOString() });
    setEditing(undefined);
    setModalOpen(false);
  }

  function openEdit(spell: Spell) {
    setEditing(spell);
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
          <h1 className="text-2xl font-bold text-amber-400">Hechizos</h1>
          <p className="text-gray-400 text-sm">{items.length} hechizo(s) registrado(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-gray-900 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo hechizo
        </button>
      </div>
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar hechizos..." />
      </div>
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          {search ? 'No se encontraron hechizos.' : 'No hay hechizos registrados. ¡Crea el primero!'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((spell) => (
            <EntityCard
              key={spell.id}
              title={spell.name}
              onEdit={() => openEdit(spell)}
              onDelete={() => remove(spell.id)}
            >
              <div className="flex flex-wrap gap-1 mb-1">
                <Badge label={spell.magnitude} />
                <Badge label={spell.forma} />
                {spell.elements.map((el) => (
                  <Badge key={el} label={el} type="element" />
                ))}
              </div>
              <div className="flex gap-3 text-xs">
                <span>Aprendizaje: <span className="text-amber-400 font-semibold">{spell.totalCost} PC</span></span>
                <span>Ejecución: <span className="text-blue-400 font-semibold">{spell.executionCost} PC</span></span>
              </div>
              {spell.description && (
                <p className="line-clamp-2 text-gray-500">{spell.description}</p>
              )}
            </EntityCard>
          ))}
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(undefined); }}
        title={editing ? 'Editar hechizo' : 'Nuevo hechizo'}
      >
        <SpellForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleAdd}
          onCancel={() => { setModalOpen(false); setEditing(undefined); }}
        />
      </Modal>
    </div>
  );
}
