import Link from 'next/link'
import { HTMLAttributes, ReactNode } from 'react'

interface Props {
  icon: ReactNode
  text: ReactNode
  href: string
  className?: HTMLAttributes<HTMLDivElement> | string
}

const LinkButton = ({ icon, text, href, className }: Props) => {
  return (
    <Link href={href} target="_blank">
      <div
        className={`flex gap-2 p-1 justify-center items-center rounded shadow bg-tokimekiorange text-white text-sm`}>
        <div>{icon}</div>
        <div>{text}</div>
      </div>
    </Link>
  )
}

export default LinkButton
