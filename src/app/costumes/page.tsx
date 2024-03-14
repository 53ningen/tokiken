import SectionHeading from '@/components/SectionHeading'
import Alert from '@/components/commons/Alert'
import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import Title from '@/components/commons/Title'
import CostumeCollection from '@/components/costumes/CostumeCollection/CostumeCollection'
import { inquiryFormUrl } from '@/consts/metadata'
import { listCostumes } from '@/db/costumes'
import { Metadata } from 'next'

const title = '超ときめき♡衣装データベース'
const description = '超ときめき♡宣伝部の衣装のデータ'

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

const Costumes = async () => {
  const costumes = await listCostumes()
  return (
    <Container className="max-w-screen-lg text-center px-2 md:px-2 py-4">
      <Breadcrumbs items={[{ name: '衣装データベース', href: '/costumes' }]} />
      <Title title={title} description={description} />
      <div className="grid gap-16">
        <div>
          <SectionHeading title="👗 超ときめき♡宣伝部の衣装" />
          <Alert
            message="写真や情報の提供を募集しています"
            type="info"
            href={inquiryFormUrl}
          />
          <CostumeCollection costumes={costumes.filter((c) => c.type === 'chotokisen')} />
        </div>
        <div>
          <SectionHeading title="👗 ときめき♡宣伝部の衣装" />
          <Alert
            message="ときめき♡宣伝部衣装データは作成中です。衣装展やイベントなどで撮影した写真や情報を募集しています。"
            type="warning"
            href={inquiryFormUrl}
          />
          <CostumeCollection costumes={costumes.filter((c) => c.type === 'tokisen')} />
        </div>
        <div>
          <SectionHeading title="👗 生誕祭の衣装" />
          <Alert
            message="生誕祭衣装データは作成中です。衣装展やイベントなどで撮影した写真や情報を募集しています。"
            type="warning"
            href={inquiryFormUrl}
          />
          <CostumeCollection costumes={costumes.filter((c) => c.type === 'birthday')} />
        </div>
      </div>
    </Container>
  )
}

export default Costumes
