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

  async create(createUserDto: Partial<User>): Promise<User> {
    const { username } = createUserDto;

    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException(`Username "${username}" is already taken.`);
    }

    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findOne(id: string): Promise<User> {
    
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    return user;
  }

  async findByUsername(username: string): Promise<User|null> {

    return await this.userRepository.findOne({ where: { username } });
  }


  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    const updated = Object.assign(user, updateUserDto);
    return this.userRepository.save(updated);
  }

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
