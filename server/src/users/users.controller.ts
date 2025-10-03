import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedRequest, JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guards';
// import {AuthGuard} from "../auth/auth.guard";

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 200, description: 'Successfully created' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Successfully created',
  })
  @UseGuards(JwtAuthGuard, RoleGuard('admin'))
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@Req() req: AuthenticatedRequest) {
    return this.usersService.findById(req?.user?.userId ?? 0);
  }

  @UseGuards(JwtAuthGuard, RoleGuard('admin'))
  @Patch()
  update(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(req?.user?.userId ?? 0, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard('admin'))
  @Delete()
  remove(@Req() req: AuthenticatedRequest) {
    return this.usersService.remove(req?.user?.userId ?? 0);
  }

  // @UseGuards(JwtAuthGuard) // Защита маршрута токеном
  // @Get(':id')
  // async getUserById(@Param('id') id: number) {
  //   const user = await this.usersService.findById(id);
  //   return user || { message: 'User not found' };
  // }

  @UseGuards(JwtAuthGuard, RoleGuard('admin')) // Только для админов
  @Patch('role')
  async updateUserRole(
    @Req() req: AuthenticatedRequest,
    @Body() body: { role: string },
  ) {
    const updatedUser = await this.usersService.updateRoles(
      req?.user?.userId ?? 0,
      [body.role],
    );
    return { message: 'User role updated successfully', user: updatedUser };
  }
}
