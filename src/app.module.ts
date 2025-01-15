import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { DatabaseModule } from './database/database.module';
import { UserSettingsModule } from './user-settings/user-settings.module';

@Module({
  imports: [CategoriesModule, DatabaseModule, UserSettingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
