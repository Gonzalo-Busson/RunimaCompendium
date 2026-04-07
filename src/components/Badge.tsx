import { ELEMENT_COLORS, PATH_COLORS, MONSTER_TYPE_COLORS } from '../lib/constants';

interface BadgeProps {
  label: string;
  type?: 'element' | 'path' | 'monsterType' | 'custom';
  className?: string;
}

export function Badge({ label, type = 'custom', className = '' }: BadgeProps) {
  let colorClass = 'bg-gray-600 text-white';

  if (type === 'element' && ELEMENT_COLORS[label]) {
    colorClass = ELEMENT_COLORS[label];
  } else if (type === 'path' && PATH_COLORS[label]) {
    colorClass = PATH_COLORS[label];
  } else if (type === 'monsterType' && MONSTER_TYPE_COLORS[label]) {
    colorClass = MONSTER_TYPE_COLORS[label];
  }

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${colorClass} ${className}`}
    >
      {label}
    </span>
  );
}
