'use client'

import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import { useFormState } from 'react-dom'
import { ArticleSites } from './ArticleSites'
import { articleSynchronizerAction } from './ArticleSynchronizerServer'

interface Props {}

const ArticleSynchronizer = ({}: Props) => {
  const [state, dispatch] = useFormState(articleSynchronizerAction, {})
  return (
    <form action={dispatch} className="flex flex-col gap-2">
      <FormItem label="記事配信サイト">
        <div className="flex gap-2">
          <select name="site" className="py-1 px-3 border rounded">
            {ArticleSites.filter((site) => site.parseArticleList !== undefined).map(
              (site) => (
                <option key={site.id} value={site.id}>
                  {site.label}
                </option>
              )
            )}
          </select>
          <input
            type="number"
            name="page"
            defaultValue="1"
            className="py-1 px-3 w-16 border rounded"
          />
          <ActionButton name="action" value="fetch">
            差分取得
          </ActionButton>
        </div>
      </FormItem>
      {state.inserted && state.inserted > 0 && (
        <Alert type="info" message={`${state.inserted} 件の記事を追加しました`} />
      )}
      {state.error && <Alert type="error" message={state.error} />}
      {state.items && (
        <div className="flex flex-col gap-2 py-4">
          <table className="w-full text-sm">
            <tbody>
              {state.items.map((item) => (
                <tr key={item.url}>
                  <td>
                    <img
                      src={item.thumbnail_url}
                      alt=""
                      className="h-8 aspect-video object-cover"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.published_at}
                      readOnly
                      className="py-1 px-3 border rounded"
                    />
                  </td>
                  <td className="w-full">
                    <input
                      type="text"
                      value={item.title}
                      readOnly
                      className="py-1 px-3 w-full border rounded"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.url}
                      readOnly
                      className="py-1 px-3 border rounded"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.thumbnail_url}
                      readOnly
                      className="py-1 px-3 border rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {state.items && state.items.length === 0 && (
            <Alert type="info" message="同期されています" />
          )}
          {state.items && state.items.length !== 0 && (
            <div className="text-right">
              <ActionButton name="action" value="sync">
                記事を追加
              </ActionButton>
            </div>
          )}
        </div>
      )}
    </form>
  )
}

export default ArticleSynchronizer
