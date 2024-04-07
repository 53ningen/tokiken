'use server'

import { EventPlace } from '@/db/events'
import { executeQueryWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { revalidateTag } from 'next/cache'

interface State {
  error?: string
  eventPlace?: EventPlace
}

export const eventPlaceAction = async (_: State, data: FormData): Promise<State> => {
  if (!(await isAssociateUserServer())) {
    return { error: Errors.NeedAssociatePermission.message }
  }

  const action = data.get('action') as string
  if (action === 'insert') {
    const res = await createEventPlace(data)
    return res
  }
  return { error: Errors.InvalidRequest.message }
}

export const createEventPlace = async (data: FormData): Promise<State> => {
  const name = data.get('name') as string
  const kana = data.get('kana') as string
  const region = data.get('region') as string
  const address = data.get('address') as string
  if (!name || !kana || !region || !address) {
    return { error: Errors.InvalidRequest.message }
  }
  const kanaIsHiragana = /^[a-zA-Z0-9ぁ-んー－]+$/.test(kana)
  if (!kanaIsHiragana) {
    return { error: Errors.InvalidRequest.message }
  }

  try {
    const exists = await prisma.event_places.findFirst({
      where: {
        name,
      },
    })
    if (exists) {
      return { error: Errors.AlreadyExists.message }
    }
    const params = {
      data: {
        name,
        kana,
        region,
        address,
      },
    }
    const res = await executeQueryWithLogging(
      prisma.event_places.create(params),
      'event_places.create',
      params
    )
    revalidateTag('event-places')
    return { eventPlace: res }
  } catch (e) {
    console.error(e)
    return { error: Errors.DatabaseError.message }
  }
}
