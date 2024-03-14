import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import Title from '@/components/commons/Title'
import { listPosts } from '@/db/posts'
import { Metadata } from 'next'
import Link from 'next/link'

interface Props {}

export const generateMetadata = async ({}: Props): Promise<Metadata | null> => {
  const posts = [{ title: 'test' }]
  const title = `超ときめき♡研究部誌`
  const description = `超ときめき♡研究部誌`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export const generateStaticParams = async () => {
  return []
}

const Posts = async ({}: Props) => {
  const posts = await listPosts(0, 10)()
  return (
    <Container className="max-w-screen-lg text-center px-2 md:px-2 py-4">
      <Breadcrumbs items={[{ name: '超ときめき♡研究部誌', href: '/posts' }]} />
      <Title
        title="超ときめき♡研究部誌"
        description="超ときめき♡研究部に関するメモなど"
      />
      <div className="grid gap-4 text-left">
        {posts.map((post) => (
          <div key={post.id} className="grid gap-1">
            <div className="flex gap-2">
              <div className="text-xs text-gray-500">{post.created_at}</div>
              <div className="text-xs text-gray-500">category</div>
            </div>
            <div className="font-semibold">
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </div>
            {post.description && (
              <div className="text-xs text-gray-500">{post.description}</div>
            )}
          </div>
        ))}
      </div>
    </Container>
  )
}

export default Posts
