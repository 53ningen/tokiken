import prisma from '@/db/prisma'
import {
  record_editions,
  record_tracks,
  record_tracks_type,
  records,
  records_type,
} from '@prisma/client'
import { unstable_cache } from 'next/cache'

export type Record = records
export type RecordType = records_type
export type RecordEdition = record_editions
export type RecordTrack = record_tracks
export type RecordTrackType = record_tracks_type

export const getRecord = (id: number) =>
  unstable_cache(
    async () => {
      const record = await prisma.records.findUnique({ where: { id } })
      return record
    },
    [`records-${id}`],
    { tags: [`records-${id}`] }
  )

export const getRecordBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const record = await prisma.records.findUnique({
        where: { slug },
      })
      return record
    },
    [`records-slug-${encodeURIComponent(slug)}`],
    { tags: [`records-slug-${encodeURIComponent(slug)}`] }
  )
