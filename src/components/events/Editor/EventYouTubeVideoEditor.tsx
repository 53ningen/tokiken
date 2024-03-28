'use client'

import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import { youtubeVideoUrl } from '@/consts/metadata'
import { Event } from '@/db/events'
import { YouTubeVideo } from '@/db/youtube-vidoes'
import { useState } from 'react'
import { useFormState } from 'react-dom'
import EventYouTubeVideoListItem from '../EventYouTubeVideoListItem'
import { eventYouTubeVideoEditorAction } from './EventYouTubeVideoEditorWrapper'

interface Props {
  event: Event
  videos: YouTubeVideo[]
}

const EventYouTubeVideoEditor = ({ event, videos }: Props) => {
  const [searchType, setSearchType] = useState<'title' | 'date'>('title')
  const [showShort, setShowShort] = useState(false)
  const [state, dispatch] = useFormState(eventYouTubeVideoEditorAction, {
    items: [],
  })
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
                  id="video-searchtype-title"
                  name="searchtype"
                  type="radio"
                  value="title"
                  checked={searchType === 'title'}
                  onChange={(e) => setSearchType('title')}
                />
                <label htmlFor="video-searchtype-title">動画タイトルで検索</label>
              </div>
              <div className="flex gap-1">
                <input
                  id="video-searchtype-date"
                  name="searchtype"
                  type="radio"
                  value="date"
                  checked={searchType === 'date'}
                  onChange={(e) => setSearchType('date')}
                />
                <label htmlFor="video-searchtype-date">動画投稿日で検索</label>
              </div>
              <div>
                <input
                  id="video-showshort"
                  name="showshort"
                  type="checkbox"
                  checked={showShort}
                  onChange={(e) => setShowShort(e.target.checked)}
                />
                <label htmlFor="video-showshort">ショート動画を表示</label>
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
                      動画検索
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
                      前後3ヶ月の動画検索
                    </ActionButton>
                  </div>
                )}
                {state.error && <Alert type="error" message={state.error} />}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {state.items
                  .filter((i) => (showShort ? true : !i.is_short))
                  .map((item) => (
                    <div key={item.id}>
                      <ActionButton
                        actionType="update"
                        disabled={videos.some((a) => a.id === item.id)}
                        name="action"
                        value={`add:${item.id}`}
                        className="w-full text-xs">
                        ▼ 動画追加
                      </ActionButton>
                      <EventYouTubeVideoListItem video={item} />
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
                <th>動画タイトル</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video.id}>
                  <td className="text-nowrap">{video.published_at}</td>
                  <td className="w-auto">
                    <a href={youtubeVideoUrl(video.id)} target="_blank">
                      {video.title}
                    </a>
                  </td>
                  <td className="text-nowrap">
                    <ActionButton
                      name="action"
                      value={`delete:${video.id}`}
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

export default EventYouTubeVideoEditor
