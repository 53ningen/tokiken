import Link from 'next/link'
import { ImInfo, ImWarning } from 'react-icons/im'

interface Props {
  message: string
  type: 'error' | 'warning' | 'success' | 'info'
  href?: string
}

const Alert = ({ message, type, href }: Props) => {
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
    <Link href={href}>
      <div className={classes.join(' ')}>
        {icon}
        <span>{message}</span>
      </div>
    </Link>
  ) : (
    <div className={classes.join(' ')}>
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
      return 'text-yellow-700 bg-yellow-100 border-yellow-400'
    case 'success':
      return 'text-green-700 bg-green-100 border-green-400'
    case 'info':
      return 'text-blue-700 bg-blue-100 border-blue-400'
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
