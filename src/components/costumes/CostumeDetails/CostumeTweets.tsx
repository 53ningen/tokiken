import SectionHeading from '@/components/commons/SectionHeading'
import Tweet from '@/components/contents/tweets/Tweet'
import { listTweetsByCostumeId } from '@/db/tweets'

interface Props {
  costumeId: number
}

const CostumeTweets = async ({ costumeId }: Props) => {
  const tweets = await listTweetsByCostumeId(costumeId)()
  return (
    <div>
      <SectionHeading title="💬 関連ツイート" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
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
    </div>
  )
}

export default CostumeTweets
