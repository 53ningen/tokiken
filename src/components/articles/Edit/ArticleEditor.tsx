'use client'

import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import { useFormState } from 'react-dom'
import { ulid } from 'ulid'
import { articleEditorAction } from './ArticleEditorServer'

const ArticleEditor = () => {
  const [state, dispatch] = useFormState(articleEditorAction, { id: ulid() })
  return (
    <form key={state.id} action={dispatch} className="flex flex-col gap-2">
      <Alert
        type="info"
        message="情報取得対応サイト: ナタリー,RealSound,Ototoy,PR Times,OK Music"
      />
      <FormItem label="記事 URL">
        <div className="flex gap-2">
          <input
            type="url"
            name="url"
            placeholder="記事 URL"
            defaultValue={state.url}
            autoComplete="off"
            className="border rounded w-full py-1 px-3"
          />
          <ActionButton name="action" value="preload">
            記事情報を取得
          </ActionButton>
        </div>
      </FormItem>
      <FormItem label="記事タイトル">
        <input
          type="text"
          name="title"
          defaultValue={state.title}
          placeholder="記事タイトル"
          autoComplete="off"
          className="border rounded w-full py-1 px-3"
        />
      </FormItem>
      <FormItem label="サムネイル URL">
        <div className="flex gap-2">
          {state.thumbnail_url && (
            <img
              src={state.thumbnail_url}
              alt=""
              className="h-8 aspect-video object-cover"
            />
          )}
          <input
            type="url"
            name="thumbnail_url"
            defaultValue={state.thumbnail_url}
            placeholder="サムネイル URL"
            autoComplete="off"
            className="border rounded w-full py-1 px-3"
          />
        </div>
      </FormItem>
      <FormItem label="投稿日時">
        <input
          type="datetime-local"
          name="published_at"
          defaultValue={state.published_at}
          autoComplete="off"
          className="border rounded py-1 px-3"
        />
      </FormItem>
      {state.error && <Alert type="error" message={state.error} />}
      {state.article && (
        <Alert type="info" message={`${state.article.title} が追加されました`} />
      )}
      <div className="text-right">
        <ActionButton name="action" value="insert">
          記事を追加
        </ActionButton>
      </div>
    </form>
  )
}

export default ArticleEditor
