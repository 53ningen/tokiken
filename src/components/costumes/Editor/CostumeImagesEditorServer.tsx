'use server'

import { Costume, CostumeImage, costumeImagesTag, listCostumeImages } from '@/db/costumes'
import { executeQueryWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { revalidateTag } from 'next/cache'
import CostumeImageUploader from './CostumeImageUploader'
import CostumeImagesEditor from './CostumeImagesEditor'

interface Props {
  costume: Costume
}

export const CostumeImagesEditorWrapper = async ({ costume }: Props) => {
  const images = await listCostumeImages(costume.id)()
  return (
    <>
      <CostumeImagesEditor costume={costume} images={images} />
      <CostumeImageUploader key={images.map((i) => i.id).join(',')} costume={costume} />
    </>
  )
}

interface State {
  image?: CostumeImage
  error?: string
}

export const costumeImagesEditorAction = async (
  state: State,
  data: FormData
): Promise<State> => {
  if (!(await isAssociateUserServer())) {
    return { error: Errors.NeedAssociatePermission.message }
  }

  const costume_id = parseInt(data.get('costume_id') as string)
  const action = data.get('action') as string
  if (isNaN(costume_id) || !action) {
    return { ...state, error: Errors.InvalidRequest.message }
  }

  // 削除アクション
  const del = action.match(/delete:(\d+)/)
  const deleteId = parseInt(del ? del[1] : '')
  if (!isNaN(deleteId)) {
    const res = await deleteRow(costume_id, deleteId)
    return res
  }

  // 更新アクション
  const update = action.match(/update:(\d+)/)
  const updateId = parseInt(update ? update[1] : '')
  if (!isNaN(updateId)) {
    const res = await updateImage(data, updateId)
    return res
  }

  return { error: Errors.InvalidRequest.message }
}

const deleteRow = async (costume_id: number, targetImageId: number): Promise<State> => {
  try {
    const params = {
      where: { id: targetImageId },
    }
    const res = await executeQueryWithLogging(
      prisma.costume_images.delete(params),
      'costume_images.delete',
      params
    )
    revalidateTag(costumeImagesTag(costume_id))
    return { image: res, error: undefined }
  } catch (e) {
    console.error(e)
    return { error: Errors.DatabaseError.message }
  }
}

const updateImage = async (data: FormData, targetImageId: number): Promise<State> => {
  const d = extractData(data, targetImageId)
  if (!d) {
    return { error: Errors.InvalidRequest.message }
  }
  try {
    const params = {
      where: { id: targetImageId },
      data: d,
    }
    const res = await executeQueryWithLogging(
      prisma.costume_images.update(params),
      'costume_images.update',
      params
    )
    revalidateTag(costumeImagesTag(d.costume_id))
    return { image: res, error: undefined }
  } catch (e) {
    console.error(e)
    return { error: Errors.DatabaseError.message }
  }
}

const extractData = (data: FormData, imageId: number) => {
  const costume_id = parseInt(data.get('costume_id') as string)
  const display_order = parseInt(data.get(`display_order[${imageId}]`) as string)
  const description = data.get(`description[${imageId}]`) as string
  const image_credit = data.get(`image_credit[${imageId}]`) as string
  const image_credit_url = data.get(`image_credit_url[${imageId}]`) as string
  const image_key = data.get(`image_key[${imageId}]`) as string
  if (
    isNaN(costume_id) ||
    isNaN(display_order) ||
    !image_key ||
    !description ||
    !image_credit ||
    !image_credit_url
  ) {
    return undefined
  }
  return {
    costume_id,
    display_order,
    description,
    image_credit,
    image_credit_url,
    image_key,
  }
}
