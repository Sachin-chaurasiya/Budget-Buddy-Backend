import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserSettingsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createUserSettingsDto: Prisma.UserSettingsCreateInput) {
    try {
      return this.databaseService.userSettings.create({
        data: createUserSettingsDto,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(userId: string) {
    try {
      const userSettings = await this.databaseService.userSettings.findUnique({
        where: {
          userId,
        },
      });

      if (!userSettings) {
        throw new NotFoundException(
          `User settings not found for user ${userId}`,
        );
      }

      return userSettings;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(
    userId: string,
    updateUserSettingsDto: Prisma.UserSettingsUpdateInput,
  ) {
    try {
      return this.databaseService.userSettings.update({
        where: {
          userId,
        },
        data: updateUserSettingsDto,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(userId: string) {
    try {
      return this.databaseService.userSettings.delete({
        where: {
          userId,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
