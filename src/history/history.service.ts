import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { getHistoryDataSchema, HistoryData } from './dto/get-history.dto';
import { getDaysInMonth } from 'date-fns';

@Injectable()
export class HistoryService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async getYearHistoryData(userId: string, year: number) {
    const result = await this.databaseService.yearHistory.groupBy({
      by: ['month'],
      where: {
        userId,
        year,
      },
      _sum: {
        expense: true,
        income: true,
      },

      orderBy: {
        month: 'asc',
      },
    });

    if (!result || result.length === 0) {
      return [];
    }

    const history: HistoryData[] = [];

    for (let i = 0; i < 12; i++) {
      let expense = 0;
      let income = 0;

      const monthData = result.find((r) => r.month === i);

      if (monthData) {
        expense = monthData._sum.expense || 0;
        income = monthData._sum.income || 0;
      }

      history.push({
        month: i,
        year,
        expense,
        income,
      });
    }

    return history;
  }

  private async getMonthHistoryData(
    userId: string,
    month: number,
    year: number,
  ) {
    const result = await this.databaseService.monthHistory.groupBy({
      by: ['day'],
      where: {
        userId,
        month,
        year,
      },

      _sum: {
        expense: true,
        income: true,
      },

      orderBy: {
        day: 'asc',
      },
    });

    if (!result || result.length === 0) {
      return [];
    }

    const history: HistoryData[] = [];

    const daysInMonth = getDaysInMonth(new Date(year, month));

    for (let index = 1; index < daysInMonth; index++) {
      let expense = 0;
      let income = 0;

      const dayData = result.find((r) => r.day === index);

      if (dayData) {
        expense = dayData._sum.expense || 0;
        income = dayData._sum.income || 0;
      }

      history.push({
        month,
        year,
        day: index,
        expense,
        income,
      });
    }

    return history;
  }

  private async getHistoryData(
    userId: string,
    timeFrame: string,
    month: number,
    year: number,
  ) {
    switch (timeFrame) {
      case 'year':
        return await this.getYearHistoryData(userId, year);

      case 'month':
        return await this.getMonthHistoryData(userId, month, year);
    }
  }

  async getHistory(
    userId: string,
    timeFrame: string,
    month: number,
    year: number,
  ) {
    const queryParams = getHistoryDataSchema.safeParse({
      timeFrame,
      month,
      year,
    });

    if (!queryParams.success) {
      throw new BadRequestException(queryParams.error.message);
    }

    const data = await this.getHistoryData(
      userId,
      queryParams.data.timeFrame,
      queryParams.data.month,
      queryParams.data.year,
    );

    return data;
  }
}
