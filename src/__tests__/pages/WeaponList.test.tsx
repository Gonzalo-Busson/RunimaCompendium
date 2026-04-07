import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WeaponList } from '../../pages/weapons/WeaponList';
import { mockWeapon, mockWeapon2 } from '../fixtures';

vi.mock('../../store', () => ({
  useWeaponStore: vi.fn(),
}));

import { useWeaponStore } from '../../store';

const mockStore = {
  items: [] as typeof mockWeapon[],
  add: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  loading: false,
};

beforeEach(() => {
  vi.clearAllMocks();
  (useWeaponStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);
});

describe('WeaponList', () => {
  it('shows empty state when there are no weapons', () => {
    mockStore.items = [];
    render(<WeaponList />);
    expect(screen.getByText(/No hay armas registradas/i)).toBeInTheDocument();
  });

  it('renders weapon cards when items exist', () => {
    mockStore.items = [mockWeapon, mockWeapon2];
    render(<WeaponList />);
    expect(screen.getByText('Espada Larga')).toBeInTheDocument();
    expect(screen.getByText('Daga')).toBeInTheDocument();
  });

  it('shows item count', () => {
    mockStore.items = [mockWeapon, mockWeapon2];
    render(<WeaponList />);
    expect(screen.getByText(/2 arma/i)).toBeInTheDocument();
  });

  it('filters weapons by search term', () => {
    mockStore.items = [mockWeapon, mockWeapon2];
    render(<WeaponList />);
    const input = screen.getByPlaceholderText(/Buscar armas/i);
    fireEvent.change(input, { target: { value: 'Espada' } });
    expect(screen.getByText('Espada Larga')).toBeInTheDocument();
    expect(screen.queryByText('Daga')).not.toBeInTheDocument();
  });

  it('shows no-results message when search has no matches', () => {
    mockStore.items = [mockWeapon];
    render(<WeaponList />);
    const input = screen.getByPlaceholderText(/Buscar armas/i);
    fireEvent.change(input, { target: { value: 'xyz' } });
    expect(screen.getByText(/No se encontraron armas/i)).toBeInTheDocument();
  });

  it('opens modal when clicking Nueva arma', () => {
    mockStore.items = [];
    render(<WeaponList />);
    fireEvent.click(screen.getByRole('button', { name: /Nueva arma/i }));
    expect(screen.getByRole('heading', { name: /Nueva arma/i })).toBeInTheDocument();
  });

  it('calls remove when delete button is clicked', () => {
    mockStore.items = [mockWeapon];
    render(<WeaponList />);
    const deleteBtn = screen.getByTitle(/Eliminar/i);
    fireEvent.click(deleteBtn);
    expect(mockStore.remove).toHaveBeenCalledWith('weapon-1');
  });
});
