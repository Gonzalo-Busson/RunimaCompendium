import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CharacterList } from '../../pages/characters/CharacterList';
import { mockCharacter } from '../fixtures';

vi.mock('../../store', () => ({
  useCharacterStore: vi.fn(),
  useWeaponStore: vi.fn(),
  useArmorStore: vi.fn(),
  useAccessoryStore: vi.fn(),
  useSpellStore: vi.fn(),
  useTriggerStore: vi.fn(),
  useReactionStore: vi.fn(),
}));

import {
  useCharacterStore, useWeaponStore, useArmorStore,
  useAccessoryStore, useSpellStore, useTriggerStore, useReactionStore,
} from '../../store';

// Some forms call useXxxStore((s) => s.items) with a selector.
// This helper returns a mock that handles both: store() and store(selector).
function selectable<T extends Record<string, unknown>>(state: T) {
  return vi.fn().mockImplementation((sel?: (s: T) => unknown) =>
    sel ? sel(state) : state
  );
}

const mockCharStore = { items: [] as typeof mockCharacter[], add: vi.fn(), update: vi.fn(), remove: vi.fn(), loading: false };
const emptyStore = { items: [] as unknown[], loading: false };

beforeEach(() => {
  vi.clearAllMocks();
  (useCharacterStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    (sel?: (s: typeof mockCharStore) => unknown) => sel ? sel(mockCharStore) : mockCharStore
  );
  (useWeaponStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(selectable(emptyStore));
  (useArmorStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(selectable(emptyStore));
  (useAccessoryStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(selectable(emptyStore));
  (useSpellStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(selectable(emptyStore));
  (useTriggerStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(selectable(emptyStore));
  (useReactionStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(selectable(emptyStore));
});

describe('CharacterList', () => {
  it('shows empty state', () => {
    mockCharStore.items = [];
    render(<CharacterList />);
    expect(screen.getByText(/No hay personajes registrados/i)).toBeInTheDocument();
  });

  it('renders character cards', () => {
    mockCharStore.items = [mockCharacter];
    render(<CharacterList />);
    expect(screen.getByText('Aragorn')).toBeInTheDocument();
  });

  it('shows character stats', () => {
    mockCharStore.items = [mockCharacter];
    render(<CharacterList />);
    expect(screen.getAllByText('d8').length).toBeGreaterThan(0);
    expect(screen.getByText(/HP/)).toBeInTheDocument();
  });

  it('filters by name', () => {
    const other = { ...mockCharacter, id: 'c-2', name: 'Legolas' };
    mockCharStore.items = [mockCharacter, other];
    render(<CharacterList />);
    fireEvent.change(screen.getByPlaceholderText(/Buscar personajes/i), { target: { value: 'Aragorn' } });
    expect(screen.getByText('Aragorn')).toBeInTheDocument();
    expect(screen.queryByText('Legolas')).not.toBeInTheDocument();
  });

  it('opens create modal', () => {
    mockCharStore.items = [];
    render(<CharacterList />);
    fireEvent.click(screen.getByRole('button', { name: /Nuevo personaje/i }));
    expect(screen.getByRole('heading', { name: /Nuevo personaje/i })).toBeInTheDocument();
  });

  it('calls remove on delete', () => {
    mockCharStore.items = [mockCharacter];
    render(<CharacterList />);
    fireEvent.click(screen.getByTitle(/Eliminar/i));
    expect(mockCharStore.remove).toHaveBeenCalledWith('character-1');
  });
});
