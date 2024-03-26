'use server'

import { TokisenRegimes } from '@/consts/tokisen'
import { Event, EventCast, eventCastsTag, listEventCasts } from '@/db/events'
import prisma from '@/db/prisma'
import { isAssociateUserServer } from '@/utils/amplify'
import { Either, left, right } from '@/utils/either'
import { revalidateTag } from 'next/cache'
import EventCastEditor from './EventCastEditor'

interface Props {
  event: Event
}

const EventCastEditorWrapper = async ({ event }: Props) => {
  const casts = await listEventCasts(event.id)()
  return <EventCastEditor event={event} casts={casts} />
}

export default EventCastEditorWrapper

export const updateCasts = async (
  data: FormData
): Promise<Either<string, EventCast[]>> => {
  if (!(await isAssociateUserServer())) {
    return left('ログインが必要です')
  }

  const eventId = Number(data.get('event_id'))
  const members = Array.from(
    new Set(
      TokisenRegimes.map((regime) => regime.members)
        .flat()
        .map((m) => m.name)
    )
  )
  try {
    const res = await prisma.$transaction(async () => {
      const records: EventCast[] = []
      for (const name of members) {
        const exists = await prisma.event_casts.findFirst({
          where: {
            id: `${eventId}/${name}`,
          },
        })
        const checked = data.get(encodeURIComponent(name))
        if ((exists && checked) || (!exists && !checked)) {
          // レコードとチェックボックスの状態が一致しているならば DB 更新の必要なし
          if (exists) {
            records.push(exists)
          }
          continue
        } else if (exists) {
          // レコードが存在しているがチェックボックスがオフならば削除
          await prisma.event_casts.delete({
            where: {
              id: `${eventId}/${name}`,
            },
          })
        } else {
          // レコードが存在していないがチェックボックスがオンならば追加
          const r = await prisma.event_casts.create({
            data: {
              id: `${eventId}/${name}`,
              event_id: eventId,
              name: name,
            },
          })
          records.push(r)
        }
      }
      revalidateTag(eventCastsTag(eventId))
      return records
    })
    return right(res)
  } catch (e) {
    console.error(e)
    return left('データベースエラー')
  }
}

export const insertCasts = async (
  eventId: number,
  ...names: string[]
): Promise<Either<string, EventCast[]>> => {
  if (!(await isAssociateUserServer())) {
    return left('ログインが必要です')
  }
  try {
    const promises = names.map((name) =>
      prisma.event_casts.upsert({
        where: {
          id: `${eventId}/${name}`,
        },
        create: {
          id: `${eventId}/${name}`,
          event_id: eventId,
          name: name,
        },
        update: {},
      })
    )
    const res = await prisma.$transaction(promises)
    revalidateTag(eventCastsTag(eventId))
    return right(res)
  } catch (e) {
    return left('データベースエラー')
  }
}
