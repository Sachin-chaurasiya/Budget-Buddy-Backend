import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { Prisma } from '@prisma/client';

@Controller('user-settings')
export class UserSettingsController {
  constructor(private readonly userSettingService: UserSettingsService) {}

  @Post()
  async create(@Body() createUserSettingsDto: Prisma.UserSettingsCreateInput) {
    return this.userSettingService.create(createUserSettingsDto);
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return this.userSettingService.findOne(userId);
  }

  @Patch(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() updateUserSettingsDto: Prisma.UserSettingsUpdateInput,
  ) {
    return this.userSettingService.update(userId, updateUserSettingsDto);
  }

  @Delete(':userId')
  async remove(@Param('userId') userId: string) {
    return this.userSettingService.remove(userId);
  }
}
