import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { Fragment } from 'react'
import Breadcrumb from './Breadcrumb'

interface Props {
  items: { name: string; href: string }[]
}

const Breadcrumbs = ({ items }: Props) => {
  return (
    <nav className="py-2 text-left">
      <Breadcrumb item={{ name: '🏠', href: '/' }} />
      {items.map((i) => (
        <Fragment key={i.name}>
          <span className="px-1 ">
            <ChevronRightIcon className="inline h-5 w-5 text-gray-500" />
          </span>
          <Breadcrumb item={i} />
        </Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumbs
