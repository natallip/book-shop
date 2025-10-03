import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guards';

@Controller('roles')
@UseGuards(JwtAuthGuard, RoleGuard('admin'))
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post('create')
  async createRole(@Body() body: { name: string }) {
    return this.rolesService.createRole(body.name);
  }

  @Get('all')
  async getAllRoles() {
    return this.rolesService.getAllRoles();
  }
}
