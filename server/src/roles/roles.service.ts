// import { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async seedRoles() {
    const roles = ['admin', 'user'];
    for (const role of roles) {
      const existingRole = await this.getRoleByName(role);
      if (!existingRole) {
        await this.createRole(role);
      }
    }
  }

  async onModuleInit() {
    await this.seedRoles();
  }

  // Добавление новой роли
  async createRole(name: string): Promise<Role> {
    const role = this.rolesRepository.create({ name });
    return this.rolesRepository.save(role);
  }

  // Получение роли по названию
  async getRoleByName(name: string): Promise<Role | null> {
    return this.rolesRepository.findOne({ where: { name } });
  }

  // Получение всех ролей
  async getAllRoles(): Promise<Role[]> {
    return this.rolesRepository.find();
  }
}
