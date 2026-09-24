import { prisma } from '../config/prisma.js';

export interface CreateStudentDTO {
  name: string;
  age: number;
  current_class: string;
  marks?: Record<string, Record<string, number>>; // subject -> month -> mark
}

export class StudentService {
  /**
   * Fetch paginated student list with dynamic average marks for Telugu, Hindi, English, Social Studies.
   * Supports server-side search with typo tolerance and token matching.
   */
  static async getStudents(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    const cleanSearch = search.trim();

    let whereClause: any = {};

    if (cleanSearch) {
      // Split search query into tokens to support partial & typo tolerant searching
      const tokens = cleanSearch.split(/\s+/).filter(Boolean);
      whereClause = {
        OR: [
          { name: { contains: cleanSearch } },
          ...tokens.map((token) => ({ name: { contains: token } })),
        ],
      };
    }

    const totalStudents = await prisma.student.count({ where: whereClause });

    const students = await prisma.student.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        marks: {
          include: {
            subject: true,
            assignment: true,
          },
        },
      },
    });

    // Calculate subject-wise averages for each student
    const formattedStudents = students.map((s) => {
      const subjectTotals: Record<string, { sum: number; count: number }> = {
        Telugu: { sum: 0, count: 0 },
        Hindi: { sum: 0, count: 0 },
        English: { sum: 0, count: 0 },
        'Social Studies': { sum: 0, count: 0 },
      };

      s.marks.forEach((m) => {
        const subName = m.subject.subject_name;
        if (subjectTotals[subName]) {
          subjectTotals[subName].sum += m.marks;
          subjectTotals[subName].count += 1;
        }
      });

      const teluguAvg = subjectTotals['Telugu'].count > 0
        ? Math.round((subjectTotals['Telugu'].sum / subjectTotals['Telugu'].count) * 10) / 10
        : 0;

      const hindiAvg = subjectTotals['Hindi'].count > 0
        ? Math.round((subjectTotals['Hindi'].sum / subjectTotals['Hindi'].count) * 10) / 10
        : 0;

      const englishAvg = subjectTotals['English'].count > 0
        ? Math.round((subjectTotals['English'].sum / subjectTotals['English'].count) * 10) / 10
        : 0;

      const socialAvg = subjectTotals['Social Studies'].count > 0
        ? Math.round((subjectTotals['Social Studies'].sum / subjectTotals['Social Studies'].count) * 10) / 10
        : 0;

      const totalSum = subjectTotals['Telugu'].sum + subjectTotals['Hindi'].sum + subjectTotals['English'].sum + subjectTotals['Social Studies'].sum;
      const totalCount = subjectTotals['Telugu'].count + subjectTotals['Hindi'].count + subjectTotals['English'].count + subjectTotals['Social Studies'].count;
      const overallAvg = totalCount > 0 ? Math.round((totalSum / totalCount) * 10) / 10 : 0;

      return {
        id: s.id,
        name: s.name,
        age: s.age,
        current_class: s.current_class,
        teluguAvg,
        hindiAvg,
        englishAvg,
        socialAvg,
        overallAvg,
        created_at: s.created_at,
        updated_at: s.updated_at,
      };
    });

    const totalPages = Math.ceil(totalStudents / limit);

    return {
      students: formattedStudents,
      pagination: {
        totalStudents,
        currentPage: page,
        totalPages: totalPages || 1,
        limit,
      },
    };
  }

  static async getStudentById(id: string) {
    const student = await prisma.student.findUnique({
      where: { id },
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

    const marksStructured: Record<string, Record<string, number>> = {
      Telugu: {},
      Hindi: {},
      English: {},
      'Social Studies': {},
    };

    student.marks.forEach((m) => {
      const subName = m.subject.subject_name;
      const monthName = m.assignment.month;
      if (!marksStructured[subName]) marksStructured[subName] = {};
      marksStructured[subName][monthName] = m.marks;
    });

    return {
      id: student.id,
      name: student.name,
      age: student.age,
      current_class: student.current_class,
      marks: marksStructured,
      created_at: student.created_at,
      updated_at: student.updated_at,
    };
  }

  static async createStudent(data: CreateStudentDTO) {
    const { name, age, current_class, marks } = data;

    const student = await prisma.student.create({
      data: {
        name: name.trim(),
        age: Number(age),
        current_class: current_class.trim(),
      },
    });

    if (marks) {
      const subjects = await prisma.subject.findMany();
      const assignments = await prisma.assignment.findMany();

      const subMap = new Map(subjects.map((s) => [s.subject_name, s.id]));
      const monthMap = new Map(assignments.map((a) => [a.month, a.id]));

      const markEntries: Array<{
        student_id: string;
        subject_id: string;
        assignment_id: string;
        marks: number;
      }> = [];

      for (const [subName, monthObj] of Object.entries(marks)) {
        const subId = subMap.get(subName);
        if (!subId) continue;

        for (const [monthName, val] of Object.entries(monthObj)) {
          const asgnId = monthMap.get(monthName);
          if (!asgnId) continue;

          markEntries.push({
            student_id: student.id,
            subject_id: subId,
            assignment_id: asgnId,
            marks: Math.min(Math.max(Number(val) || 0, 0), 100),
          });
        }
      }

      if (markEntries.length > 0) {
        await prisma.mark.createMany({
          data: markEntries,
        });
      }
    }

    return this.getStudentById(student.id);
  }

  static async updateStudent(id: string, data: CreateStudentDTO) {
    const existing = await prisma.student.findUnique({ where: { id } });
    if (!existing) {
      throw { statusCode: 404, message: 'Student not found' };
    }

    await prisma.student.update({
      where: { id },
      data: {
        name: data.name.trim(),
        age: Number(data.age),
        current_class: data.current_class.trim(),
      },
    });

    if (data.marks) {
      const subjects = await prisma.subject.findMany();
      const assignments = await prisma.assignment.findMany();

      const subMap = new Map(subjects.map((s) => [s.subject_name, s.id]));
      const monthMap = new Map(assignments.map((a) => [a.month, a.id]));

      for (const [subName, monthObj] of Object.entries(data.marks)) {
        const subId = subMap.get(subName);
        if (!subId) continue;

        for (const [monthName, val] of Object.entries(monthObj)) {
          const asgnId = monthMap.get(monthName);
          if (!asgnId) continue;

          const numVal = Math.min(Math.max(Number(val) || 0, 0), 100);

          await prisma.mark.upsert({
            where: {
              student_id_subject_id_assignment_id: {
                student_id: id,
                subject_id: subId,
                assignment_id: asgnId,
              },
            },
            update: { marks: numVal },
            create: {
              student_id: id,
              subject_id: subId,
              assignment_id: asgnId,
              marks: numVal,
            },
          });
        }
      }
    }

    return this.getStudentById(id);
  }

  static async deleteStudent(id: string) {
    const existing = await prisma.student.findUnique({ where: { id } });
    if (!existing) {
      throw { statusCode: 404, message: 'Student not found' };
    }

    await prisma.student.delete({
      where: { id },
    });

    return { id, message: 'Student and associated performance records deleted successfully' };
  }
}
