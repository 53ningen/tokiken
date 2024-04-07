'use client'

import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import { Event } from '@/db/events'
import { Song } from '@/db/songs'
import { useState } from 'react'
import { useFormState } from 'react-dom'
import { eventSetlistBulkEditorAction } from './EventSetlistBulkEditorWrapper'

interface Props {
  event: Event
  songs: Song[]
}

const EventSetlistBulkEditor = ({ event, songs }: Props) => {
  const [text, setText] = useState<string>()
  const [songList, setSongList] = useState<(Song | undefined)[]>([])
  const [state, dispatch] = useFormState(eventSetlistBulkEditorAction, {})
  return (
    <form action={dispatch}>
      <input type="hidden" name="event_id" value={event.id} />
      <input
        type="hidden"
        name="song_ids"
        value={JSON.stringify(songList.map((s) => s?.id || -1))}
      />
      <FormItem label="バルク編集">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 min-h-48">
            <textarea
              id="note"
              name="note"
              placeholder="セットリスト入力欄"
              value={text}
              className="border rounded w-1/2 py-1 px-3"
              onChange={(e) => {
                const t = e.target.value.replace(/\n{3,}/g, '\n')
                setText(t)
                setSongList(textToSongList(t, songs))
              }}
            />
            <pre className="border rounded w-1/2 py-1 px-3 bg-gray-100">
              {songList
                .map((song, i) =>
                  song ? `${i + 1}. ${song?.title}` : '<-- 曲名の判定に失敗しました -->'
                )
                .join('\n')}
            </pre>
          </div>
          {state.error && <Alert type="error" message={state.error} />}
          <div className="flex justify-end items-center gap-2">
            {songList.includes(undefined) && (
              <div className="text-red-500 text-sm">
                曲名が判別できない行を修正してください
              </div>
            )}
            <div>
              <ActionButton
                type="submit"
                name="action"
                value="add"
                disabled={songList.includes(undefined)}>
                セットリストに追加
              </ActionButton>
            </div>
          </div>
        </div>
      </FormItem>
    </form>
  )
}

export default EventSetlistBulkEditor

const textToSongList = (text: string, allSongs: Song[]): (Song | undefined)[] => {
  const lines = text.split('\n').map((line) => line.trim())
  const processedSongs = allSongs
    .map((s) => {
      return { ...s, processedTitle: processItem(s.title) }
    })
    .sort((a, b) => b.processedTitle.length - a.processedTitle.length)

  const songs: Song[] = []
  for (const line of lines) {
    if (line === '') continue
    const processedLine = processItem(line)
    const res = processedSongs.find((s) => processedLine.includes(s.processedTitle))
    songs.push(res as Song)
  }
  return songs
}

const processItem = (item: string) => {
  const replacedItem = item
    // .replace(/[^0-9A-Za-z\u3041-\u3096\u30A1-\u30F6\u3005-\u3006\u3400-\u3fff]/g, '')
    .replace(
      /[^A-Za-zぁ-んァ-ヶー\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]/g,
      ''
    )
    .toLowerCase()
  return replacedItem
}
