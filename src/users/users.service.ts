import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {

    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findAll(page: number, limit:number) {
    const users = await this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
    return users;
  }

  async findOne(id: string){
    
    const user = await this.userRepository.findOne({ 
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    const { password, ...userWithoutPassword } = user; 
    return userWithoutPassword;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    const updated = Object.assign(user, updateUserDto);
    return this.userRepository.save(updated);
  }

  // Controllersiz ishlatish uchun
  async updateRefreshToken(userId: string, hashedRefreshToken: string) {
    const existingUser = await this.findOne(userId);
    if (!existingUser) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }

    Object.assign(existingUser, { refreshToken: hashedRefreshToken });

    return this.userRepository.save(existingUser);
  }


  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    await this.userRepository.remove(user);
  }
}
