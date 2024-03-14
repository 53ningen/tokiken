import { listRecordEditions } from '@/db/record-editions'
import { Record, RecordEdition } from '@/db/records'
import { dateToYYYYMMDD } from '@/utils/datetime'
import IndexHeading from '../../commons/Index/IndexHeading'
import IndexNav, { yearsIndexNavItems } from '../../commons/Index/IndexNav'
import RecordEditionItem from './RecordEditionItem'

const IndexedRecordEditions = async () => {
  const editions = await listRecordEditions()

  const navItems = yearsIndexNavItems
  const groupedEditions = new Map<string, (RecordEdition & { records: Record })[]>()
  for (const edition of editions) {
    var key = navItems.length - 1
    for (var i = 1; i <= navItems.length; i++) {
      if (dateToYYYYMMDD(new Date(edition.release_date)) < navItems[i]) {
        key = i - 1
        break
      }
    }
    const newItems = [...(groupedEditions.get(navItems[key]) || []), edition]
    groupedEditions.set(navItems[key], newItems)
  }
  return (
    <div>
      <IndexNav items={navItems} />
      {navItems.map((i) => (
        <div key={i}>
          <IndexHeading id={i} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {groupedEditions.get(i)?.map((item) => (
              <RecordEditionItem key={item.catalog_number} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default IndexedRecordEditions
