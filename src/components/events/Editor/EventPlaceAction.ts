'use server'

import prisma from '@/db/prisma'
import { isAdminUserServer } from '@/utils/amplify'
import { Either, left, right } from '@/utils/either'
import { revalidateTag } from 'next/cache'

export const createEventPlace = async (
  data: FormData
): Promise<Either<string, string>> => {
  if (!(await isAdminUserServer())) {
    return left('Administrator permission required, please contact with @kusabure.')
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
    return left(`kana contains non-hiragana character: ${kana}`)
  }

  try {
    const exists = await prisma.event_places.findFirst({
      where: {
        name,
      },
    })
    if (exists) {
      return left(`event place already exists: ${name}`)
    }
    const res = await prisma.event_places.create({
      data: {
        name,
        kana,
        region,
        address,
      },
    })
    revalidateTag('event-places')
    return right(`created: ${JSON.stringify(res)}`)
  } catch (e) {
    console.log(e)
    return left(`create failed`)
  }
}
