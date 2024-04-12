import { TweetAuthor, Tweet as TweetType } from '@/db/tweets'
import Link from 'next/link'

interface Props {
  status: TweetType & { tweet_authors: TweetAuthor }
}

const Tweet = ({ status }: Props) => {
  return (
    <div className="flex flex-col justify-between gap-2 border rounded p-2 hover:bg-gray-100">
      <div>
        <div className="flex gap-2 items-center">
          <div className="shrink-0">
            <Link
              href={`https://twitter.com/${status.screen_name}/status/${status.id}`}
              rel="noopener noreferrer"
              className="font-bold text-sm"
              target="_blank">
              <img
                src={status.tweet_authors.icon_url!}
                alt={status.tweet_authors.user_name}
                className="w-10 aspect-square rounded-full"
              />
            </Link>
          </div>
          <div className="flex flex-col overflow-hidden">
            <div className="overflow-hidden text-nowrap text-ellipsis">
              <Link
                href={`https://twitter.com/${status.screen_name}/status/${status.id}`}
                rel="noopener noreferrer"
                className="font-bold text-sm"
                target="_blank">
                {status.tweet_authors.user_name}
              </Link>
            </div>
            <Link
              href={`https://twitter.com/${status.screen_name}/status/${status.id}`}
              rel="noopener noreferrer"
              className="text-gray-500 text-sm"
              target="_blank">
              @{status.screen_name}
            </Link>
          </div>
        </div>
        <pre className="pt-2 text-xs whitespace-pre-wrap">{status.text}</pre>
      </div>
      <div>
        {status.image_urls && (
          <div className="w-full">
            <Link
              href={`https://twitter.com/${status.screen_name}/status/${status.id}`}
              rel="noopener noreferrer"
              prefetch={false}
              target="_blank">
              <img
                src={status.image_urls.split(',')[0]}
                alt="tweet-image"
                loading="lazy"
                className="w-full aspect-video sm:aspect-square object-cover rounded"
              />
            </Link>
          </div>
        )}
        <div className="flex text-gray-500 text-sm">
          <Link
            href={`https://twitter.com/${status.screen_name}/status/${status.id}`}
            rel="noopener noreferrer"
            prefetch={false}
            target="_blank"
            className="hover:underline">
            {status.published_at}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Tweet
