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
    if (createUserDto.role === 'superadmin' && createUserDto.vchdId) {
      throw new ConflictException('Superadmin not allowed to have a VCHD ID.');
    }
    const { username, vchdId } = createUserDto;
    if(!username){
      throw new ConflictException('Username is required.');
    }

    // Agar username bazada mavjud bo'lsa, xatolik qaytarish
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException(`Username "${username}" is already taken.`);
    }

    // Agar userda vchdId berilgan bo'lsa, bu id boshqa userga berilganligini tekshirish
    // Agar vchdId berilmagan bo'lsa, uni tekshirish shart emas
    if (vchdId!== null && vchdId !== undefined) {
      const existingVchdUser = await this.userRepository.findOne({ where: { vchdId } });
      if (existingVchdUser) {
        throw new ConflictException(`VCHD ID "${vchdId}" is already associated with another user.`);
      } 
    }

    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    return user;
  }

  // Controllersiz ishlatish uchun
  async findByUsername(username: string): Promise<User> {

    const user = await this.userRepository.findOne({ where: { username } });
    if(!user) {
      throw new NotFoundException(`User with username "${username}" not found.`);
    }
    return user
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
