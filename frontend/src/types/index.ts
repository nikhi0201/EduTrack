export interface StudentTableItem {
  id: string;
  name: string;
  age: number;
  current_class: string;
  teluguAvg: number;
  hindiAvg: number;
  englishAvg: number;
  socialAvg: number;
  overallAvg: number;
  created_at: string;
  updated_at: string;
}

export type SubjectName = 'Telugu' | 'Hindi' | 'English' | 'Social Studies';
export type MonthName = 'January' | 'February' | 'March' | 'April' | 'May' | 'June';

export interface StudentDetail {
  id: string;
  name: string;
  age: number;
  current_class: string;
  marks: Record<SubjectName, Record<MonthName, number>>;
  created_at: string;
  updated_at: string;
}

export interface StudentAnalytics {
  student: {
    id: string;
    name: string;
    age: number;
    current_class: string;
  };
  summary: {
    overallAverage: number;
    bestSubject: string;
    bestSubjectAvg: number;
    lowestSubject: string;
    lowestSubjectAvg: number;
    highestMark: number;
    performanceImprovement: number;
  };
  charts: {
    teluguTrend: Array<{ month: string; marks: number }>;
    hindiTrend: Array<{ month: string; marks: number }>;
    englishTrend: Array<{ month: string; marks: number }>;
    socialTrend: Array<{ month: string; marks: number }>;
    subjectComparison: Array<{ subject: string; average: number }>;
  };
  insights: string[];
}

export interface DashboardStats {
  summary: {
    totalStudents: number;
    overallAverage: number;
    topStudent: { name: string; average: number };
    studentsNeedingAttention: number;
  };
  charts: {
    overallTrend: Array<{ month: string; average: number }>;
    subjectComparison: Array<{ subject: string; average: number }>;
    classDistribution: Array<{ className: string; count: number }>;
  };
}

export interface User {
  id: string;
  username: string;
}

export interface Pagination {
  totalStudents: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
