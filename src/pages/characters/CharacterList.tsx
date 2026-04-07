import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCharacterStore } from '../../store';
import { EntityCard } from '../../components/EntityCard';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { CharacterForm } from './CharacterForm';
import type { Character } from '../../types';

export function CharacterList() {
  const { items, add, update, remove } = useCharacterStore();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Character | undefined>();

  const filtered = items.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd(data: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    add({ ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now });
    setModalOpen(false);
  }

  function handleUpdate(data: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!editing) return;
    update(editing.id, { ...data, updatedAt: new Date().toISOString() });
    setEditing(undefined);
    setModalOpen(false);
  }

  function openEdit(character: Character) {
    setEditing(character);
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
          <h1 className="text-2xl font-bold text-amber-400">Personajes</h1>
          <p className="text-gray-400 text-sm">{items.length} personaje(s) registrado(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-gray-900 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo personaje
        </button>
      </div>
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar personajes..." />
      </div>
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          {search ? 'No se encontraron personajes.' : 'No hay personajes registrados. ¡Crea el primero!'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((character) => (
            <EntityCard
              key={character.id}
              title={character.name}
              onEdit={() => openEdit(character)}
              onDelete={() => remove(character.id)}
            >
              <div className="flex flex-wrap gap-1 mb-1">
                <Badge label={character.path} type="path" />
                <Badge label={`Nv. ${character.level}`} />
              </div>
              <div className="grid grid-cols-4 gap-1 text-xs text-center">
                {(['POD', 'DES', 'RES', 'ING'] as const).map((stat) => (
                  <div key={stat} className="bg-gray-700/60 rounded px-1 py-0.5">
                    <div className="text-gray-500">{stat}</div>
                    <div className="text-gray-200 font-semibold">{character[stat]}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 text-xs mt-0.5">
                <span>HP: <span className="text-red-400 font-semibold">{character.HP}</span></span>
                <span>EV: <span className="text-blue-400 font-semibold">{character.EV}</span></span>
                <span>AR: <span className="text-yellow-400 font-semibold">{character.AR}</span></span>
              </div>
              {character.description && (
                <p className="line-clamp-2 text-gray-500">{character.description}</p>
              )}
            </EntityCard>
          ))}
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(undefined); }}
        title={editing ? 'Editar personaje' : 'Nuevo personaje'}
      >
        <CharacterForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleAdd}
          onCancel={() => { setModalOpen(false); setEditing(undefined); }}
        />
      </Modal>
    </div>
  );
}
