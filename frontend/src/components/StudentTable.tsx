import React from 'react';
import { StudentTableItem, Pagination } from '../types';
import { Edit2, Trash2, ChevronLeft, ChevronRight, UserCheck, AlertCircle } from 'lucide-react';

interface StudentTableProps {
  students: StudentTableItem[];
  pagination: Pagination;
  selectedStudentId: string | null;
  onSelectStudent: (student: StudentTableItem) => void;
  onEditStudent: (studentId: string) => void;
  onDeleteStudent: (student: StudentTableItem) => void;
  onPageChange: (newPage: number) => void;
  isLoading: boolean;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  pagination,
  selectedStudentId,
  onSelectStudent,
  onEditStudent,
  onDeleteStudent,
  onPageChange,
  isLoading,
}) => {
  const getBadgeClass = (val: number) => {
    if (val >= 80) return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold';
    if (val >= 60) return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold';
    if (val >= 50) return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-semibold';
    return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-bold';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
      {/* Table Scrollable Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-12 text-center">Select</th>
              <th className="py-3.5 px-4">Student Name</th>
              <th className="py-3.5 px-3 text-center">Age</th>
              <th className="py-3.5 px-4">Current Class</th>
              <th className="py-3.5 px-3 text-center">Telugu Avg</th>
              <th className="py-3.5 px-3 text-center">Hindi Avg</th>
              <th className="py-3.5 px-3 text-center">English Avg</th>
              <th className="py-3.5 px-3 text-center">Social Avg</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 10 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-4 text-center"><div className="w-4 h-4 mx-auto bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                  <td className="py-4 px-4"><div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                  <td className="py-4 px-3"><div className="w-8 h-4 mx-auto bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                  <td className="py-4 px-4"><div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                  <td className="py-4 px-3"><div className="w-12 h-6 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full"></div></td>
                  <td className="py-4 px-3"><div className="w-12 h-6 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full"></div></td>
                  <td className="py-4 px-3"><div className="w-12 h-6 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full"></div></td>
                  <td className="py-4 px-3"><div className="w-12 h-6 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full"></div></td>
                  <td className="py-4 px-4 text-right"><div className="w-16 h-4 ml-auto bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                </tr>
              ))
            ) : students.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  <p className="font-semibold text-base text-slate-600 dark:text-slate-300">No student records found</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or add a new student.</p>
                </td>
              </tr>
            ) : (
              students.map((st) => {
                const isSelected = selectedStudentId === st.id;
                return (
                  <tr
                    key={st.id}
                    onClick={() => onSelectStudent(st)}
                    className={`cursor-pointer transition-colors duration-150 ${
                      isSelected
                        ? 'bg-brand-50/80 dark:bg-brand-950/50 border-l-4 border-l-brand-500'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectStudent(st)}
                        className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                      />
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span>{st.name}</span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500 text-white shadow-sm">
                          <UserCheck className="w-3 h-3" /> Selected
                        </span>
                      )}
                    </td>

                    {/* Age */}
                    <td className="py-3.5 px-3 text-center text-slate-600 dark:text-slate-300 font-medium">
                      {st.age}
                    </td>

                    {/* Current Class */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {st.current_class}
                    </td>

                    {/* Telugu Avg */}
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-1 rounded-lg text-xs ${getBadgeClass(st.teluguAvg)}`}>
                        {st.teluguAvg}%
                      </span>
                    </td>

                    {/* Hindi Avg */}
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-1 rounded-lg text-xs ${getBadgeClass(st.hindiAvg)}`}>
                        {st.hindiAvg}%
                      </span>
                    </td>

                    {/* English Avg */}
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-1 rounded-lg text-xs ${getBadgeClass(st.englishAvg)}`}>
                        {st.englishAvg}%
                      </span>
                    </td>

                    {/* Social Avg */}
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-1 rounded-lg text-xs ${getBadgeClass(st.socialAvg)}`}>
                        {st.socialAvg}%
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditStudent(st.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/60 transition"
                          title="Edit Student Information & Marks"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteStudent(st)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 transition"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls Footer */}
      <div className="p-4 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div>
          Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{students.length}</span> of{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200">{pagination.totalStudents}</span> students (Page{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200">{pagination.currentPage}</span> of{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200">{pagination.totalPages}</span>)
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={pagination.currentPage <= 1 || isLoading}
            onClick={() => onPageChange(pagination.currentPage - 1)}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.currentPage) <= 1)
            .map((p, idx, arr) => {
              const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
              return (
                <React.Fragment key={p}>
                  {showEllipsis && <span className="px-1 text-slate-400">...</span>}
                  <button
                    onClick={() => onPageChange(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition ${
                      pagination.currentPage === p
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              );
            })}

          <button
            disabled={pagination.currentPage >= pagination.totalPages || isLoading}
            onClick={() => onPageChange(pagination.currentPage + 1)}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
