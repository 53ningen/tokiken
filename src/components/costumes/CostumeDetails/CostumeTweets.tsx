import SectionHeading from '@/components/SectionHeading'
import Tweet from '@/components/contents/tweets/Tweet'
import { listTweetsByCostumeId } from '@/db/tweets'

interface Props {
  costumeId: number
}

const CostumeTweets = async ({ costumeId }: Props) => {
  const tweets = await listTweetsByCostumeId(costumeId)()
  return (
    <>
      <SectionHeading title="💬 関連ツイート" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2 [&_]:text-left">
        {tweets.length > 0 ? (
          tweets.map((tweet) => {
            return <Tweet key={tweet.id} status={tweet} />
          })
        ) : (
          <div className="py-4 text-sm text-gray-500">
            関連ツイートがまだ紐づけられていません
          </div>
        )}
      </div>
    </>
  )
}

export default CostumeTweets
