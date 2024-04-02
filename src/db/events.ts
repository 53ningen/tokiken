import prisma from '@/db/prisma'
import {
  event_casts,
  event_cosutumes,
  event_credits,
  event_places,
  event_setlist,
  event_tweets,
  events,
  events_type,
  setlist_credit,
} from '@prisma/client'
import { unstable_cache } from 'next/cache'

export type Event = events
export type EventCostume = event_cosutumes
export type EventCast = event_casts
export type EventCredit = event_credits
export type EventType = events_type
export type EventPlace = event_places
export type EventTweet = event_tweets
export type EventSetlist = event_setlist
export type SetlistCredit = setlist_credit

export const eventTag = (id: number) => `event-${id}`
export const getEvent = (id: number) =>
  unstable_cache(
    async () => {
      const event = await prisma.events.findUnique({
        where: {
          id,
        },
      })
      return event
    },
    [eventTag(id)],
    {
      tags: [eventTag(id)],
    }
  )

export const eventsTag = (year: number, month: number) => `events-${year}-${month}`
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
    [eventsTag(year, month)],
    {
      tags: [eventsTag(year, month)],
    }
  )

export const eventPlaceTag = (eventId: number) => `event-place-${eventId}`
export const getEventPlace = (eventId: number) =>
  unstable_cache(
    async () => {
      const place = await prisma.event_places.findFirst({
        where: {
          events: {
            some: {
              id: eventId,
            },
          },
        },
      })
      return place
    },
    [eventPlaceTag(eventId)],
    {
      tags: [eventPlaceTag(eventId)],
    }
  )

export const eventCastsTag = (eventId: number) => `event-casts-${eventId}`
export const listEventCasts = (eventId: number) =>
  unstable_cache(
    async () => {
      const casts = await prisma.event_casts.findMany({
        where: {
          event_id: eventId,
        },
      })
      return casts
    },
    [eventCastsTag(eventId)],
    {
      tags: [eventCastsTag(eventId)],
    }
  )

export const eventPlacesTag = `event-places`
export const listEventPlaces = unstable_cache(
  async () => {
    const places = await prisma.event_places.findMany({
      orderBy: {
        kana: 'asc',
      },
    })
    return places
  },
  [eventPlacesTag],
  {
    tags: [eventPlacesTag],
  }
)

export const eventCostumesTag = (eventId: number) => `event-costumes-${eventId}`
export const listEventCostumes = (eventId: number) =>
  unstable_cache(
    async () => {
      const mapping = await prisma.event_cosutumes.findMany({
        select: {
          id: true,
          display_order: true,
          costumes: {
            include: {
              costume_images: true,
              artists: true,
            },
          },
        },
        where: {
          event_id: eventId,
        },
        orderBy: {
          display_order: 'asc',
        },
      })
      return mapping.map((e) => {
        return { ...e.costumes, event_costume_id: e.id, display_order: e.display_order }
      })
    },
    [eventCostumesTag(eventId)],
    {
      tags: [eventCostumesTag(eventId)],
    }
  )

export const eventTweetsTag = (eventId: number) => `event-tweets-${eventId}`
export const listEventTweets = (eventId: number) =>
  unstable_cache(
    async () => {
      const tweets = await prisma.event_tweets.findMany({
        include: {
          tweets: {
            include: {
              tweet_authors: true,
            },
          },
        },
        where: {
          event_id: eventId,
        },
        orderBy: {
          tweets: {
            published_at: 'asc',
          },
        },
      })
      return tweets
    },
    [eventTweetsTag(eventId)],
    {
      tags: [eventTweetsTag(eventId)],
    }
  )

export const eventCreditsTag = (eventId: number) => `event-credits-${eventId}`
export const listEventCredits = (eventId: number) =>
  unstable_cache(
    async () => {
      const credits = await prisma.event_credits.findMany({
        include: {
          artists: true,
        },
        where: {
          event_id: eventId,
        },
        orderBy: {
          display_order: 'asc',
        },
      })
      return credits
    },
    [eventCreditsTag(eventId)],
    {
      tags: [eventCreditsTag(eventId)],
    }
  )

export const eventSetlistTag = (eventId: number) => `event-setlist-${eventId}`
export const listEventSetlist = (eventId: number) =>
  unstable_cache(
    async () => {
      const setlist = await prisma.event_setlist.findMany({
        where: {
          event_id: eventId,
        },
        include: {
          songs: true,
        },
        orderBy: {
          order: 'asc',
        },
      })
      return setlist
    },
    [eventSetlistTag(eventId)],
    {
      tags: [eventSetlistTag(eventId)],
    }
  )
export const setlistCreditTag = (eventId: number) => `setlist-credit-${eventId}`
export const getSetlistCredit = (eventId: number) =>
  unstable_cache(
    async () => {
      const credit = await prisma.setlist_credit.findFirst({
        where: {
          event_id: eventId,
        },
      })
      return credit
    },
    [setlistCreditTag(eventId)],
    {
      tags: [setlistCreditTag(eventId)],
    }
  )

export const eventArticlesTag = (eventId: number) => `event-articles-${eventId}`
export const listEventArticles = (eventId: number) =>
  unstable_cache(
    async () => {
      const article = await prisma.articles.findMany({
        where: {
          event_articles: {
            some: {
              event_id: eventId,
            },
          },
        },
        orderBy: {
          published_at: 'asc',
        },
      })
      return article
    },
    [eventArticlesTag(eventId)],
    {
      tags: [eventArticlesTag(eventId)],
    }
  )

export const eventYouTubeVideosTag = (eventId: number) =>
  `event-youtube-videos-${eventId}`
export const listEventYouTubeVideos = (eventId: number) =>
  unstable_cache(
    async () => {
      const videos = await prisma.youtube_videos.findMany({
        where: {
          event_youtube_videos: {
            some: {
              event_id: eventId,
            },
          },
        },
        orderBy: {
          published_at: 'asc',
        },
      })
      return videos
    },
    [eventYouTubeVideosTag(eventId)],
    {
      tags: [eventYouTubeVideosTag(eventId)],
    }
  )
