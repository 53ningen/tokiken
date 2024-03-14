'use client'

import { CostumeImage } from '@/db/costumes'
import Link from 'next/link'
import { useState } from 'react'
import CostumeImg from '../CostumeCollection/CostumeImg'

interface Props {
  images: CostumeImage[]
}

const CostumeDetailImages = ({ images }: Props) => {
  const [image, setImage] = useState(images.length > 0 ? images[0] : undefined)
  return (
    <>
      <div className="border rounded">
        <CostumeImg
          imageKey={image?.image_key}
          size="md"
          alt={image?.description || 'no image'}
        />
      </div>
      {image && (
        <>
          <div className="grid gap-1 py-2 text-left text-xs text-gray-500">
            <div>
              <span className="mr-1">{image.description}</span>
              <span className="mr-1">（撮影:</span>
              <Link
                href={image.image_credit_url}
                target="_blank"
                className="text-primary">
                {image.image_credit}
              </Link>
              <span>{image.image_credit === '草🌱' ? '' : ' さん'}）</span>
            </div>
          </div>
          {images.length > 1 && (
            <div className="pt-4 text-left whitespace-nowrap overflow-x-scroll">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="w-20 h-20 inline-block mr-2 border rounded cursor-pointer select-none"
                  onClick={() => setImage(img)}>
                  <CostumeImg imageKey={img.image_key} size="xs" alt={img.description} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default CostumeDetailImages
