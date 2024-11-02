import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UsersService } from '../users/users.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private usersService: UsersService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    userId: number,
  ): Promise<Product> {
    const user = await this.usersService.findOneById(userId);

    const product = this.productsRepository.create({
      ...createProductDto,
      user,
      image: createProductDto.image
        ? Buffer.from(createProductDto.image, 'base64')
        : null,
    });

    return this.productsRepository.save(product);
  }

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  findOne(id: number): Promise<Product> {
    return this.productsRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const productToUpdate = await this.productsRepository.findOne({
      where: { id },
    });

    if (!productToUpdate) {
      throw new Error('Product not found');
    }
    const updateData: Partial<Product> = {};
    if (updateProductDto.name) updateData.name = updateProductDto.name;
    if (updateProductDto.description)
      updateData.description = updateProductDto.description;
    if (updateProductDto.value) updateData.value = updateProductDto.value;

    if (updateProductDto.image) {
      updateData.image = Buffer.from(updateProductDto.image, 'base64');
    }

    await this.productsRepository.update(id, updateData);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
