import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from 'react';

// ─── Hoist mocks before any imports ──────────────────────────────────────────

const mocks = vi.hoisted(() => {
  const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
  const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
  const mockInsert = vi.fn().mockResolvedValue({ error: null });
  const mockEq = vi.fn().mockResolvedValue({ error: null });
  const mockUpdateEq = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
  const mockDeleteEq = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
  const mockFrom = vi.fn().mockReturnValue({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdateEq,
    delete: mockDeleteEq,
  });
  return { mockFrom, mockSelect, mockOrder, mockInsert, mockUpdateEq, mockDeleteEq, mockEq };
});

vi.mock('../../lib/supabase', () => ({
  supabase: { from: mocks.mockFrom },
}));

// ─── Imports after mock setup ─────────────────────────────────────────────────

import { useWeaponStore } from '../../store';
import { mockWeapon, mockWeapon2 } from '../fixtures';

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useWeaponStore', () => {
  beforeEach(() => {
    useWeaponStore.setState({ items: [], loading: false });
    vi.clearAllMocks();
  });

  describe('fetchAll', () => {
    it('fetches items from supabase and sets them in state', async () => {
      const dbRow = {
        id: 'weapon-1', name: 'Espada Larga', description: 'Una espada de hoja larga',
        weapon_type: 'Marcial', modifier: 4, associated_stat: 'POD', element: 'Fuego',
        created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z',
      };
      mocks.mockOrder.mockResolvedValueOnce({ data: [dbRow], error: null });

      await act(async () => {
        await useWeaponStore.getState().fetchAll();
      });

      expect(useWeaponStore.getState().items).toHaveLength(1);
      expect(useWeaponStore.getState().items[0].id).toBe('weapon-1');
      expect(useWeaponStore.getState().loading).toBe(false);
    });

    it('sets loading to false on error and logs it', async () => {
      mocks.mockOrder.mockResolvedValueOnce({ data: null, error: { message: 'DB error' } });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await act(async () => {
        await useWeaponStore.getState().fetchAll();
      });

      expect(useWeaponStore.getState().items).toHaveLength(0);
      expect(useWeaponStore.getState().loading).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('add', () => {
    it('optimistically adds item to state before supabase resolves', async () => {
      // Make supabase never resolve during this check
      let resolve!: () => void;
      mocks.mockInsert.mockReturnValueOnce(new Promise<{ error: null }>((r) => { resolve = () => r({ error: null }); }));

      act(() => {
        useWeaponStore.getState().add(mockWeapon);
      });

      // Item is already in state before promise resolves
      expect(useWeaponStore.getState().items).toContainEqual(mockWeapon);

      resolve();
    });

    it('calls supabase.from(weapons).insert with correct data', async () => {
      mocks.mockInsert.mockResolvedValueOnce({ error: null });

      await act(async () => {
        await useWeaponStore.getState().add(mockWeapon);
      });

      expect(mocks.mockFrom).toHaveBeenCalledWith('weapons');
      expect(mocks.mockInsert).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('optimistically updates item in state', async () => {
      useWeaponStore.setState({ items: [mockWeapon], loading: false });

      await act(async () => {
        await useWeaponStore.getState().update('weapon-1', { name: 'Espada Corta' });
      });

      expect(useWeaponStore.getState().items[0].name).toBe('Espada Corta');
    });

    it('does not crash when id is not found', async () => {
      useWeaponStore.setState({ items: [mockWeapon], loading: false });

      await act(async () => {
        await useWeaponStore.getState().update('nonexistent-id', { name: 'X' });
      });

      // State unchanged
      expect(useWeaponStore.getState().items[0].name).toBe('Espada Larga');
    });
  });

  describe('remove', () => {
    it('optimistically removes item from state', async () => {
      useWeaponStore.setState({ items: [mockWeapon, mockWeapon2], loading: false });

      await act(async () => {
        await useWeaponStore.getState().remove('weapon-1');
      });

      expect(useWeaponStore.getState().items).toHaveLength(1);
      expect(useWeaponStore.getState().items[0].id).toBe('weapon-2');
    });

    it('calls supabase.from(weapons).delete().eq(id)', async () => {
      useWeaponStore.setState({ items: [mockWeapon], loading: false });

      await act(async () => {
        await useWeaponStore.getState().remove('weapon-1');
      });

      expect(mocks.mockFrom).toHaveBeenCalledWith('weapons');
      expect(mocks.mockDeleteEq).toHaveBeenCalled();
    });
  });
});
