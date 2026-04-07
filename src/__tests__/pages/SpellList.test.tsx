import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpellList } from '../../pages/spells/SpellList';
import { mockSpell } from '../fixtures';

vi.mock('../../store', () => ({
  useSpellStore: vi.fn(),
  useEffectStore: vi.fn(),
}));
import { useSpellStore, useEffectStore } from '../../store';

const mockSpellStore = { items: [] as typeof mockSpell[], add: vi.fn(), update: vi.fn(), remove: vi.fn(), loading: false };
const emptyEffectStore = { items: [] as unknown[], loading: false };

beforeEach(() => {
  vi.clearAllMocks();
  (useSpellStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    (sel?: (s: typeof mockSpellStore) => unknown) => sel ? sel(mockSpellStore) : mockSpellStore
  );
  // SpellForm calls useEffectStore((s) => s.items) — handle selector pattern.
  (useEffectStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    (sel?: (s: typeof emptyEffectStore) => unknown) => sel ? sel(emptyEffectStore) : emptyEffectStore
  );
});

describe('SpellList', () => {
  it('shows empty state', () => {
    mockSpellStore.items = [];
    render(<SpellList />);
    expect(screen.getByText(/No hay hechizos registrados/i)).toBeInTheDocument();
  });

  it('renders spell cards', () => {
    mockSpellStore.items = [mockSpell];
    render(<SpellList />);
    expect(screen.getByText('Hechizo de Llamas')).toBeInTheDocument();
  });

  it('filters by search', () => {
    const other = { ...mockSpell, id: 's-2', name: 'Escudo Arcano' };
    mockSpellStore.items = [mockSpell, other];
    render(<SpellList />);
    fireEvent.change(screen.getByPlaceholderText(/Buscar hechizos/i), { target: { value: 'Llamas' } });
    expect(screen.getByText('Hechizo de Llamas')).toBeInTheDocument();
    expect(screen.queryByText('Escudo Arcano')).not.toBeInTheDocument();
  });

  it('opens create modal', () => {
    mockSpellStore.items = [];
    render(<SpellList />);
    fireEvent.click(screen.getByRole('button', { name: /Nuevo hechizo/i }));
    expect(screen.getByRole('heading', { name: /Nuevo hechizo/i })).toBeInTheDocument();
  });

  it('calls remove on delete', () => {
    mockSpellStore.items = [mockSpell];
    render(<SpellList />);
    fireEvent.click(screen.getByTitle(/Eliminar/i));
    expect(mockSpellStore.remove).toHaveBeenCalledWith('spell-1');
  });
});
