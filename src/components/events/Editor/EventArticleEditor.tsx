'use client'

import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import { Article } from '@/db/articles'
import { Event } from '@/db/events'
import { useState } from 'react'
import { useFormState } from 'react-dom'
import EventArticleListItem from '../EventArticleListItem'
import { eventArticleEditorAction } from './EventArticleEditorWrapper'

interface Props {
  event: Event
  articles: Article[]
}

const EventArticleEditor = ({ event, articles }: Props) => {
  const [searchType, setSearchType] = useState<'title' | 'date'>('title')
  const [state, dispatch] = useFormState(eventArticleEditorAction, { items: [] })
  return (
    <form action={dispatch} className="flex flex-col gap-4">
      <input type="submit" hidden onClick={(e) => e.preventDefault()} />
      <input type="hidden" name="event_id" value={event.id} />
      <div className="w-full flex flex-col gap-4 text-sm">
        <FormItem label="追加">
          <div className="flex flex-col gap-2">
            <div className="flex gap-4">
              <div className="flex gap-1">
                <input
                  id="searchtype-title"
                  name="searchtype"
                  type="radio"
                  value="title"
                  checked={searchType === 'title'}
                  onChange={(e) => setSearchType('title')}
                />
                <label htmlFor="searchtype-title">記事タイトルで検索</label>
              </div>
              <div className="flex gap-1">
                <input
                  id="searchtype-date"
                  name="searchtype"
                  type="radio"
                  value="date"
                  checked={searchType === 'date'}
                  onChange={(e) => setSearchType('date')}
                />
                <label htmlFor="searchtype-date">記事作成日で検索</label>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {searchType === 'title' && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="word"
                      pattern=".{3,}"
                      placeholder="検索ワード（3文字以上）"
                      className="w-64 px-2 py-1 border rounded"
                    />
                    <ActionButton
                      actionType="update"
                      name="action"
                      value="search-by-title">
                      記事検索
                    </ActionButton>
                  </div>
                )}
                {searchType === 'date' && (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      name="date"
                      defaultValue={event.date}
                      className="w-64 px-2 py-1 border rounded"
                    />
                    <ActionButton
                      actionType="update"
                      name="action"
                      value="search-by-date">
                      前後3ヶ月の記事検索
                    </ActionButton>
                  </div>
                )}
                {state.error && <Alert type="error" message={state.error} />}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {state.items.map((article) => (
                  <div key={article.id}>
                    <ActionButton
                      actionType="update"
                      disabled={articles.some((a) => a.id === article.id)}
                      name="action"
                      value={`add:${article.id}`}
                      className="w-full text-xs">
                      ▼ 記事追加
                    </ActionButton>
                    <EventArticleListItem article={article} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FormItem>
        <FormItem label="削除">
          <input type="hidden" name="event_id" value={event.id} />
          <table className="w-full [&_td]:px-1">
            <thead className="text-gray-500">
              <tr>
                <th>公開日時</th>
                <th>記事タイトル</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="text-nowrap">{article.published_at}</td>
                  <td className="w-full overflow-hidden text-nowrap text-ellipsis">
                    <a href={article.url} target="_blank">
                      {article.title}
                    </a>
                  </td>
                  <td className="text-nowrap">
                    <ActionButton
                      name="action"
                      value={`delete:${article.id}`}
                      actionType="delete">
                      削除
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FormItem>
      </div>
    </form>
  )
}

export default EventArticleEditor
