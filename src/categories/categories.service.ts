import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createCategoryDto: Prisma.CategoryCreateInput) {
    try {
      return this.databaseService.category.create({
        data: createCategoryDto,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const categories = await this.databaseService.category.findMany();
      return categories;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.databaseService.category.findUnique({
        where: {
          id,
        },
      });

      return category;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(id: string, updateCategoryDto: Prisma.CategoryUpdateInput) {
    try {
      return this.databaseService.category.update({
        where: {
          id,
        },
        data: updateCategoryDto,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      return this.databaseService.category.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
