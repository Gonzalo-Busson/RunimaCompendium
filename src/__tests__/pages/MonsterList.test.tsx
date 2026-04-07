import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MonsterList } from '../../pages/monsters/MonsterList';
import { mockMonster, mockMonsterNormal } from '../fixtures';

vi.mock('../../store', () => ({
  useMonsterStore: vi.fn(),
  useWeaponStore: vi.fn(),
  useArmorStore: vi.fn(),
  useAccessoryStore: vi.fn(),
  useSpellStore: vi.fn(),
  useTriggerStore: vi.fn(),
  useReactionStore: vi.fn(),
}));

import {
  useMonsterStore, useWeaponStore, useArmorStore,
  useAccessoryStore, useSpellStore, useTriggerStore, useReactionStore,
} from '../../store';

const mockMonsterStore = { items: [] as (typeof mockMonster)[], add: vi.fn(), update: vi.fn(), remove: vi.fn(), loading: false };
const emptyStore = { items: [] as unknown[], loading: false };

// MonsterForm uses useWeaponStore((s) => s.items) selector — mock must handle both patterns.
function selectable<T extends Record<string, unknown>>(state: T) {
  return vi.fn().mockImplementation((sel?: (s: T) => unknown) =>
    sel ? sel(state) : state
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  (useMonsterStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    (sel?: (s: typeof mockMonsterStore) => unknown) => sel ? sel(mockMonsterStore) : mockMonsterStore
  );
  (useWeaponStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(selectable(emptyStore));
  (useArmorStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(selectable(emptyStore));
  (useAccessoryStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(selectable(emptyStore));
  (useSpellStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(selectable(emptyStore));
  (useTriggerStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(selectable(emptyStore));
  (useReactionStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(selectable(emptyStore));
});

describe('MonsterList', () => {
  it('shows empty state', () => {
    mockMonsterStore.items = [];
    render(<MonsterList />);
    expect(screen.getByText(/No hay monstruos registrados/i)).toBeInTheDocument();
  });

  it('renders monster cards', () => {
    mockMonsterStore.items = [mockMonster];
    render(<MonsterList />);
    expect(screen.getByText('Dragón Rojo')).toBeInTheDocument();
  });

  it('renders EV as "infinito" for boss monsters', () => {
    mockMonsterStore.items = [mockMonster];
    render(<MonsterList />);
    expect(screen.getByText('∞')).toBeInTheDocument();
  });

  it('filters by name', () => {
    mockMonsterStore.items = [mockMonster, mockMonsterNormal];
    render(<MonsterList />);
    fireEvent.change(screen.getByPlaceholderText(/Buscar monstruos/i), { target: { value: 'Dragón' } });
    expect(screen.getByText('Dragón Rojo')).toBeInTheDocument();
    expect(screen.queryByText('Goblin')).not.toBeInTheDocument();
  });

  it('opens create modal', () => {
    mockMonsterStore.items = [];
    render(<MonsterList />);
    fireEvent.click(screen.getByRole('button', { name: /Nuevo monstruo/i }));
    expect(screen.getByRole('heading', { name: /Nuevo monstruo/i })).toBeInTheDocument();
  });

  it('calls remove on delete', () => {
    mockMonsterStore.items = [mockMonster];
    render(<MonsterList />);
    fireEvent.click(screen.getByTitle(/Eliminar/i));
    expect(mockMonsterStore.remove).toHaveBeenCalledWith('monster-1');
  });
});
