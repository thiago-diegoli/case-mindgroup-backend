import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
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

  async findAll(): Promise<any[]> {
    const products = await this.productsRepository.find({
      relations: ['user'],
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      value: product.value,
      image: product.image,
      userId: product.user.id,
    }));
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
      relations: ['user'],
    });

    if (!productToUpdate) {
      throw new NotFoundException('Product not found');
    }

    if (productToUpdate.user.id !== updateProductDto.userId) {
      console.log(productToUpdate.user.id);
      console.log(updateProductDto);
      throw new ForbiddenException(`${productToUpdate.user.id} !== ${updateProductDto.userId}`);
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

  async remove(id: number, userId: number): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.user.id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this product',
      );
    }

    await this.productsRepository.delete(id);
  }
}
