import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, BookOpen } from 'lucide-react';
import { StudentDetail, SubjectName, MonthName } from '../types';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    age: number;
    current_class: string;
    marks: Record<SubjectName, Record<MonthName, number>>;
  }) => Promise<void>;
  initialData?: StudentDetail | null;
  isEditing?: boolean;
}

const SUBJECTS: SubjectName[] = ['Telugu', 'Hindi', 'English', 'Social Studies'];
const MONTHS: MonthName[] = ['January', 'February', 'March', 'April', 'May', 'June'];
const CLASSES = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

export const StudentForm: React.FC<StudentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(14);
  const [currentClass, setCurrentClass] = useState('Grade 10');
  const [marks, setMarks] = useState<Record<SubjectName, Record<MonthName, number>>>(() => {
    const init: any = {};
    SUBJECTS.forEach((sub) => {
      init[sub] = {};
      MONTHS.forEach((m) => {
        init[sub][m] = 75;
      });
    });
    return init;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAge(initialData.age);
      setCurrentClass(initialData.current_class);
      if (initialData.marks) {
        setMarks(initialData.marks);
      }
    } else {
      setName('');
      setAge(14);
      setCurrentClass('Grade 10');
      const resetMarks: any = {};
      SUBJECTS.forEach((sub) => {
        resetMarks[sub] = {};
        MONTHS.forEach((m) => {
          resetMarks[sub][m] = 70;
        });
      });
      setMarks(resetMarks);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleMarkChange = (subject: SubjectName, month: MonthName, val: string) => {
    const num = Math.min(Math.max(Number(val) || 0, 0), 100);
    setMarks((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [month]: num,
      },
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Student Name is required';
    if (!age || age < 3 || age > 30) errs.age = 'Age must be between 3 and 30';
    if (!currentClass.trim()) errs.currentClass = 'Class selection is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        age: Number(age),
        current_class: currentClass,
        marks,
      });
      onClose();
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to save student record' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-2xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Student Record' : 'Add New Student'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEditing
                ? 'Update basic information and monthly performance marks.'
                : 'Enter student details and initial monthly subject scores.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form id="student-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {errors.form && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Basic Student Information Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Basic Profile Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border ${
                    errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                  } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500`}
                />
                {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="3"
                  max="30"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className={`w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border ${
                    errors.age ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                  } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500`}
                />
                {errors.age && <p className="text-[11px] text-red-500 mt-1">{errors.age}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Class <span className="text-red-500">*</span>
              </label>
              <select
                value={currentClass}
                onChange={(e) => setCurrentClass(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Subject Marks Section (4 subjects x 6 months) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-brand-500" />
                Monthly Subject Marks (0 - 100)
              </h3>
              <span className="text-[11px] text-slate-400">January to June</span>
            </div>

            {SUBJECTS.map((subject) => (
              <div
                key={subject}
                className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {subject}
                  </h4>
                  <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-full">
                    Average:{' '}
                    {Math.round(
                      (Object.values(marks[subject] || {}).reduce((a, b) => a + b, 0) / MONTHS.length) * 10
                    ) / 10}
                    %
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {MONTHS.map((month) => (
                    <div key={month}>
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1 text-center">
                        {month.slice(0, 3)}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={marks[subject]?.[month] ?? 0}
                        onChange={(e) => handleMarkChange(subject, month, e.target.value)}
                        className="w-full text-center py-1.5 px-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="student-form"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 disabled:opacity-50 flex items-center gap-1.5 transition"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Student'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
