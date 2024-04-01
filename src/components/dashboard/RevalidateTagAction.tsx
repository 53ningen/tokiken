'use server'

import { isAdminUserServer } from '@/utils/amplify'
import { Either, left, right } from '@/utils/either'
import { Errors } from '@/utils/errors'
import { revalidateTag as revalidate } from 'next/cache'

export const revalidateTag = async (data: FormData): Promise<Either<string, string>> => {
  if (!(await isAdminUserServer())) {
    return left(Errors.NeedAdminPermission.message)
  }

  const tag = data.get('tag') as string
  try {
    revalidate(tag)
    return right(`revalidated: ${tag}`)
  } catch (e) {
    return left(`revalidate failed: ${tag}`)
  }
}
