'use client'
import Link from 'next/link'

type Props = {
  icon: string
  title: string
  href: string
  enabled?: boolean
}

const MenuItem = ({ icon, title, href, enabled }: Props) => {
  if (enabled ?? true) {
    return (
      <Link href={href}>
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="w-full h-full flex items-center justify-center text-center aspect-square rounded-t-lg bg-secondary ">
            <span className="text-5xl select-none">{icon}</span>
          </div>
          <div className="p-2">
            <h2 className="font-semibold text-sm">{title}</h2>
          </div>
        </div>
      </Link>
    )
  } else {
    return (
      <div>
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="w-full h-full flex items-center justify-center text-center aspect-square rounded-t-lg bg-gray-200 ">
            <span className="text-5xl select-none">{icon}</span>
          </div>
          <div className="p-2">
            <h2 className="font-semibold text-sm text-gray-500">{title}</h2>
          </div>
        </div>
      </div>
    )
  }
}

export default MenuItem
