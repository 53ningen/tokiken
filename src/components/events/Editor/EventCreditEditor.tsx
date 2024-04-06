'use client'

import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import { Artist } from '@/db/artists'
import { Event, EventCredit } from '@/db/events'
import { useFormState } from 'react-dom'
import { updateCredit } from './EventCreditEditorWrapper'

interface Props {
  event: Event
  artists: Artist[]
  credits: EventCredit[]
}

const EventCreditEditor = ({ event, artists, credits }: Props) => {
  const [state, dispatch] = useFormState(updateCredit, {
    credits: [
      ...credits,
      {
        id: -1 * (credits.length + 1),
        display_order: credits.length + 1,
        event_id: event.id,
        title: '',
        artist_id: -1,
        name: null,
        source_url: '',
      } as EventCredit,
    ],
    error: undefined,
  })
  return (
    <div className="my-4 w-full">
      <FormItem label="制作スタッフ">
        <form action={dispatch} className="grid gap-4 w-full table-fixed">
          <input type="submit" hidden onClick={(e) => e.preventDefault()} />
          <input type="hidden" name="event_id" value={event.id} />
          <table className="w-full [&_td]:px-1">
            <thead className="text-center text-sm text-gray-500 font-bold">
              <tr>
                <td>表示順</td>
                <td>タイトル（必須）</td>
                <td>アーティスト（必須）</td>
                <td>クレジット名</td>
                <td>情報ソースURL（必須）</td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody className="text-sm">
              {state.credits.map((credit, i) => {
                return (
                  <tr key={credit.id}>
                    <td>
                      <input
                        type="number"
                        name={`display_order[${i}]`}
                        tabIndex={-1}
                        defaultValue={credit.display_order}
                        className="border rounded py-1 px-2 w-12"
                      />
                    </td>
                    <td>
                      <input type="hidden" required name={`id[${i}]`} value={credit.id} />
                      <input
                        type="text"
                        name={`title[${i}]`}
                        defaultValue={credit.title}
                        className="border rounded py-1 px-2 w-28"
                      />
                    </td>
                    <td>
                      <input
                        list={`artist_names[${i}]`}
                        type="text"
                        pattern={artists.map((artist) => artist.name).join('|')}
                        defaultValue={
                          artists.find((a) => a.id === credit.artist_id)?.name
                        }
                        placeholder="アーティスト選択"
                        className="border rounded py-1 px-3 w-full"
                        onChange={(e) => {
                          const artist = artists.find((a) => a.name === e.target.value)
                          if (artist) {
                            const elem = document.getElementById(
                              `artist_id[${i}]`
                            ) as HTMLInputElement
                            elem.value = artist.id.toString()
                          }
                        }}
                      />
                      <datalist id={`artist_names[${i}]`}>
                        {artists.map((artists) => (
                          <option key={artists.id} value={artists.name}>
                            {artists.kana}
                          </option>
                        ))}
                      </datalist>
                      <input
                        id={`artist_id[${i}]`}
                        type="hidden"
                        name={`artist_id[${i}]`}
                        value={credit.artist_id}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name={`name[${i}]`}
                        tabIndex={-1}
                        defaultValue={credit.name || undefined}
                        className="border rounded py-1 px-2 w-28 max-w-32"
                        placeholder="null"
                      />
                    </td>
                    <td>
                      <input
                        type="url"
                        name={`source_url[${i}]`}
                        defaultValue={credit.source_url || undefined}
                        className="border rounded py-1 px-2"
                      />
                    </td>
                    <td>
                      <ActionButton
                        id="action"
                        name="action"
                        value={`update:${i}`}
                        type="submit"
                        actionType="update">
                        {credit.id < 0 ? '追加' : '更新'}
                      </ActionButton>
                    </td>
                    <td>
                      <ActionButton
                        id="action"
                        name="action"
                        value={`delete:${i}`}
                        type="submit"
                        tabIndex={-1}
                        actionType="delete"
                        disabled={credit.id < 0}>
                        削除
                      </ActionButton>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {state.error && <Alert type="error" message={state.error} />}
        </form>
      </FormItem>
    </div>
  )
}

export default EventCreditEditor
