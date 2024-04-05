'use server'

import { r2S3ClientConfig } from '@/consts/metadata'
import { costumeImagesTag } from '@/db/costumes'
import { executeQueryWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { revalidateTag } from 'next/cache'
import sharp from 'sharp'
import { ulid } from 'ulid'

interface State {
  error?: string
  imageKey?: string
}

const s3 = new S3Client(r2S3ClientConfig)

export const costumeImageUploaderAction = async (
  state: State,
  data: FormData
): Promise<State> => {
  if (!(await isAssociateUserServer())) {
    return { error: Errors.NeedAssociatePermission.message }
  }

  const action = data.get('action') as string
  const costume_id = parseInt(data.get('costume_id') as string)

  // ファイルのアップロード
  if (action === 'upload') {
    const file = data.get('file') as File
    if (isNaN(costume_id) || !file) {
      return { error: Errors.InvalidRequest.message }
    }
    try {
      const base = `costumes/${costume_id}`
      const key = ulid()
      const imageKey = `${costume_id}/${key}`
      const ext = file.name.split('.').pop()
      const [xs, md, lg] = await Promise.all([
        resizeImage(file, 'xs'),
        resizeImage(file, 'md'),
        resizeImage(file, 'lg'),
      ])
      await Promise.all([
        s3.send(
          new PutObjectCommand({
            Bucket: 'tokiken',
            Key: `${base}/${key}.${ext}`,
            Body: (await file.arrayBuffer()) as Buffer,
            ContentType: `image/${ext}`,
          })
        ),
        s3.send(
          new PutObjectCommand({
            Bucket: 'tokiken',
            Key: `${base}/${key}.xs.${ext}`,
            Body: xs,
            ContentType: `image/${ext}`,
          })
        ),
        s3.send(
          new PutObjectCommand({
            Bucket: 'tokiken',
            Key: `${base}/${key}.md.${ext}`,
            Body: md,
            ContentType: `image/${ext}`,
          })
        ),
        s3.send(
          new PutObjectCommand({
            Bucket: 'tokiken',
            Key: `${base}/${key}.lg.${ext}`,
            Body: lg,
            ContentType: `image/${ext}`,
          })
        ),
      ])
      return { imageKey }
    } catch (e) {
      console.error(e)
      return { error: Errors.ServerError.message }
    }
  }

  // レコードの追加
  if (action === 'insert') {
    const d = extractData(data)
    if (!d) {
      return { ...state, error: Errors.InvalidRequest.message }
    }
    try {
      const params = {
        data: {
          costume_id: d.costume_id,
          display_order: d.display_order,
          description: d.description,
          image_credit: d.image_credit,
          image_credit_url: d.image_credit_url,
          image_key: d.image_key,
        },
      }
      await executeQueryWithLogging(
        prisma.costume_images.create(params),
        'costume_images.create',
        params
      )
      revalidateTag(costumeImagesTag(d.costume_id))
      revalidateTag('costume')
      return {}
    } catch (e) {
      console.error(e)
      return { ...state, error: Errors.DatabaseError.message }
    }
  }

  return { ...state, error: Errors.InvalidRequest.message }
}

const resizeImage = async (file: File, size: 'xs' | 'md' | 'lg') => {
  const w = size === 'xs' ? 300 : size === 'md' ? 600 : 1024
  const img = await file.arrayBuffer()
  const resizedImgBuffer = await sharp(img).resize(w).withMetadata().toBuffer()
  return Uint8Array.from(resizedImgBuffer)
}

const extractData = (data: FormData) => {
  const costume_id = parseInt(data.get('costume_id') as string)
  const display_order = parseInt(data.get(`display_order`) as string)
  const description = data.get(`description`) as string
  const image_credit = data.get(`image_credit`) as string
  const image_credit_url = data.get(`image_credit_url`) as string
  const image_key = data.get(`image_key`) as string
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
