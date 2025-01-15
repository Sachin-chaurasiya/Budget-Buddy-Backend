import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseEnumPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Prisma } from '@prisma/client';
import { TransactionType } from './dto/get-transactio.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: Prisma.TransactionCreateInput) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll(
    @Query('type', new ParseEnumPipe(TransactionType, { optional: true }))
    type?: TransactionType,
  ) {
    return this.transactionsService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }
}
