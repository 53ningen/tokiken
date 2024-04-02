'use server'

import { Event, SetlistCredit, getSetlistCredit, setlistCreditTag } from '@/db/events'
import { executeQueryWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { revalidateTag } from 'next/cache'
import SetlistCreditEditor from './SetlistCreditEditor'

interface Props {
  event: Event
}

const SetlistCreditEditorWrapper = async ({ event }: Props) => {
  const credit = await getSetlistCredit(event.id)()
  return (
    <SetlistCreditEditor event={event} credit={credit as SetlistCredit | undefined} />
  )
}

export default SetlistCreditEditorWrapper

interface State {
  credit?: SetlistCredit
  error?: string
}

export const getSetlistCreditSiteTitle = async (url: string) => {
  try {
    const res = await fetch(url)
    const text = await res.text()
    const title = text.match(/<title>(.*?)<\/title>/)?.[1]
    return title
  } catch {
    return undefined
  }
}

export const setlistCreditEditorAction = async (
  _: State,
  data: FormData
): Promise<State> => {
  if (!(await isAssociateUserServer())) {
    return { error: Errors.NeedAssociatePermission.message }
  }
  const id = parseInt(data.get('id') as string)
  const event_id = parseInt(data.get('event_id') as string)
  const source_url = data.get('source_url') as string
  const name = data.get('name') as string
  if (isNaN(event_id) || !source_url || !name) {
    return { error: Errors.InvalidRequest.message }
  }
  try {
    if (!isNaN(id)) {
      const params = {
        where: { id },
        data: { event_id, source_url, name },
      }
      const res = await executeQueryWithLogging(
        prisma.setlist_credit.update(params),
        'setlist_credit.update',
        params
      )
      revalidateTag(setlistCreditTag(event_id))
      return { credit: res, error: undefined }
    } else {
      const params = {
        data: { event_id, source_url, name },
      }
      const res = await executeQueryWithLogging(
        prisma.setlist_credit.create(params),
        'setlist_credit.create',
        params
      )
      revalidateTag(setlistCreditTag(event_id))
      return { credit: res, error: undefined }
    }
  } catch (e) {
    console.error(e)
    return { error: Errors.DatabaseError.message }
  }
}
