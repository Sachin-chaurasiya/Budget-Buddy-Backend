import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { randomUUID } from 'node:crypto';

@Injectable()
export class CategoriesService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createCategoryDto: Prisma.CategoryCreateInput) {
    return this.databaseService.category.create({
      data: {
        ...createCategoryDto,
        userId: createCategoryDto.userId ?? randomUUID(),
      },
    });
  }

  async findAll() {
    return this.databaseService.category.findMany();
  }

  async findOne(id: string) {
    return this.databaseService.category.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateCategoryDto: Prisma.CategoryUpdateInput) {
    return this.databaseService.category.update({
      where: {
        id,
      },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    return this.databaseService.category.delete({
      where: {
        id,
      },
    });
  }
}
