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

export const costumeEditorAction = async (_: State, data: FormData): Promise<State> => {
  if (!(await isAdminUserServer())) {
    return { error: Errors.NeedAdminPermission.message }
  }
  const id = parseInt(data.get('id') as string)
  const slug = data.get('slug') as string
  const name = data.get('name') as string
  const is_official_name = data.get('is_official_name') === '1'
  const type = data.get('type') as CostumeType
  if (!slug || !name || !type) {
    return { error: Errors.InvalidRequest.message }
  }
  try {
    if (isNaN(id)) {
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
    } else {
      const params = {
        where: { id },
        data: {
          slug,
          name,
          is_official_name,
          type,
        },
      }
      const costume = await executeQueryWithLogging(
        prisma.costumes.update(params),
        'costumes.update',
        params
      )
      revalidateTag(costumeTag(costume.id))
      revalidateTag(costumesTag)
      return { costume }
    }
  } catch (e) {
    console.error(e)
    return { error: Errors.DatabaseError.message }
  }
}
