import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccessoryList } from '../../pages/accessories/AccessoryList';
import { mockAccessory } from '../fixtures';

vi.mock('../../store', () => ({ useAccessoryStore: vi.fn() }));
import { useAccessoryStore } from '../../store';

const mockStore = { items: [] as typeof mockAccessory[], add: vi.fn(), update: vi.fn(), remove: vi.fn(), loading: false };

beforeEach(() => {
  vi.clearAllMocks();
  (useAccessoryStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);
});

describe('AccessoryList', () => {
  it('shows empty state', () => {
    mockStore.items = [];
    render(<AccessoryList />);
    expect(screen.getByText(/No hay accesorios registrados/i)).toBeInTheDocument();
  });

  it('renders accessory cards', () => {
    mockStore.items = [mockAccessory];
    render(<AccessoryList />);
    expect(screen.getByText('Anillo de Protección')).toBeInTheDocument();
  });

  it('filters by search', () => {
    const other = { ...mockAccessory, id: 'a-2', name: 'Botas de Velocidad' };
    mockStore.items = [mockAccessory, other];
    render(<AccessoryList />);
    fireEvent.change(screen.getByPlaceholderText(/Buscar accesorios/i), { target: { value: 'Anillo' } });
    expect(screen.getByText('Anillo de Protección')).toBeInTheDocument();
    expect(screen.queryByText('Botas de Velocidad')).not.toBeInTheDocument();
  });

  it('opens create modal', () => {
    mockStore.items = [];
    render(<AccessoryList />);
    fireEvent.click(screen.getByRole('button', { name: /Nuevo accesorio/i }));
    expect(screen.getByRole('heading', { name: /Nuevo accesorio/i })).toBeInTheDocument();
  });

  it('calls remove on delete', () => {
    mockStore.items = [mockAccessory];
    render(<AccessoryList />);
    fireEvent.click(screen.getByTitle(/Eliminar/i));
    expect(mockStore.remove).toHaveBeenCalledWith('accessory-1');
  });
});
