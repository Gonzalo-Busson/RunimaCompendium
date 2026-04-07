import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReactionList } from '../../pages/reactions/ReactionList';
import { mockReaction } from '../fixtures';

vi.mock('../../store', () => ({ useReactionStore: vi.fn() }));
import { useReactionStore } from '../../store';

const mockStore = { items: [] as typeof mockReaction[], add: vi.fn(), update: vi.fn(), remove: vi.fn(), loading: false };

beforeEach(() => {
  vi.clearAllMocks();
  (useReactionStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);
});

describe('ReactionList', () => {
  it('shows empty state', () => {
    mockStore.items = [];
    render(<ReactionList />);
    expect(screen.getByText(/No hay reacciones registradas/i)).toBeInTheDocument();
  });

  it('renders reaction cards', () => {
    mockStore.items = [mockReaction];
    render(<ReactionList />);
    expect(screen.getByText('Esquiva')).toBeInTheDocument();
  });

  it('filters by search', () => {
    const other = { ...mockReaction, id: 'r-2', name: 'Contraataque' };
    mockStore.items = [mockReaction, other];
    render(<ReactionList />);
    fireEvent.change(screen.getByPlaceholderText(/Buscar reacciones/i), { target: { value: 'Esquiva' } });
    expect(screen.getByText('Esquiva')).toBeInTheDocument();
    expect(screen.queryByText('Contraataque')).not.toBeInTheDocument();
  });

  it('opens create modal', () => {
    mockStore.items = [];
    render(<ReactionList />);
    fireEvent.click(screen.getByRole('button', { name: /Nueva reacción/i }));
    expect(screen.getByRole('heading', { name: /Nueva reacción/i })).toBeInTheDocument();
  });

  it('calls remove on delete', () => {
    mockStore.items = [mockReaction];
    render(<ReactionList />);
    fireEvent.click(screen.getByTitle(/Eliminar/i));
    expect(mockStore.remove).toHaveBeenCalledWith('reaction-1');
  });
});
