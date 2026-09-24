import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { StudentTableItem, StudentDetail, StudentAnalytics, Pagination, SubjectName, MonthName } from '../types';
import { StudentTable } from '../components/StudentTable';
import { StudentForm } from '../components/StudentForm';
import { DeleteDialog } from '../components/DeleteDialog';
import { AnalyticsPanel } from '../components/AnalyticsPanel';
import { Toast, ToastType } from '../components/Toast';
import { Plus, Search, RefreshCw, Sparkles, SlidersHorizontal } from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentTableItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    totalStudents: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Selected Student State for Analytics Panel
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudentDetail, setEditingStudentDetail] = useState<StudentDetail | null>(null);
  const [isDeletingDialogOpen, setIsDeletingDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentTableItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  // 1. Debounce Search Input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 2. Fetch Students List
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getStudents(pagination.currentPage, 10, debouncedSearch);
      setStudents(data.students);
      setPagination(data.pagination);

      // Auto-select first student on initial load if none selected yet
      if (!selectedStudentId && data.students.length > 0) {
        setSelectedStudentId(data.students[0].id);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch students', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.currentPage, debouncedSearch]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // 3. Fetch Selected Student Analytics Panel Data
  const fetchStudentAnalytics = useCallback(async (id: string) => {
    setIsAnalyticsLoading(true);
    try {
      const data = await apiService.getStudentAnalytics(id);
      setAnalytics(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load analytics', 'error');
    } finally {
      setIsAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      fetchStudentAnalytics(selectedStudentId);
    } else {
      setAnalytics(null);
    }
  }, [selectedStudentId, fetchStudentAnalytics]);

  // Handle Student Checkbox Selection (single student)
  const handleSelectStudent = (student: StudentTableItem) => {
    if (selectedStudentId === student.id) {
      setSelectedStudentId(null);
    } else {
      setSelectedStudentId(student.id);
    }
  };

  // Open Form Modal for Create
  const handleOpenAddForm = () => {
    setEditingStudentDetail(null);
    setIsFormOpen(true);
  };

  // Open Form Modal for Edit
  const handleOpenEditForm = async (studentId: string) => {
    try {
      const detail = await apiService.getStudentById(studentId);
      setEditingStudentDetail(detail);
      setIsFormOpen(true);
    } catch (err: any) {
      showToast(err.message || 'Failed to load student details for editing', 'error');
    }
  };

  // Submit Handler for Add / Edit
  const handleFormSubmit = async (payload: {
    name: string;
    age: number;
    current_class: string;
    marks: Record<SubjectName, Record<MonthName, number>>;
  }) => {
    if (editingStudentDetail) {
      await apiService.updateStudent(editingStudentDetail.id, payload);
      showToast(`Student ${payload.name} updated successfully!`, 'success');
      if (selectedStudentId === editingStudentDetail.id) {
        fetchStudentAnalytics(editingStudentDetail.id);
      }
    } else {
      const newSt = await apiService.createStudent(payload);
      showToast(`Student ${payload.name} created successfully!`, 'success');
      setSelectedStudentId(newSt.id);
    }
    fetchStudents();
  };

  // Open Delete Confirmation Dialog
  const handleOpenDeleteDialog = (student: StudentTableItem) => {
    setStudentToDelete(student);
    setIsDeletingDialogOpen(true);
  };

  // Confirm Delete Handler
  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      await apiService.deleteStudent(studentToDelete.id);
      showToast(`Student ${studentToDelete.name} deleted permanently`, 'success');
      setIsDeletingDialogOpen(false);
      if (selectedStudentId === studentToDelete.id) {
        setSelectedStudentId(null);
      }
      setStudentToDelete(null);
      fetchStudents();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete student', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col xl:flex-row overflow-hidden">
      {/* Toast Alert */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Main Student Roster Table Area */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
        {/* Top Bar: Title, Search Bar & Add Student Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Students Roster
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage student records, edit scores, and view performance metrics (Max 10 per page)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student by name (e.g. Rahul)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition shadow-sm"
              />
            </div>

            {/* Add Student Button */}
            <button
              onClick={handleOpenAddForm}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md shadow-brand-500/20 flex items-center gap-1.5 shrink-0 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
          </div>
        </div>

        {/* Student Table */}
        <StudentTable
          students={students}
          pagination={pagination}
          selectedStudentId={selectedStudentId}
          onSelectStudent={handleSelectStudent}
          onEditStudent={handleOpenEditForm}
          onDeleteStudent={handleOpenDeleteDialog}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, currentPage: page }))}
          isLoading={isLoading}
        />
      </div>

      {/* Selected Student Right Analytics Panel */}
      {selectedStudentId && (
        <AnalyticsPanel
          analytics={analytics}
          onClose={() => setSelectedStudentId(null)}
          isLoading={isAnalyticsLoading}
        />
      )}

      {/* Add / Edit Student Form Drawer */}
      <StudentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingStudentDetail}
        isEditing={!!editingStudentDetail}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={isDeletingDialogOpen}
        student={studentToDelete}
        onClose={() => setIsDeletingDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
