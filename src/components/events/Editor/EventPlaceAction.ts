'use server'

import { executeQueryWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { isAdminUserServer } from '@/utils/amplify'
import { Either, left, right } from '@/utils/either'
import { Errors } from '@/utils/errors'
import { revalidateTag } from 'next/cache'

export const createEventPlace = async (
  data: FormData
): Promise<Either<string, string>> => {
  if (!(await isAdminUserServer())) {
    return left(Errors.NeedAdminPermission.message)
  }

  const name = data.get('name') as string
  const kana = data.get('kana') as string
  const region = data.get('region') as string
  const address = data.get('address') as string
  if (!name || !kana || !region || !address) {
    return left('invalid data')
  }
  const kanaIsHiragana = /^[a-zA-Z0-9ぁ-んー－]+$/.test(kana)
  if (!kanaIsHiragana) {
    return left(Errors.InvalidRequest.message)
  }

  try {
    const exists = await prisma.event_places.findFirst({
      where: {
        name,
      },
    })
    if (exists) {
      return left(Errors.AlreadyExists.message)
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
    return right(`created: ${JSON.stringify(res)}`)
  } catch (e) {
    console.log(e)
    return left(Errors.DatabaseError.message)
  }
}
