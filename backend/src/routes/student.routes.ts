import { Router } from 'express';
import { StudentController } from '../controllers/student.controller.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

// Protect all student routes with JWT middleware
router.use(authenticateJWT);

router.get('/search', StudentController.searchStudents);
router.get('/', StudentController.getStudents);
router.get('/:id', StudentController.getStudentById);
router.post('/', StudentController.createStudent);
router.put('/:id', StudentController.updateStudent);
router.delete('/:id', StudentController.deleteStudent);
router.get('/:id/analytics', StudentController.getStudentAnalytics);

export default router;
