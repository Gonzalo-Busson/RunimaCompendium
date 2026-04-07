import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TriggerList } from '../../pages/triggers/TriggerList';
import { mockTrigger } from '../fixtures';

vi.mock('../../store', () => ({ useTriggerStore: vi.fn() }));
import { useTriggerStore } from '../../store';

const mockStore = { items: [] as typeof mockTrigger[], add: vi.fn(), update: vi.fn(), remove: vi.fn(), loading: false };

beforeEach(() => {
  vi.clearAllMocks();
  (useTriggerStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);
});

describe('TriggerList', () => {
  it('shows empty state', () => {
    mockStore.items = [];
    render(<TriggerList />);
    expect(screen.getByText(/No hay disparadores registrados/i)).toBeInTheDocument();
  });

  it('renders trigger cards', () => {
    mockStore.items = [mockTrigger];
    render(<TriggerList />);
    expect(screen.getByText('Golpe Preciso')).toBeInTheDocument();
  });

  it('filters by search', () => {
    const other = { ...mockTrigger, id: 't-2', name: 'Defensa Total' };
    mockStore.items = [mockTrigger, other];
    render(<TriggerList />);
    fireEvent.change(screen.getByPlaceholderText(/Buscar disparadores/i), { target: { value: 'Golpe' } });
    expect(screen.getByText('Golpe Preciso')).toBeInTheDocument();
    expect(screen.queryByText('Defensa Total')).not.toBeInTheDocument();
  });

  it('opens create modal', () => {
    mockStore.items = [];
    render(<TriggerList />);
    fireEvent.click(screen.getByRole('button', { name: /Nuevo disparador/i }));
    expect(screen.getByRole('heading', { name: /Nuevo disparador/i })).toBeInTheDocument();
  });

  it('calls remove on delete', () => {
    mockStore.items = [mockTrigger];
    render(<TriggerList />);
    fireEvent.click(screen.getByTitle(/Eliminar/i));
    expect(mockStore.remove).toHaveBeenCalledWith('trigger-1');
  });
});
