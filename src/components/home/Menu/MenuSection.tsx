import Title from '@/components/commons/Title'
import Menu from './Menu'

interface Props {
  title: string
  description: string
  items: { icon: string; name: string; href: string; enabled?: boolean }[]
}

const MenuSection = ({ title, description, items }: Props) => {
  return (
    <div className="pb-8">
      <Title title={title} description={description} />
      <Menu items={items} />
    </div>
  )
}

export default MenuSection
