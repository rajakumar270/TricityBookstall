import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(username: string, pass: string) {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    if ((cleanUser === 'admin' || cleanUser === 'prabodhanam') && cleanPass === 'admin123') {
      return {
        accessToken: 'token_admin_' + Date.now(),
        user: { username: 'admin', role: 'Admin', name: 'Prabodhanam Admin' },
      };
    }

    if ((cleanUser === 'volunteer' || cleanUser === 'stall') && (cleanPass === 'volunteer123' || cleanPass === 'stall123')) {
      return {
        accessToken: 'token_volunteer_' + Date.now(),
        user: { username: 'volunteer', role: 'Volunteer', name: 'Stall Team Volunteer' },
      };
    }

    throw new UnauthorizedException('Invalid credentials. Admin: admin/admin123 | Volunteer: volunteer/volunteer123');
  }
}

