import { Costume, listCostumeImages } from '@/db/costumes'
import CostumeDetailImages from './CostumeDetailImages'

interface Props {
  costume: Costume
}

const CostumeDetailImagesWrapper = async ({ costume }: Props) => {
  const images = await listCostumeImages(costume.id)()
  return <CostumeDetailImages images={images} />
}

export default CostumeDetailImagesWrapper
