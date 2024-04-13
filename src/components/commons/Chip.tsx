interface Props {
  text: string
  icon?: string
  className?: string
}

const Chip = ({ text, icon, className }: Props) => {
  return (
    <div className="inline-block">
      <div
        className={`flex gap-1 border p-1 text-xs rounded-full text-gray-500 select-none ${className}`}>
        {icon && <span>{icon}</span>}
        <span>{text}</span>
      </div>
    </div>
  )
}

export default Chip
