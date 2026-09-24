import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { config } from '../config/env.js';

export class AuthService {
  /**
   * Single Administrator Authentication
   * Validates credentials against configured backend admin (admin / password123)
   */
  static async login(usernameInput: string, passwordInput: string) {
    const cleanUsername = usernameInput.trim();

    // 1. Verify against database seeded admin hash
    let admin = null;
    try {
      admin = await prisma.admin.findUnique({
        where: { username: cleanUsername },
      });
    } catch (dbErr) {
      console.warn('⚠️ Database query fallback to backend configuration');
    }

    if (admin) {
      const isPasswordValid = await bcrypt.compare(passwordInput, admin.password_hash);
      if (isPasswordValid) {
        const token = jwt.sign(
          { id: admin.id, username: admin.username },
          config.jwtSecret,
          { expiresIn: '24h' }
        );
        return {
          token,
          user: {
            id: admin.id,
            username: admin.username,
          },
        };
      }
    }

    // 2. Direct Backend Environment Credentials Fallback (admin / password123)
    if (
      cleanUsername === config.adminUsername &&
      passwordInput === config.adminPassword
    ) {
      const token = jwt.sign(
        { id: 'admin-configured-id', username: config.adminUsername },
        config.jwtSecret,
        { expiresIn: '24h' }
      );
      return {
        token,
        user: { id: 'admin-configured-id', username: config.adminUsername },
      };
    }

    throw { statusCode: 401, message: 'Invalid administrator credentials. Access denied.' };
  }

  static async getMe(adminId: string) {
    if (adminId === 'admin-configured-id') {
      return { id: 'admin-configured-id', username: config.adminUsername };
    }
    try {
      const admin = await prisma.admin.findUnique({
        where: { id: adminId },
        select: { id: true, username: true, created_at: true },
      });
      if (admin) return admin;
    } catch (e) {
      // fallback
    }
    return { id: 'admin-configured-id', username: config.adminUsername };
  }
}
