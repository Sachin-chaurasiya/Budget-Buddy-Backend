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
import { ApiOperation } from '@nestjs/swagger';

@Controller('user-settings')
export class UserSettingsController {
  constructor(private readonly userSettingService: UserSettingsService) {}

  @ApiOperation({ summary: 'Create user settings' })
  @Post()
  async create(@Body() createUserSettingsDto: Prisma.UserSettingsCreateInput) {
    return this.userSettingService.create(createUserSettingsDto);
  }

  @ApiOperation({ summary: 'Find all user settings' })
  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return this.userSettingService.findOne(userId);
  }

  @ApiOperation({ summary: 'Update user settings' })
  @Patch(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() updateUserSettingsDto: Prisma.UserSettingsUpdateInput,
  ) {
    return this.userSettingService.update(userId, updateUserSettingsDto);
  }

  @ApiOperation({ summary: 'Delete user settings' })
  @Delete(':userId')
  async remove(@Param('userId') userId: string) {
    return this.userSettingService.remove(userId);
  }
}
