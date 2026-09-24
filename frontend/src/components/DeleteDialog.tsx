import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { StudentTableItem } from '../types';

interface DeleteDialogProps {
  isOpen: boolean;
  student: StudentTableItem | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  student,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Delete {student.name}?
          </h3>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            This action cannot be undone. This will permanently delete the student record for{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{student.name}</span> and all associated monthly performance marks from PostgreSQL.
          </p>
        </div>

        <div className="pt-3 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-500/20 disabled:opacity-50 transition"
          >
            {isDeleting ? 'Deleting...' : 'Delete Student'}
          </button>
        </div>
      </div>
    </div>
  );
};
