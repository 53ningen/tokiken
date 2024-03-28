import { HTMLAttributes, ReactNode } from 'react'

interface Props {
  title?: string
  children?: ReactNode
  props?: HTMLAttributes<HTMLDivElement>
}

const Preview = ({ title, children, ...props }: Props) => {
  return (
    <div className="grid my-4 gap-2" {...props}>
      <div className="text-gray-500 text-sm">
        🔍 コンポーネントプレビュー{title && `（${title}）`}
      </div>
      <div className="border rounded p-4">{children}</div>
    </div>
  )
}

export default Preview
