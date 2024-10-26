import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserValidation } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/PrismaService';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(private readonly prismaService: PrismaService) { }

  async create(createUserDto: CreateUserDto) {

    try {

    await UserValidation.validate(createUserDto)

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const userExists = await this.prismaService.user.findFirst({
      where: {
        email: createUserDto.email,
      }
    });
    if (userExists) {
      throw new Error('Já existe um usuario com esse email');
    }

    const newUser = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      type: createUserDto.type,
    };

    await this.prismaService.user.create({
      data: {
        ...newUser
      },
    });

    return { newUser };
    } catch (error) {
      throw new Error(error.message);
    }

  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
