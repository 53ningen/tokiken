import LinkButton from '@/components/commons/LinkButton'
import { amazonProductUrl, noImageUrl } from '@/consts/metadata'
import { RecordEdition, RecordType } from '@/db/records'
import Link from 'next/link'
import { FaAmazon } from 'react-icons/fa6'
import AlbumCover from '../AlbumCover'
import RecordEditionTracks from '../RecordEditionTracks/RecordEditionTracks'

interface Props {
  type: RecordType
  edition: RecordEdition
}

const RecordEditionDetails = async ({ type, edition }: Props) => {
  const { id, catalog_number, name, price, release_date, thumbnail_url, asin } = edition
  return (
    <>
      <div id={catalog_number} className="relative -top-16 bg-black" />
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 pb-16">
        <div className="col-span-1 pb-4">
          {asin ? (
            <Link href={amazonProductUrl(asin)} target="_blank">
              <AlbumCover src={thumbnail_url || noImageUrl} alt={edition.name} />
            </Link>
          ) : (
            <AlbumCover src={thumbnail_url || noImageUrl} alt={edition.name} />
          )}
          {asin && (
            <div className="py-2">
              <LinkButton
                icon={<FaAmazon />}
                text="Amazon 商品ページ"
                href={amazonProductUrl(asin)}
              />
            </div>
          )}
        </div>
        <div className="col-span-1 sm:col-span-3">
          <div className="grid gap-1 pb-4">
            <div>
              <span className="bg-black py-1 px-2 text-white text-xs">{type}</span>
            </div>
            <div className="font-semibold">{name}</div>
            <div className="flex flex-wrap gap-2 [&_]:text-gray-500 [&_]:text-xs">
              <div>{catalog_number}</div>
              <div>{release_date}</div>
              {price && <div>{price}</div>}
            </div>
          </div>
          <RecordEditionTracks editionId={id} />
        </div>
      </div>
    </>
  )
}

export default RecordEditionDetails
