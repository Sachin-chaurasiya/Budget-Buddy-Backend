import { Controller, Get, Query } from '@nestjs/common';
import { HistoryService } from './history.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @ApiOperation({
    summary: 'Get history data',
    description: 'Get history data for a user',
    parameters: [
      {
        name: 'userId',
        in: 'query',
        example: '8ac43af0-b683-4041-8da7-98b9ea51e4a4',
      },
      {
        name: 'timeFrame',
        in: 'query',
        examples: {
          month: {
            value: 'month',
          },
          year: {
            value: 'year',
          },
        },
      },
      {
        name: 'month',
        in: 'query',
        example: 1,
        description: 'Month Value is between 0(January) and 11(December)',
      },
      {
        name: 'year',
        in: 'query',
        example: 2025,
      },
    ],
    responses: {
      '200': {
        description: 'History data',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  day: {
                    type: 'number',
                    nullable: true,
                  },
                  month: {
                    type: 'number',
                  },
                  year: {
                    type: 'number',
                  },
                  expense: {
                    type: 'number',
                  },
                  income: {
                    type: 'number',
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @Get()
  async getHistory(
    @Query('userId') userId: string,
    @Query('timeFrame') timeFrame: string,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.historyService.getHistory(userId, timeFrame, month, year);
  }
}
