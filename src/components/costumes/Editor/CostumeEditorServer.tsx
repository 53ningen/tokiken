'use server'

import { Costume, CostumeType, costumeTag, costumesTag } from '@/db/costumes'
import { executeQueryWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { isAdminUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { revalidateTag } from 'next/cache'

interface State {
  error?: string
  costume?: Costume
}

export const costumeEditorAction = async (
  state: State,
  data: FormData
): Promise<State> => {
  if (!(await isAdminUserServer())) {
    return { error: Errors.NeedAdminPermission.message }
  }

  const slug = data.get('slug') as string
  const name = data.get('name') as string
  const is_official_name = data.get('is_official_name') === 'on'
  const type = data.get('type') as CostumeType
  if (!slug || !name || !type) {
    return { error: Errors.InvalidRequest.message }
  }
  try {
    const params = {
      data: {
        slug,
        name,
        is_official_name,
        type,
      },
    }
    const costume = await executeQueryWithLogging(
      prisma.costumes.create(params),
      'costumes.create',
      params
    )
    revalidateTag(costumeTag(costume.id))
    revalidateTag(costumesTag)
    return { costume }
  } catch (e) {
    console.error(e)
    return { error: Errors.DatabaseError.message }
  }
}
