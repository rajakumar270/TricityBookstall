import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/mysql.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  private hashPassword(pass: string): string {
    return crypto.createHash('sha256').update(pass.trim()).digest('hex');
  }

  async login(username: string, pass: string) {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanUser || !cleanPass) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const volunteerPassword = process.env.VOLUNTEER_PASSWORD || 'volunteer123';

    let targetUsername = cleanUser;
    if (cleanUser === 'ekatva' || cleanUser === 'prabodhanam') {
      targetUsername = 'admin';
    } else if (cleanUser === 'stall') {
      targetUsername = 'volunteer';
    }

    const rows = await this.db.query<any[]>(
      'SELECT * FROM users WHERE (LOWER(username) = ? OR LOWER(username) = ?) AND is_active = 1',
      [cleanUser, targetUsername],
    );

    if (rows && rows.length > 0) {
      const user = rows[0];
      const isPasswordValid =
        user.password_hash === cleanPass ||
        user.password_hash === this.hashPassword(cleanPass) ||
        (user.role === 'Admin' && cleanPass === adminPassword) ||
        (user.role === 'Volunteer' && cleanPass === volunteerPassword);

      if (isPasswordValid) {
        return {
          accessToken: `token_${user.role.toLowerCase()}_${Date.now()}`,
          user: {
            username: user.username,
            role: user.role,
            name: user.full_name,
          },
        };
      }
    }

    throw new UnauthorizedException('Invalid username or password');
  }
}
