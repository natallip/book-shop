import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
// import { Role } from '../../roles/entities/role.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'user email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'user name', description: 'user name' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'u123', description: 'user password' })
  @IsString()
  @MinLength(6)
  password: string;
  //
  // roles: Role[];
}
