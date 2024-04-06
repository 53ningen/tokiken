'use client'

import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import Tweet from '@/components/contents/tweets/Tweet'
import { Costume } from '@/db/costumes'
import { TweetAuthor, Tweet as TweetType } from '@/db/tweets'
import { useFormState } from 'react-dom'
import { costumeTweetEditorAction } from './CostumeTweetEditorServer'

interface Props {
  costume: Costume
  tweets: (TweetType & { tweet_authors: TweetAuthor })[]
}

const CostumeTweetEditor = ({ costume, tweets }: Props) => {
  const [state, dispatch] = useFormState(costumeTweetEditorAction, {
    relatedTweets: tweets,
  })
  return (
    <form action={dispatch} className="flex flex-col gap-2 text-sm">
      <input type="hidden" name="costume_id" value={costume.id} />
      {state.error && <Alert type="error" message={state.error} />}
      <FormItem label="検索">
        <div className="flex gap-2">
          <input
            id="date"
            name="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            type="date"
            autoComplete="off"
            className="border rounded py-1 px-3 mr-2"
          />
          <ActionButton name="action" value="search">
            検索
          </ActionButton>
          <ActionButton actionType="delete" name="action" value="close">
            閉じる
          </ActionButton>
        </div>
      </FormItem>
      {state.items && (
        <FormItem label="">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {state.items.map((t) => (
              <div key={t.id} className="flex flex-col gap-1">
                <ActionButton
                  name="action"
                  value={`insert:${t.id}`}
                  className="w-full"
                  disabled={state.relatedTweets.map((t) => t.id).includes(t.id)}>
                  ▼ 追加
                </ActionButton>
                <Tweet status={t} />
              </div>
            ))}
          </div>
        </FormItem>
      )}
      <FormItem label="追加">
        <div className="flex gap-2">
          <input
            placeholder="ツイートの URL または ID"
            name="tweet"
            type="text"
            autoComplete="off"
            className="border rounded w-full py-1 px-3 mr-2"
          />
          <ActionButton name="action" value={`insert`}>
            追加
          </ActionButton>
        </div>
      </FormItem>
      <FormItem label="削除" className="pt-4">
        <table className="w-full [&_td]:px-1">
          <thead className="text-gray-500">
            <tr>
              <th>id</th>
              <th>published_at</th>
              <th>text</th>
            </tr>
          </thead>
          <tbody>
            {state.relatedTweets.map((tweet) => (
              <tr key={tweet.id}>
                <td>
                  <input
                    type="text"
                    disabled
                    value={tweet.id}
                    contentEditable={false}
                    className="border rounded py-1 px-3"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    disabled
                    value={tweet.published_at}
                    contentEditable={false}
                    className="border rounded py-1 px-3"
                  />
                </td>
                <td className="w-full">
                  <input
                    type="text"
                    value={tweet.text}
                    disabled
                    contentEditable={false}
                    className="border rounded py-1 px-3 w-full"
                  />
                </td>
                <td>
                  <ActionButton
                    actionType="delete"
                    name="action"
                    value={`delete:${tweet.id}`}>
                    削除
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FormItem>
    </form>
  )
}

export default CostumeTweetEditor
