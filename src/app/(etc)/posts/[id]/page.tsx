import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Chip from '@/components/commons/Chip'
import Container from '@/components/commons/Container'
import { Markdown } from '@/components/commons/Markdown'
import Title from '@/components/commons/Title'
import { getPost } from '@/db/posts'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata | null> => {
  const id = parseInt(params.id)
  if (isNaN(id) || id < 1) {
    return null
  }
  const post = await getPost(id)()
  if (!post) {
    return null
  } else {
    const title = `${post.title} - 超ときめき♡研究部誌`
    const description = `超ときめき♡研究部誌: ${post.title}`
    return {
      title,
      description,
      openGraph: {
        title,
        description,
      },
    }
  }
}

export const generateStaticParams = async () => {
  return []
}

const Post = async ({ params }: Props) => {
  const id = parseInt(params.id)
  if (isNaN(id) || id < 1) {
    notFound()
  }
  const post = await getPost(id)()
  if (!post) {
    notFound()
  }
  return (
    <Container className="max-w-screen-lg px-2 md:px-2 py-4">
      <Breadcrumbs items={[{ name: '超ときめき♡研究部誌', href: '/posts' }]} />
      <Title title={post.title || ''} />
      <div className="flex gap-2">
        <Chip text={post.created_at} icon="✏️" />
        <Chip text={post.updated_at} icon="♻️" />
      </div>
      <div className="grid gap-4 pb-8 text-left">
        <Markdown body={post.body || ''} />
      </div>
    </Container>
  )
}

export default Post
