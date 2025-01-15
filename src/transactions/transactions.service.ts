import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { TransactionType } from './dto/get-transactio.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createTransactionDto: Prisma.TransactionCreateInput) {
    try {
      const { userId, category, date, type, description, amount } =
        createTransactionDto;

      const dateObj = new Date(date ?? new Date());

      const categoryRow = await this.databaseService.category.findFirst({
        where: {
          name: category,
          userId,
        },
      });

      if (!categoryRow) {
        throw new NotFoundException('Category not found');
      }

      const dbTransaction = await this.databaseService.$transaction([
        // create user transaction
        this.databaseService.transaction.create({
          data: {
            amount,
            userId,
            category: categoryRow.name,
            categoryIcon: categoryRow.icon,
            date,
            type,
            description: description || null,
          },
        }),

        // update month aggregate table

        this.databaseService.monthHistory.upsert({
          where: {
            day_month_year_userId: {
              userId,
              day: dateObj.getUTCDate(),
              month: dateObj.getUTCMonth(),
              year: dateObj.getUTCFullYear(),
            },
          },

          create: {
            day: dateObj.getUTCDate(),
            month: dateObj.getUTCMonth(),
            year: dateObj.getUTCFullYear(),
            userId,
            income: type === 'income' ? amount : 0,
            expense: type === 'expense' ? amount : 0,
          },

          update: {
            expense: {
              increment: type === 'expense' ? amount : 0,
            },
            income: {
              increment: type === 'income' ? amount : 0,
            },
          },
        }),

        // update year aggregate table

        this.databaseService.yearHistory.upsert({
          where: {
            month_year_userId: {
              userId,
              month: dateObj.getUTCMonth(),
              year: dateObj.getUTCFullYear(),
            },
          },

          create: {
            month: dateObj.getUTCMonth(),
            year: dateObj.getUTCFullYear(),
            userId,
            income: type === 'income' ? amount : 0,
            expense: type === 'expense' ? amount : 0,
          },

          update: {
            expense: {
              increment: type === 'expense' ? amount : 0,
            },
            income: {
              increment: type === 'income' ? amount : 0,
            },
          },
        }),
      ]);

      return dbTransaction[0];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(type?: TransactionType) {
    try {
      if (type) {
        return await this.databaseService.transaction.findMany({
          where: {
            type,
          },
        });
      }
      return await this.databaseService.transaction.findMany();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const transaction = await this.databaseService.transaction.findUnique({
        where: {
          id,
        },
      });

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      return transaction;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const transaction = await this.databaseService.transaction.findUnique({
        where: {
          id,
        },
      });

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      const dbTransaction = await this.databaseService.$transaction([
        // delete user transaction

        this.databaseService.transaction.delete({
          where: {
            id,
          },
        }),

        // update month aggregate table

        this.databaseService.monthHistory.update({
          where: {
            day_month_year_userId: {
              userId: transaction.userId,
              day: transaction.date.getUTCDate(),
              month: transaction.date.getUTCMonth(),
              year: transaction.date.getUTCFullYear(),
            },
          },
          data: {
            ...(transaction.type === 'expense' && {
              expense: { decrement: transaction.amount },
            }),
            ...(transaction.type === 'income' && {
              income: { decrement: transaction.amount },
            }),
          },
        }),

        // update year aggregate table

        this.databaseService.yearHistory.update({
          where: {
            month_year_userId: {
              userId: transaction.userId,
              month: transaction.date.getUTCMonth(),
              year: transaction.date.getUTCFullYear(),
            },
          },
          data: {
            ...(transaction.type === 'expense' && {
              expense: { decrement: transaction.amount },
            }),
            ...(transaction.type === 'income' && {
              income: { decrement: transaction.amount },
            }),
          },
        }),
      ]);
      return dbTransaction[0];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
