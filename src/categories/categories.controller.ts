import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Prisma } from '@prisma/client';
import { ApiOperation } from '@nestjs/swagger';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create category' })
  @Post()
  async create(@Body() createCategoryDto: Prisma.CategoryCreateInput) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Find all categories' })
  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @ApiOperation({ summary: 'Find one category' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update category' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: Prisma.CategoryUpdateInput,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete category' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
