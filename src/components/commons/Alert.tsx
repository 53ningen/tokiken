'use client'

import Link from 'next/link'
import { HTMLAttributes } from 'react'
import { ImInfo, ImWarning } from 'react-icons/im'

type Props = {
  message: string
  type: 'error' | 'warning' | 'success' | 'info'
  href?: string
} & HTMLAttributes<HTMLDivElement>

const Alert = ({ message, type, href, className, ...props }: Props) => {
  const classesForColor = getColor(type)
  const classes = [
    'flex',
    'items-center',
    'border',
    'p-2',
    'mb-4',
    'text-left',
    'text-sm',
    'rounded',
    'relative',
    'select-none',
    classesForColor,
  ]
  const icon = getIcon(type)
  return href ? (
    <div className={`${classes.join(' ')} ${className}`} {...props}>
      <Link href={href}>
        <div>
          {icon}
          <span>{message}</span>
        </div>
      </Link>
    </div>
  ) : (
    <div className={`${classes.join(' ')} ${className}`} {...props}>
      {icon}
      <span>{message}</span>
    </div>
  )
}

const getColor = (type: string) => {
  switch (type) {
    case 'error':
      return 'text-red-700 bg-red-100 border-red-400'
    case 'warning':
      return 'bg-yellow-100 border-yellow-400'
    case 'success':
      return 'bg-green-100 border-green-400'
    case 'info':
      return 'bg-blue-100 border-blue-400'
  }
}

const getIcon = (type: string) => {
  const className = 'inline text-xl md:text-lg  mr-4'
  switch (type) {
    case 'error':
      return <ImWarning className={className} />
    case 'warning':
      return <ImWarning className={className} />
    case 'success':
      return <ImInfo className={className} />
    case 'info':
      return <ImInfo className={className} />
  }
}

export default Alert
