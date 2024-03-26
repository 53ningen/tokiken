'use client'

import Alert from '@/components/commons/Alert'
import SubmitButton from '@/components/commons/SubmitButton'
import { costumeImageUrl } from '@/consts/metadata'
import { Costume, CostumeImage } from '@/db/costumes'
import { EventCostume } from '@/db/events'
import { Either } from '@/utils/either'
import { useState } from 'react'
import { deleteEventCostume, updateEventCostume } from './EventCostumeEditorWrapper'

interface Props {
  eventCostume: Costume & {
    event_costumes?: EventCostume[]
    costume_images?: CostumeImage[]
    event_costume_id: number
    display_order: number
  }
}

const EventCostumeItemEditor = ({ eventCostume }: Props) => {
  const [result, setResult] = useState<Either<string, EventCostume>>()
  return (
    <div>
      <form
        className="flex items-center"
        action={async (data) => {
          setResult(await updateEventCostume(data))
        }}>
        <img
          src={costumeImageUrl('xs', eventCostume.costume_images?.[0]?.image_key)}
          alt={eventCostume.name}
          className="mr-4 w-8 h-8 rounded"
        />
        <span className="mr-2 grow">{eventCostume.name}</span>
        <input
          type="hidden"
          name="event_costume_id"
          value={eventCostume.event_costume_id}
        />
        <input
          type="number"
          defaultValue={eventCostume.display_order}
          name="display_order"
          placeholder="表示優先順位"
          className="border py-1 px-2 mr-2 w-16 rounded"
        />
        <SubmitButton className="mr-2">更新</SubmitButton>
        <button
          className="bg-red-500 text-white py-1 px-2 rounded inline-block"
          onClick={async () => {
            setResult(await deleteEventCostume(eventCostume.event_costume_id))
          }}>
          削除
        </button>
      </form>
      {result?.isLeft && <Alert type="error" message={result.value} className="my-4" />}
    </div>
  )
}

export default EventCostumeItemEditor
