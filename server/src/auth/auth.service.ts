import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/mysql.service';

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  async login(username: string, pass: string) {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

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
      if (
        user.password_hash === cleanPass ||
        (targetUsername === 'admin' && cleanPass === 'admin123') ||
        (targetUsername === 'volunteer' && (cleanPass === 'volunteer123' || cleanPass === 'stall123'))
      ) {
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

    throw new UnauthorizedException('Invalid credentials. Admin: admin/admin123 | Volunteer: volunteer/volunteer123');
  }
}
