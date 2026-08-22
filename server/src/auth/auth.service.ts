import { Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/mysql.service';
import * as crypto from 'crypto';

export type UserRole = 'Superadmin' | 'Admin' | 'Volunteer';

export interface AppUser {
  id: number;
  username: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(private readonly db: DatabaseService) {}

  private hashPassword(pass: string): string {
    return crypto.createHash('sha256').update(pass.trim()).digest('hex');
  }

  async onModuleInit() {
    try {
      await this.db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(100) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          full_name VARCHAR(255) DEFAULT '',
          role ENUM('Superadmin', 'Admin', 'Volunteer') DEFAULT 'Volunteer',
          is_active TINYINT(1) DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Seed default superadmin if no users exist
      const rows = await this.db.query<any[]>('SELECT COUNT(*) as count FROM users');
      if (rows && rows[0] && rows[0].count === 0) {
        const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
        const volunteerPass = process.env.VOLUNTEER_PASSWORD || 'volunteer123';

        await this.db.query(
          `INSERT INTO users (username, password_hash, full_name, role, is_active)
           VALUES (?, ?, ?, 'Superadmin', 1)`,
          ['ekatva', this.hashPassword(adminPass), 'Ekatva Superadmin'],
        );
        await this.db.query(
          `INSERT INTO users (username, password_hash, full_name, role, is_active)
           VALUES (?, ?, ?, 'Admin', 1)`,
          ['prabodhanam', this.hashPassword(adminPass), 'Prabodhanam Admin'],
        );
        await this.db.query(
          `INSERT INTO users (username, password_hash, full_name, role, is_active)
           VALUES (?, ?, ?, 'Volunteer', 1)`,
          ['stall', this.hashPassword(volunteerPass), 'Stall Volunteer'],
        );
        console.log('✅ Auto-seeded default users (ekatva/prabodhanam/stall)');
      }
    } catch (err) {
      console.warn('Users table init/seed warning:', err);
    }
  }

  async login(username: string, pass: string) {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanUser || !cleanPass) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const rows = await this.db.query<any[]>(
      'SELECT * FROM users WHERE LOWER(username) = ? AND is_active = 1',
      [cleanUser],
    );

    if (rows && rows.length > 0) {
      const user = rows[0];
      const hashedInput = this.hashPassword(cleanPass);
      const isPasswordValid =
        user.password_hash === hashedInput ||
        user.password_hash === cleanPass; // legacy plain-text fallback

      if (isPasswordValid) {
        return {
          accessToken: `token_${user.role.toLowerCase()}_${Date.now()}`,
          user: {
            id: user.id,
            username: user.username,
            role: user.role as UserRole,
            name: user.full_name,
          },
        };
      }
    }

    throw new UnauthorizedException('Invalid username or password');
  }

  async listUsers(): Promise<AppUser[]> {
    const rows = await this.db.query<any[]>(
      'SELECT id, username, full_name, role, is_active, created_at FROM users ORDER BY id ASC',
    );
    return rows.map((r) => ({
      id: r.id,
      username: r.username,
      full_name: r.full_name,
      role: r.role,
      is_active: Boolean(r.is_active),
      created_at: r.created_at,
    }));
  }

  async createUser(data: { username: string; password: string; full_name: string; role: UserRole }) {
    const existing = await this.db.query<any[]>(
      'SELECT id FROM users WHERE LOWER(username) = ?',
      [data.username.trim().toLowerCase()],
    );
    if (existing && existing.length > 0) {
      throw new UnauthorizedException('Username already exists');
    }

    await this.db.query(
      `INSERT INTO users (username, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, 1)`,
      [data.username.trim().toLowerCase(), this.hashPassword(data.password), data.full_name || '', data.role || 'Volunteer'],
    );
    return this.listUsers();
  }

  async updateUser(id: number, data: { full_name?: string; role?: UserRole; is_active?: boolean; password?: string }) {
    if (data.password) {
      await this.db.query('UPDATE users SET password_hash = ? WHERE id = ?', [this.hashPassword(data.password), id]);
    }
    if (data.full_name !== undefined) {
      await this.db.query('UPDATE users SET full_name = ? WHERE id = ?', [data.full_name, id]);
    }
    if (data.role !== undefined) {
      await this.db.query('UPDATE users SET role = ? WHERE id = ?', [data.role, id]);
    }
    if (data.is_active !== undefined) {
      await this.db.query('UPDATE users SET is_active = ? WHERE id = ?', [data.is_active ? 1 : 0, id]);
    }
    return this.listUsers();
  }

  async deleteUser(id: number) {
    await this.db.query('DELETE FROM users WHERE id = ?', [id]);
    return this.listUsers();
  }
}
