'use client'

import { ArrowPathIcon } from '@heroicons/react/16/solid'
import { ButtonHTMLAttributes } from 'react'
import { useFormStatus } from 'react-dom'

type Props = {
  children?: React.ReactNode
  className?: string
  loading?: boolean
  actionType?: 'update' | 'delete'
} & ButtonHTMLAttributes<HTMLButtonElement>

const ActionButton = ({
  className,
  children,
  loading = false,
  actionType = 'update',
  ...props
}: Props) => {
  const { pending } = useFormStatus()
  const cls = [
    className,
    'rounded py-1 px-3 text-nowrap',
    actionType === 'update'
      ? pending || loading
        ? 'bg-blue-200 text-white'
        : 'bg-blue-500 text-white'
      : pending || loading
      ? 'bg-red-200 text-white'
      : 'bg-red-500 text-white',
  ].join(' ')
  return (
    <button disabled={pending || loading} className={cls} {...props}>
      {(pending || loading) && (
        <ArrowPathIcon className="inline-block w-4 h-4 mr-1 animate-spin" />
      )}
      {children}
    </button>
  )
}

export default ActionButton
