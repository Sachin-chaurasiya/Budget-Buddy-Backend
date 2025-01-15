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
import { ApiOperation } from '@nestjs/swagger';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Create transaction' })
  @Post()
  create(@Body() createTransactionDto: Prisma.TransactionCreateInput) {
    return this.transactionsService.create(createTransactionDto);
  }

  @ApiOperation({ summary: 'Find all transactions' })
  @Get()
  findAll(
    @Query('type', new ParseEnumPipe(TransactionType, { optional: true }))
    type?: TransactionType,
  ) {
    return this.transactionsService.findAll(type);
  }

  @ApiOperation({ summary: 'Find one transaction' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @ApiOperation({ summary: 'Delete transaction' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }
}
