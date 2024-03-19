import prisma from '@/db/prisma'
import { event_casts, event_places, events, events_type } from '@prisma/client'
import { unstable_cache } from 'next/cache'

export type Event = events
export type EventCast = event_casts
export type EventType = events_type
export type EventPlace = event_places

export const getEvent = (id: number) =>
  unstable_cache(
    async () => {
      const event = await prisma.events.findUnique({
        include: {
          event_casts: true,
          event_places: true,
          event_cosutumes: true,
          event_credits: true,
          event_setlist: {
            include: {
              songs: true,
            },
          },
          event_tweets: {
            include: {
              tweets: {
                include: {
                  tweet_authors: true,
                },
              },
            },
            orderBy: {
              tweets: {
                published_at: 'desc',
              },
            },
          },
        },
        where: {
          id,
        },
      })
      return event
    },
    [`event-${id}`],
    {
      tags: [`event-${id}`],
    }
  )

export const listEvents = (year: number, month: number) =>
  unstable_cache(
    async () => {
      const events = await prisma.events.findMany({
        include: {
          event_places: true,
        },
        where: {
          date: {
            startsWith: `${year}-${month.toString().padStart(2, '0')}`,
          },
        },
        orderBy: [{ date: 'asc' }, { start: 'asc' }],
      })
      return events
    },
    [`events-${year}-${month}`],
    {
      tags: [`events-${year}-${month}`],
    }
  )
