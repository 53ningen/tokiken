interface Props {
  title: string
  badgeText?: string
}

const SectionHeading = ({ title, badgeText }: Props) => {
  return (
    <div className="flex items-center gap-2 p-2 mb-4 text-md font-semibold bg-gray-200">
      <div>{title}</div>
      {badgeText && (
        <div className="rounded-full bg-gray-500 text-white px-3 text-sm">
          {badgeText}
        </div>
      )}
    </div>
  )
}

export default SectionHeading
