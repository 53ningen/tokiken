import prisma from '@/db/prisma'
import { annual_events } from '@prisma/client'
import { unstable_cache } from 'next/cache'

export type AnnualEvent = annual_events

export const listAnnualEvents = (year: number, month: number) =>
  unstable_cache(
    async () => {
      const events = await prisma.annual_events.findMany({
        where: {
          AND: {
            date: {
              startsWith: `${month.toString().padStart(2, '0')}`,
            },
            since_year: {
              lte: year,
            },
          },
          OR: [
            {
              until_year: {
                gte: year,
              },
            },
            {
              until_year: null,
            },
          ],
        },
        orderBy: { date: 'asc' },
      })
      return events
    },
    [`annual_events-year-${year}-month-${month}`],
    { tags: [`annual_events-year-${year}-month-${month}`] }
  )
