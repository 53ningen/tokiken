import SectionHeading from '@/components/SectionHeading'
import { Costume, CostumeImage } from '@/db/costumes'
import CostumeCreditItem from './CostumeCreditItem'

interface Props {
  title: string
  costumes: (Costume & { costume_images: CostumeImage[] })[]
}

const CostumeCredits = ({ title, costumes }: Props) => {
  return costumes.length === 0 ? (
    <></>
  ) : (
    <div className="py-4">
      <SectionHeading title={title} badgeText={costumes.length.toString()} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {costumes.map((costume) => (
          <CostumeCreditItem key={costume.id} costume={costume} />
        ))}
      </div>
    </div>
  )
}

export default CostumeCredits
