interface Props {
  text: string
  icon?: string
}

const Chip = ({ text, icon }: Props) => {
  return (
    <div className="flex gap-1 border p-1 text-xs rounded-full text-gray-500 select-none">
      {icon && <span>{icon}</span>}
      <span>{text}</span>
    </div>
  )
}

export default Chip
