import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Skull,
  Sword,
  Shield,
  Gem,
  Wand2,
  Zap,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/personajes', label: 'Personajes', icon: Users },
  { to: '/monstruos', label: 'Monstruos', icon: Skull },
  { to: '/armas', label: 'Armas', icon: Sword },
  { to: '/armaduras', label: 'Armaduras', icon: Shield },
  { to: '/accesorios', label: 'Accesorios', icon: Gem },
  { to: '/hechizos', label: 'Hechizos', icon: Wand2 },
  { to: '/disparadores', label: 'Disparadores', icon: Zap },
  { to: '/reacciones', label: 'Reacciones', icon: RotateCcw },
  { to: '/efectos', label: 'Efectos', icon: Sparkles },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <aside
      className={`w-56 bg-gray-800 border-r border-gray-700 flex flex-col fixed left-0 top-0 bottom-0 z-20 transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      <div className="px-4 py-5 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h1 className="text-amber-400 font-bold text-lg leading-tight">Runima</h1>
          <p className="text-gray-400 text-xs">Compendium</p>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
          aria-label="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-amber-500/20 text-amber-400 font-medium border-r-2 border-amber-500'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-gray-700/50'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
