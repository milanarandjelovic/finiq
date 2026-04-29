import type { StatisticsResponseDto } from './statisticsResponseDto'

export type StatisticsControllerGetStatistics200 = {
  statusCode?: number
  message?: string
  data?: StatisticsResponseDto
}
