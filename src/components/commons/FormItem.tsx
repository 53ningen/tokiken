import { HTMLAttributes, ReactNode } from 'react'

type Props = {
  id?: string
  label: string
  children?: ReactNode
} & HTMLAttributes<HTMLDivElement>

const FormItem = ({ id, label, children, className, ...props }: Props) => {
  return (
    <div className={`flex items-center ${className}`} {...props}>
      <label htmlFor={id} className="block font-bold w-36">
        {label}
      </label>
      {children}
    </div>
  )
}

export default FormItem
