import MenuItem from './MenuItem'

interface Props {
  items: { icon: string; name: string; href: string; enabled?: boolean }[]
}

const Menu = ({ items }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {items.map((item) => (
        <MenuItem
          key={item.name}
          icon={item.icon}
          href={item.href}
          title={item.name}
          enabled={item.enabled}
        />
      ))}
    </div>
  )
}

export default Menu
