import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EffectList } from '../../pages/effects/EffectList';
import { mockEffect } from '../fixtures';

vi.mock('../../store', () => ({ useEffectStore: vi.fn() }));
import { useEffectStore } from '../../store';

const mockStore = { items: [] as typeof mockEffect[], add: vi.fn(), update: vi.fn(), remove: vi.fn(), loading: false };

beforeEach(() => {
  vi.clearAllMocks();
  (useEffectStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);
});

describe('EffectList', () => {
  it('shows empty state', () => {
    mockStore.items = [];
    render(<EffectList />);
    expect(screen.getByText(/No hay efectos registrados/i)).toBeInTheDocument();
  });

  it('renders effect cards', () => {
    mockStore.items = [mockEffect];
    render(<EffectList />);
    expect(screen.getByText('Bola de Fuego')).toBeInTheDocument();
  });

  it('filters by search', () => {
    const other = { ...mockEffect, id: 'e-2', name: 'Escudo de Hielo' };
    mockStore.items = [mockEffect, other];
    render(<EffectList />);
    fireEvent.change(screen.getByPlaceholderText(/Buscar efectos/i), { target: { value: 'Bola' } });
    expect(screen.getByText('Bola de Fuego')).toBeInTheDocument();
    expect(screen.queryByText('Escudo de Hielo')).not.toBeInTheDocument();
  });

  it('opens create modal', () => {
    mockStore.items = [];
    render(<EffectList />);
    fireEvent.click(screen.getByRole('button', { name: /Nuevo efecto/i }));
    expect(screen.getByRole('heading', { name: /Nuevo efecto/i })).toBeInTheDocument();
  });

  it('calls remove on delete', () => {
    mockStore.items = [mockEffect];
    render(<EffectList />);
    fireEvent.click(screen.getByTitle(/Eliminar/i));
    expect(mockStore.remove).toHaveBeenCalledWith('effect-1');
  });
});
