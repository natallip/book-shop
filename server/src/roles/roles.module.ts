import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), AuthModule, JwtModule],
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService], // Экспортируем сервис для использования в других модулях
})
export class RolesModule {}
