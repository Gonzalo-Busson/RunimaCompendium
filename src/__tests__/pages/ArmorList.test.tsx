import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArmorList } from '../../pages/armors/ArmorList';
import { mockArmor } from '../fixtures';

vi.mock('../../store', () => ({ useArmorStore: vi.fn() }));
import { useArmorStore } from '../../store';

const mockStore = { items: [] as typeof mockArmor[], add: vi.fn(), update: vi.fn(), remove: vi.fn(), loading: false };

beforeEach(() => {
  vi.clearAllMocks();
  (useArmorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);
});

describe('ArmorList', () => {
  it('shows empty state', () => {
    mockStore.items = [];
    render(<ArmorList />);
    expect(screen.getByText(/No hay armaduras registradas/i)).toBeInTheDocument();
  });

  it('renders armor cards', () => {
    mockStore.items = [mockArmor];
    render(<ArmorList />);
    expect(screen.getByText('Armadura de Placas')).toBeInTheDocument();
  });

  it('filters by search', () => {
    const mockArmor2 = { ...mockArmor, id: 'a-2', name: 'Cota de Malla' };
    mockStore.items = [mockArmor, mockArmor2];
    render(<ArmorList />);
    fireEvent.change(screen.getByPlaceholderText(/Buscar armaduras/i), { target: { value: 'Placas' } });
    expect(screen.getByText('Armadura de Placas')).toBeInTheDocument();
    expect(screen.queryByText('Cota de Malla')).not.toBeInTheDocument();
  });

  it('opens create modal', () => {
    mockStore.items = [];
    render(<ArmorList />);
    fireEvent.click(screen.getByRole('button', { name: /Nueva armadura/i }));
    expect(screen.getByRole('heading', { name: /Nueva armadura/i })).toBeInTheDocument();
  });

  it('calls remove on delete', () => {
    mockStore.items = [mockArmor];
    render(<ArmorList />);
    fireEvent.click(screen.getByTitle(/Eliminar/i));
    expect(mockStore.remove).toHaveBeenCalledWith('armor-1');
  });
});
