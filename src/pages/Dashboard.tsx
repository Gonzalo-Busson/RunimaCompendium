import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Skull, Sword, Shield, Gem, Wand2, Zap, RotateCcw, Sparkles } from 'lucide-react';
import { useCharacterStore } from '../store';
import { useMonsterStore } from '../store';
import { useWeaponStore } from '../store';
import { useArmorStore } from '../store';
import { useAccessoryStore } from '../store';
import { useSpellStore } from '../store';
import { useTriggerStore } from '../store';
import { useReactionStore } from '../store';
import { useEffectStore } from '../store';

interface StatCardProps {
  to: string;
  label: string;
  count: number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ to, label, count, icon: Icon, color }: StatCardProps) {
  return (
    <Link
      to={to}
      className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 flex items-center gap-4 hover:border-amber-500/50 transition-colors group"
    >
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-100 group-hover:text-amber-400 transition-colors">
          {count}
        </p>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    </Link>
  );
}

export function Dashboard() {
  const characters = useCharacterStore((s) => s.items);
  const monsters = useMonsterStore((s) => s.items);
  const weapons = useWeaponStore((s) => s.items);
  const armors = useArmorStore((s) => s.items);
  const accessories = useAccessoryStore((s) => s.items);
  const spells = useSpellStore((s) => s.items);
  const triggers = useTriggerStore((s) => s.items);
  const reactions = useReactionStore((s) => s.items);
  const effects = useEffectStore((s) => s.items);

  const STATS = [
    { to: '/personajes', label: 'Personajes', count: characters.length, icon: Users, color: 'bg-indigo-600' },
    { to: '/monstruos', label: 'Monstruos', count: monsters.length, icon: Skull, color: 'bg-red-700' },
    { to: '/armas', label: 'Armas', count: weapons.length, icon: Sword, color: 'bg-orange-600' },
    { to: '/armaduras', label: 'Armaduras', count: armors.length, icon: Shield, color: 'bg-slate-600' },
    { to: '/accesorios', label: 'Accesorios', count: accessories.length, icon: Gem, color: 'bg-teal-600' },
    { to: '/hechizos', label: 'Hechizos', count: spells.length, icon: Wand2, color: 'bg-violet-600' },
    { to: '/disparadores', label: 'Disparadores', count: triggers.length, icon: Zap, color: 'bg-yellow-600' },
    { to: '/reacciones', label: 'Reacciones', count: reactions.length, icon: RotateCcw, color: 'bg-green-700' },
    { to: '/efectos', label: 'Efectos', count: effects.length, icon: Sparkles, color: 'bg-pink-700' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-400">Runima Compendium</h1>
        <p className="text-gray-400 mt-1">
          Panel de control — gestiona todos los elementos del mundo de Runima
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS.map((s) => (
          <StatCard key={s.to} {...s} />
        ))}
      </div>
    </div>
  );
}
