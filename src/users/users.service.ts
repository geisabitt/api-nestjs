import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserTypes, UserValidation } from './dto/create-user.dto';
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
        return { status: 409 ,error: 'Já existe um usuario com esse email' };
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

      return { newUser , status: 201, message: 'Usuário cadastrado com sucesso.' };
    } catch (error) {
      return { error: error.message };
    }

  }

  async findAll() {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
      }
    })
  }
  
  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async findUserById(id: string) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  async checkPermission(userType: UserTypes, action: string): Promise<boolean> {
    switch (userType) {
      case UserTypes.ADMIN:
        return true;
      case UserTypes.SELLER:
        return ['createProduct', 'editProduct', 'deleteProduct', 'viewProducts'].includes(action);
      case UserTypes.CLIENT:
        return ['accessOwnProfile', 'updateOwnProfile'].includes(action);
      default:
        return false;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const userExists = await this.prismaService.user.findFirst({
        where: {
          id: updateUserDto.id,
        }
      });
      if (!userExists) {
        return {status: 404, error: 'Usuario não encontrado' };
      }
      await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
      });
      return {status: 200, message: 'Usuário atualizado com sucesso!' };
    } catch (error) {
      return {error};
    }
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
