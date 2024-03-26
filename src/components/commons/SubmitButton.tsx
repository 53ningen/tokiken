'use client'

import { HTMLAttributes, ReactNode } from 'react'
import { useFormStatus } from 'react-dom'

type Props = {
  children?: ReactNode
  props?: any
} & HTMLAttributes<HTMLButtonElement>

const SubmitButton = ({ children, className, ...props }: Props) => {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${
        pending ? 'bg-blue-200' : 'bg-blue-500'
      } text-white py-1 px-2 rounded inline-block ${className}`}
      {...props}>
      {children}
    </button>
  )
}

export default SubmitButton
