import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
// import * as argon2 from 'argon2';
import { Role } from '../roles/entities/role.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userRole = await this.roleRepository.findOne({
      where: { name: 'user' },
    });

    //console.log('userRole', userRole);

    // const users = await this.usersRepository.find(); // посмотреть список всех пользователей
    //console.log('users', users);

    if (!userRole) {
      throw new Error('User role not found');
    }

    const newUser = this.usersRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: createUserDto.password,
      roles: [userRole],
    });

    //console.log('newUser', newUser);

    return this.usersRepository.save(newUser);
  }

  // async findOneBy(
  //   key: 'name' | 'email' | 'id',
  //   value: string | number,
  // ): Promise<User | null> {
  //   console.log(key, value);
  //   // const users = await this.usersRepository.find(); // посмотреть список всех пользователей
  //   // console.log('users', users);
  //
  //   return this.usersRepository.findOne({
  //     where: { [key]: value },
  //     relations: ['roles'],
  //   });
  // }

  async findByEmail(email: string): Promise<User | null> {
    // const users = await this.usersRepository.find(); // посмотреть список всех пользователей
    // console.log('users', users);

    return this.usersRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    console.log('user', user);
    return user;
  }

  async updateRoles(userId: number, roles: string[]): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) throw new Error('User not found');

    const roleEntities = await this.roleRepository.find({
      where: { name: In(roles) },
    });

    if (roleEntities.length === 0) throw new Error('Roles not found');

    user.roles = roleEntities;

    return this.usersRepository.save(user);
  }

  // async create(userData: CreateUserDto): Promise<CreateUserDto> {
  //   const hashedPassword = await argon2.hash(userData.password);
  //   userData.password = hashedPassword;
  //   const newUser = this.usersRepository.create(userData);
  //   return this.usersRepository.save(newUser);
  // }
  //
  // async validatePassword(
  //   password: string,
  //   hashedPassword: string,
  // ): Promise<boolean> {
  //   return await argon2.verify(hashedPassword, password);
  // }

  // create(createUserDto: CreateUserDto) {
  //   const user = this.userRepository.create(createUserDto);
  //   return this.userRepository.save(user);
  //   // return this.userRepository.save(createUserDto);
  // }

  findAll() {
    return this.usersRepository.find();
    // return `This action returns all users`;
  }
  // async findOne(username: string) {
  //   return this.usersRepository.findOneBy({ username });
  // }
  //
  // async findByEmail(email: string) {
  //   return this.usersRepository.findOneBy({ email });
  // }
  //
  // async findById(id: number) {
  //   return this.usersRepository.findOneBy({ id });
  // }
  //
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOne({ where: { id } });
    // console.log(updateUserDto);
    // return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // return `This action removes a #${id} user`;
  }

  // async findOne(username: string): Promise<User | undefined> {
  //   return this.usersRepository.findOne({ where: { username } });
  // }
}
