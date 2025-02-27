import { Test, TestingModule } from '@nestjs/testing';
import { UserSettingsService } from './user-settings.service';
import { DatabaseService } from '../database/database.service';

describe('UserSettingsService', () => {
  let service: UserSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSettingsService, DatabaseService],
    }).compile();

    service = module.get<UserSettingsService>(UserSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
