'use client'

import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import { costumeImageUrl } from '@/consts/metadata'
import { Costume, CostumeImage } from '@/db/costumes'
import { Event, EventCostume } from '@/db/events'
import { Either } from '@/utils/either'
import { useState } from 'react'
import { addEventCostume } from './EventCostumeEditorWrapper'
import EventCostumeItemEditor from './EventCostumeItemEditor'

interface Props {
  event: Event
  eventCostumes: (Costume & {
    event_costumes?: EventCostume[]
    costume_images?: CostumeImage[]
    event_costume_id: number
    display_order: number
  })[]
  allCostumes: (Costume & { costume_images: CostumeImage[] })[]
}

const EventCostumeEditor = ({ event, eventCostumes, allCostumes }: Props) => {
  const [result, setResult] = useState<Either<string, EventCostume>>()
  const [selectedCostume, setSelectedCostume] = useState<
    Costume & { costume_images: CostumeImage[] }
  >()
  return (
    <div className="grid gap-4">
      <form
        action={async (data) => {
          setResult(await addEventCostume(data))
        }}
        className="flex items-center">
        <FormItem id="costume_id" label="追加">
          <img
            src={costumeImageUrl('xs', selectedCostume?.costume_images[0]?.image_key)}
            alt="selected costume"
            className="mr-4 w-8 h-8 rounded"
          />
          <input type="hidden" name="event_id" value={event.id} />
          <select
            name="costume_id"
            id="costume_id"
            required
            value={selectedCostume?.id}
            onChange={(e) =>
              setSelectedCostume(
                allCostumes.find((c) => c.id.toString() === e.currentTarget.value)
              )
            }
            className="border rounded py-1 px-2 mr-2">
            <option>---</option>
            {allCostumes.map((costume) => (
              <option key={costume.id} value={costume.id}>
                {costume.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            defaultValue={1}
            name="display_order"
            placeholder="表示順"
            className="border py-1 px-2 rounded"
          />
        </FormItem>
        <div className="grow text-right">
          <button type="submit" className="ml-4 py-1 px-2 bg-blue-500 text-white rounded">
            衣装追加
          </button>
        </div>
      </form>
      {result?.isLeft && <Alert type="error" message={result.value} className="my-4" />}
      <FormItem label="削除">
        {eventCostumes.length === 0 && (
          <div className="text-sm text-gray-500">紐づいている衣装がありません</div>
        )}
        <div className="grid gap-2">
          {eventCostumes.map((eventCostume) => (
            <EventCostumeItemEditor key={eventCostume.id} eventCostume={eventCostume} />
          ))}
        </div>
      </FormItem>
    </div>
  )
}

export default EventCostumeEditor
