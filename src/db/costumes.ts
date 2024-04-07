import prisma from '@/db/prisma'
import { costume_images, costumes, costumes_type } from '@prisma/client'
import { unstable_cache } from 'next/cache'

export type Costume = costumes
export type CostumeImage = costume_images
export type CostumeType = costumes_type

export const costumeTag = (id: number) => `costumes-${id}`
export const getCostume = (id: number) =>
  unstable_cache(
    async () => {
      const costume = await prisma.costumes.findUnique({
        include: {
          artists: true,
          events: true,
        },
        where: {
          id,
        },
      })
      return costume
    },
    [costumeTag(id)],
    { tags: [costumeTag(id), 'costume'] }
  )

export const costumeImagesTag = (id: number) => `costume-images-${id}`
export const listCostumeImages = (id: number) =>
  unstable_cache(
    async () => {
      const images = await prisma.costume_images.findMany({
        where: {
          costume_id: id,
        },
      })
      return images
    },
    [costumeImagesTag(id)],
    { tags: [costumeImagesTag(id)] }
  )

export const costumesTag = 'costumes'
export const listCostumes = unstable_cache(
  async () => {
    const costumes = await prisma.costumes.findMany({
      include: {
        artists: true,
        costume_images: {
          take: 1,
        },
      },
      orderBy: {
        id: 'asc',
      },
    })
    return costumes
  },
  [costumesTag],
  { tags: [costumesTag, 'costume'] }
)
