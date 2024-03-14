import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import Tweet from '@/components/contents/tweets/Tweet'
import { getTweet } from '@/db/tweets'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export const generateStaticParams = async () => {
  return []
}

const TweetPage = async ({ params }: Props) => {
  const id = params.id
  const tw = await getTweet(id)()
  if (!tw) {
    notFound()
  }
  return (
    <Container className="max-w-screen-lg text-center px-2 md:px-2 py-4">
      <Breadcrumbs items={[{ name: 'ときめき♡ツイート', href: '/tweets' }]} />
      <div className="text-left">
        <Tweet status={tw} />
      </div>
    </Container>
  )
}
export default TweetPage
