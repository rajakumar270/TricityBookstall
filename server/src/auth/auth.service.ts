import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(username: string, pass: string) {
    if ((username === 'admin' || username === 'prabodhanam') && pass === 'admin123') {
      return {
        accessToken: 'token_' + Date.now(),
        user: { username: 'admin', role: 'SuperAdmin', name: 'Prabodhanam Admin' },
      };
    }
    throw new UnauthorizedException('Invalid credentials. Default is admin / admin123');
  }
}
