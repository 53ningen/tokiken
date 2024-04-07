'use client'

import { costumesTag } from '@/db/costumes'
import {
  eventArticlesTag,
  eventCastsTag,
  eventCostumesTag,
  eventPlaceTag,
  eventTweetsTag,
  eventsTag,
} from '@/db/events'
import { useFormState } from 'react-dom'
import ActionButton from '../commons/ActionButton'
import Alert from '../commons/Alert'
import FormItem from '../commons/FormItem'
import { revalidateTagAction } from './RevalidateTagAction'

const options: string[] = [
  'songs',
  'tweets',
  costumesTag,
  eventsTag(2015, 4),
  eventCostumesTag(0),
  eventTweetsTag(0),
  eventArticlesTag(0),
  eventCastsTag(0),
  eventPlaceTag(0),
].sort()

const RevalidateTagForm = () => {
  const [state, dispatch] = useFormState(revalidateTagAction, {})
  return (
    <form key={JSON.stringify(state)} action={dispatch}>
      <FormItem label="削除">
        <div className="flex gap-2">
          <input
            id="tag"
            name="tag"
            required
            type="text"
            list="tags"
            autoComplete="off"
            className="border rounded py-1 px-3"
          />
          <datalist id="tags">
            {options.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
          <ActionButton actionType="delete">キャッシュ削除</ActionButton>
        </div>
        {state.error && <Alert type="error" message={state.error} />}
        {state.revalidated && (
          <Alert
            type="error"
            message={`キャッシュ: ${state.revalidated} の削除が完了しました`}
          />
        )}
      </FormItem>
    </form>
  )
}

export default RevalidateTagForm
