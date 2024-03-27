import prisma from '@/db/prisma'
import { AuthGetCurrentUserServer } from '@/utils/amplify'
import { PrismaPromise } from '@prisma/client'
import { ulid } from 'ulid'

export const executeQueryWithLogging = async (
  p: PrismaPromise<any>,
  operation: string,
  params: any
) => {
  const authUser = await AuthGetCurrentUserServer()
  const user = authUser!.userId
  const [res, _] = await prisma.$transaction([
    p,
    prisma.logs.create({
      data: {
        id: ulid(),
        user,
        operation,
        parameters: JSON.stringify(params),
      },
    }),
  ])
  return res
}
