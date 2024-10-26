import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class UsersService {

  constructor(private prismaService: PrismaService) { }
  
  async create(data: CreateUserDto) {
    const userExists = await this.prismaService.user.findFirst({
      where: {
        email: data.email,
      }
    })
    if (userExists) {
      throw new Error('Já existe um usuario com esse email')
    }
    const user = await this.prismaService.user.create({
      data,
    })
    return {user};
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
