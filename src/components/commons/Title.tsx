interface Props {
  title: string
  description?: string
}

const Title = ({ title, description }: Props) => (
  <div className="py-4">
    <h2 className="text-lg font-bold text-primary">{title}</h2>
    {description && <div className="text-xs text-gray-500">{description}</div>}
  </div>
)

export default Title
