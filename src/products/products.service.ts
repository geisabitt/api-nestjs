import { Injectable } from '@nestjs/common';
import { CreateProductDto, ProductValidation } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class ProductsService {

  constructor(private readonly prismaService: PrismaService) { }

  async create(createProductDto: CreateProductDto) {

    try {
      await ProductValidation.validate(createProductDto)

      const product = await this.prismaService.product.create({
        data: createProductDto,
      })
      return { product , message: 'Produto criado com sucesso' };

    } catch (error) {
      console.error(error)
      return { error: error.message };
    }

  }

  async findAll() {
    return this.prismaService.product.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.product.findUnique({ where: { id } });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      await ProductValidation.validate(updateProductDto)
      const product = await this.prismaService.product.update({
        where: { id },
        data: updateProductDto,
      })
      return { product, message: 'Produto atualizado com sucesso' };
    } catch (error) {
      console.error(error)
      return { error: error.message };
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.product.delete({ where: { id } });
      return { message: `Produto ${id} deletado com sucesso` }
    } catch (error) {
      console.error(error)
      return { error , message: "Ocorreu um erro ao deletar o produto, verifique o ID do produto e tente novamente" }
    }
  }
}
