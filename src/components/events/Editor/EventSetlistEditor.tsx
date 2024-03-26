'use client'

import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import { Event, EventSetlist } from '@/db/events'
import { Song } from '@/db/songs'
import { useFormState } from 'react-dom'
import { updateSetlist } from './EventSetlistEditorWrapper'

interface Props {
  event: Event
  songs: Song[]
  setlist: EventSetlist[]
}

const EventSetlistEditor = ({ event, songs, setlist }: Props) => {
  const [state, dispatch] = useFormState(updateSetlist, {
    setlist,
    error: undefined,
  })
  return (
    <div>
      <form action={dispatch} className="grid gap-4">
        <input type="submit" hidden onClick={(e) => e.preventDefault()} />
        <input type="hidden" name="event_id" value={event.id} />
        <table className="w-full [&_td]:px-1">
          <thead className="text-center text-sm text-gray-500 font-bold">
            <tr>
              <td>曲順</td>
              <td>楽曲名</td>
              <td>楽曲選択</td>
            </tr>
          </thead>
          <tbody>
            {state.setlist.map((setlist, i) => (
              <tr key={setlist.id}>
                <td>
                  <input type="hidden" name={`id[${i}]`} value={setlist.id} />
                  <input
                    type="number"
                    name={`order[${i}]`}
                    defaultValue={setlist.order}
                    tabIndex={-1}
                    className="border rounded py-1 px-2 w-16"
                  />
                </td>
                <td className="min-w-64">
                  <input
                    type="text"
                    name={`song_title[${i}]`}
                    defaultValue={setlist.song_title || undefined}
                    placeholder="null"
                    tabIndex={-1}
                    className="border rounded py-1 px-3 w-full"
                  />
                </td>
                <td className="w-full">
                  <input
                    name={`song[${i}]`}
                    list={`songs[${i}]`}
                    type="text"
                    pattern={songs.map((song) => song.title).join('|')}
                    defaultValue={
                      songs.find((s) => s.id === setlist.song_id)?.title || undefined
                    }
                    placeholder="楽曲選択"
                    className="border rounded py-1 px-3 w-full"
                  />
                  <datalist id={`songs[${i}]`}>
                    {songs.map((song) => (
                      <option key={song.id} value={song.title}>
                        {song.kana}
                      </option>
                    ))}
                  </datalist>
                </td>
                <td className="text-nowrap">
                  <ActionButton
                    id="action"
                    name="action"
                    value={`update:${i}`}
                    type="submit"
                    actionType="update">
                    {setlist.id < 0 ? '追加' : '更新'}
                  </ActionButton>
                </td>
                <td className="text-nowrap">
                  <ActionButton
                    id="action"
                    name="action"
                    value={`delete:${i}`}
                    type="submit"
                    tabIndex={-1}
                    actionType="delete">
                    削除
                  </ActionButton>
                </td>
              </tr>
            ))}
            <tr>
              <td />
              <td />
              <td />
              <td colSpan={2} className="text-right pt-2">
                <ActionButton
                  id="action"
                  name="action"
                  value="add-row"
                  actionType="update"
                  className="w-full">
                  行の追加
                </ActionButton>
              </td>
            </tr>
          </tbody>
        </table>
        {state.error && <Alert type="error" message={state.error} />}
      </form>
    </div>
  )
}

export default EventSetlistEditor
