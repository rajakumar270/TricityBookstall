import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { AuthService, UserRole } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username?: string; password?: string }) {
    return this.authService.login(body.username || '', body.password || '');
  }

  @Get('users')
  async listUsers() {
    return this.authService.listUsers();
  }

  @Post('users')
  async createUser(
    @Body() body: { username: string; password: string; full_name: string; role: UserRole },
  ) {
    return this.authService.createUser(body);
  }

  @Put('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: { full_name?: string; role?: UserRole; is_active?: boolean; password?: string },
  ) {
    return this.authService.updateUser(Number(id), body);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(Number(id));
  }
}
