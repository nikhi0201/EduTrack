import { prisma } from '../config/prisma.js';

export class DashboardService {
  static async getDashboardStats() {
    // 1. Total Students
    const totalStudents = await prisma.student.count();

    if (totalStudents === 0) {
      return {
        summary: {
          totalStudents: 0,
          overallAverage: 0,
          topStudent: { name: 'N/A', average: 0 },
          studentsNeedingAttention: 0,
        },
        charts: {
          overallTrend: [],
          subjectComparison: [],
          classDistribution: [],
        },
      };
    }

    // 2. Aggregate all marks for overall average
    const marksAgg = await prisma.mark.aggregate({
      _avg: { marks: true },
      _count: { marks: true },
    });
    const overallAverage = Math.round((marksAgg._avg.marks || 0) * 10) / 10;

    // 3. Calculate per-student overall averages to identify Top Performer and Needing Attention
    const allStudentsWithMarks = await prisma.student.findMany({
      include: {
        marks: {
          select: { marks: true },
        },
      },
    });

    let topStudent = { name: 'N/A', average: -1 };
    let needingAttentionCount = 0;

    allStudentsWithMarks.forEach((s) => {
      if (s.marks.length > 0) {
        const sum = s.marks.reduce((acc, m) => acc + m.marks, 0);
        const avg = sum / s.marks.length;

        if (avg > topStudent.average) {
          topStudent = { name: s.name, average: Math.round(avg * 10) / 10 };
        }

        if (avg < 50) {
          needingAttentionCount++;
        }
      }
    });

    // 4. Overall Monthly Trend (Jan - Jun) across all students
    const assignments = await prisma.assignment.findMany({
      orderBy: { id: 'asc' },
    });

    const MONTH_ORDER = ['January', 'February', 'March', 'April', 'May', 'June'];
    const overallTrendMap: Record<string, { sum: number; count: number }> = {};
    MONTH_ORDER.forEach((m) => (overallTrendMap[m] = { sum: 0, count: 0 }));

    const allMarksWithAssignments = await prisma.mark.findMany({
      include: { assignment: true },
    });

    allMarksWithAssignments.forEach((m) => {
      const month = m.assignment.month;
      if (overallTrendMap[month]) {
        overallTrendMap[month].sum += m.marks;
        overallTrendMap[month].count += 1;
      }
    });

    const overallTrend = MONTH_ORDER.map((m) => {
      const item = overallTrendMap[m];
      const avg = item.count > 0 ? Math.round((item.sum / item.count) * 10) / 10 : 0;
      return { month: m, average: avg };
    });

    // 5. Subject Average Comparison across all students
    const subjects = await prisma.subject.findMany();
    const subjectMap: Record<string, { sum: number; count: number }> = {};
    subjects.forEach((s) => (subjectMap[s.subject_name] = { sum: 0, count: 0 }));

    const allMarksWithSubjects = await prisma.mark.findMany({
      include: { subject: true },
    });

    allMarksWithSubjects.forEach((m) => {
      const subName = m.subject.subject_name;
      if (subjectMap[subName]) {
        subjectMap[subName].sum += m.marks;
        subjectMap[subName].count += 1;
      }
    });

    const subjectComparison = Object.entries(subjectMap).map(([subject, data]) => ({
      subject,
      average: data.count > 0 ? Math.round((data.sum / data.count) * 10) / 10 : 0,
    }));

    // 6. Class Distribution
    const classGroups = await prisma.student.groupBy({
      by: ['current_class'],
      _count: { id: true },
      orderBy: { current_class: 'asc' },
    });

    const classDistribution = classGroups.map((cg) => ({
      className: cg.current_class,
      count: cg._count.id,
    }));

    return {
      summary: {
        totalStudents,
        overallAverage,
        topStudent: topStudent.average >= 0 ? topStudent : { name: 'N/A', average: 0 },
        studentsNeedingAttention: needingAttentionCount,
      },
      charts: {
        overallTrend,
        subjectComparison,
        classDistribution,
      },
    };
  }
}
