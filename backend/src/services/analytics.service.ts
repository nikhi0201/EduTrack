import { prisma } from '../config/prisma.js';

export class AnalyticsService {
  static async getStudentAnalytics(studentId: string) {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        marks: {
          include: {
            subject: true,
            assignment: true,
          },
        },
      },
    });

    if (!student) {
      throw { statusCode: 404, message: 'Student not found' };
    }

    const MONTH_ORDER = ['January', 'February', 'March', 'April', 'May', 'June'];
    const SUBJECT_LIST = ['Telugu', 'Hindi', 'English', 'Social Studies'];

    // 1. Organize marks by subject and month
    const subjectMonthMarks: Record<string, Record<string, number>> = {
      Telugu: {},
      Hindi: {},
      English: {},
      'Social Studies': {},
    };

    let globalHighestMark = 0;

    student.marks.forEach((m) => {
      const sub = m.subject.subject_name;
      const month = m.assignment.month;
      subjectMonthMarks[sub][month] = m.marks;
      if (m.marks > globalHighestMark) {
        globalHighestMark = m.marks;
      }
    });

    // 2. Build 4 Line Charts Data (Month -> Mark for each subject)
    const subjectTrends: Record<string, Array<{ month: string; marks: number }>> = {
      Telugu: [],
      Hindi: [],
      English: [],
      'Social Studies': [],
    };

    MONTH_ORDER.forEach((month) => {
      SUBJECT_LIST.forEach((sub) => {
        subjectTrends[sub].push({
          month,
          marks: subjectMonthMarks[sub][month] ?? 0,
        });
      });
    });

    // 3. Calculate Subject Averages & Find Best/Lowest
    const subjectAverages: Record<string, number> = {};
    let totalMarksSum = 0;
    let totalMarksCount = 0;

    SUBJECT_LIST.forEach((sub) => {
      const marksArr = Object.values(subjectMonthMarks[sub]);
      if (marksArr.length > 0) {
        const sum = marksArr.reduce((a, b) => a + b, 0);
        const avg = Math.round((sum / marksArr.length) * 10) / 10;
        subjectAverages[sub] = avg;
        totalMarksSum += sum;
        totalMarksCount += marksArr.length;
      } else {
        subjectAverages[sub] = 0;
      }
    });

    const overallAverage = totalMarksCount > 0 ? Math.round((totalMarksSum / totalMarksCount) * 10) / 10 : 0;

    let bestSubject = { name: 'N/A', avg: -1 };
    let lowestSubject = { name: 'N/A', avg: 101 };

    Object.entries(subjectAverages).forEach(([sub, avg]) => {
      if (avg > bestSubject.avg) {
        bestSubject = { name: sub, avg };
      }
      if (avg < lowestSubject.avg) {
        lowestSubject = { name: sub, avg };
      }
    });

    // 4. Performance Improvement calculation (Jan vs June)
    let janOverallSum = 0;
    let janCount = 0;
    let junOverallSum = 0;
    let junCount = 0;

    SUBJECT_LIST.forEach((sub) => {
      if (subjectMonthMarks[sub]['January'] !== undefined) {
        janOverallSum += subjectMonthMarks[sub]['January'];
        janCount++;
      }
      if (subjectMonthMarks[sub]['June'] !== undefined) {
        junOverallSum += subjectMonthMarks[sub]['June'];
        junCount++;
      }
    });

    const janAvg = janCount > 0 ? janOverallSum / janCount : 0;
    const junAvg = junCount > 0 ? junOverallSum / junCount : 0;
    const performanceImprovement = Math.round((junAvg - janAvg) * 10) / 10;

    // 5. Subject Average Comparison Bar Chart data
    const subjectComparison = SUBJECT_LIST.map((sub) => ({
      subject: sub,
      average: subjectAverages[sub] || 0,
    }));

    // 6. Generate dynamic data-driven insights
    const insights: string[] = [];

    if (bestSubject.name !== 'N/A') {
      insights.push(`${bestSubject.name} is the student's strongest subject with an average of ${bestSubject.avg}%.`);
    }

    if (performanceImprovement > 0) {
      insights.push(`Overall performance improved by +${performanceImprovement}% between January and June.`);
    } else if (performanceImprovement < 0) {
      insights.push(`Overall performance experienced a slight decline of ${performanceImprovement}% between January and June.`);
    } else {
      insights.push(`Student maintained consistent overall marks between January and June.`);
    }

    if (lowestSubject.name !== 'N/A' && lowestSubject.name !== bestSubject.name) {
      insights.push(`${lowestSubject.name} has the lowest average (${lowestSubject.avg}%) and may benefit from targeted support.`);
    }

    return {
      student: {
        id: student.id,
        name: student.name,
        age: student.age,
        current_class: student.current_class,
      },
      summary: {
        overallAverage,
        bestSubject: bestSubject.name,
        bestSubjectAvg: bestSubject.avg,
        lowestSubject: lowestSubject.name,
        lowestSubjectAvg: lowestSubject.avg,
        highestMark: globalHighestMark,
        performanceImprovement,
      },
      charts: {
        teluguTrend: subjectTrends['Telugu'],
        hindiTrend: subjectTrends['Hindi'],
        englishTrend: subjectTrends['English'],
        socialTrend: subjectTrends['Social Studies'],
        subjectComparison,
      },
      insights,
    };
  }
}
