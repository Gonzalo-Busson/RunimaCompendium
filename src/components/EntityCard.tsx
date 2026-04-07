import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface EntityCardProps {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}

export function EntityCard({ title, onEdit, onDelete, children }: EntityCardProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-col gap-2 hover:border-amber-500/40 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-100 truncate">{title}</h3>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 rounded transition-colors"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-400 flex flex-col gap-1">{children}</div>
    </div>
  );
}
