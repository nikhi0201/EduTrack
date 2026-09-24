import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/student.service.js';
import { AnalyticsService } from '../services/analytics.service.js';

export class StudentController {
  static async getStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '10', 10);
      const search = (req.query.q as string || req.query.search as string || '').trim();

      const result = await StudentService.getStudents(page, limit, search);
      return res.status(200).json({
        success: true,
        message: 'Students retrieved successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async searchStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req.query.q as string || '').trim();
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '10', 10);

      const result = await StudentService.getStudents(page, limit, query);
      return res.status(200).json({
        success: true,
        message: 'Student search results retrieved successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getStudentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const student = await StudentService.getStudentById(id);
      return res.status(200).json({
        success: true,
        message: 'Student retrieved successfully',
        data: student,
      });
    } catch (err) {
      next(err);
    }
  }

  static async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, age, current_class, marks } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Student name is required' });
      }
      if (!age || isNaN(Number(age)) || Number(age) < 3 || Number(age) > 30) {
        return res.status(400).json({ success: false, message: 'Valid student age (3-30) is required' });
      }
      if (!current_class || !current_class.trim()) {
        return res.status(400).json({ success: false, message: 'Current class is required' });
      }

      const newStudent = await StudentService.createStudent({
        name,
        age: Number(age),
        current_class,
        marks,
      });

      return res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: newStudent,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, age, current_class, marks } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Student name is required' });
      }
      if (!age || isNaN(Number(age)) || Number(age) < 3 || Number(age) > 30) {
        return res.status(400).json({ success: false, message: 'Valid student age (3-30) is required' });
      }
      if (!current_class || !current_class.trim()) {
        return res.status(400).json({ success: false, message: 'Current class is required' });
      }

      const updated = await StudentService.updateStudent(id, {
        name,
        age: Number(age),
        current_class,
        marks,
      });

      return res.status(200).json({
        success: true,
        message: 'Student updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await StudentService.deleteStudent(id);
      return res.status(200).json({
        success: true,
        message: 'Student deleted successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getStudentAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const analytics = await AnalyticsService.getStudentAnalytics(id);
      return res.status(200).json({
        success: true,
        message: 'Student performance analytics retrieved successfully',
        data: analytics,
      });
    } catch (err) {
      next(err);
    }
  }
}
