'use server'

import { isAdminUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { revalidateTag as revalidate } from 'next/cache'

interface State {
  revalidated?: string
  error?: string
}

export const revalidateTagAction = async (_: State, data: FormData): Promise<State> => {
  if (!(await isAdminUserServer())) {
    return { error: Errors.NeedAdminPermission.message }
  }

  const tag = data.get('tag') as string
  revalidate(tag)
  return { revalidated: tag }
}
