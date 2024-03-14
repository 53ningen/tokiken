interface Props {
  items: string[]
}

export const jpIndexNavItems: string[] = [
  '',
  'あ',
  'か',
  'さ',
  'た',
  'な',
  'は',
  'ま',
  'や',
  'ら',
  'わ',
]

// from 2015 until current year
export const yearsIndexNavItems: string[] = Array.from(
  { length: new Date().getFullYear() - 2014 },
  (_, i) => (2015 + i).toString()
)

const IndexNav = ({ items }: Props) => {
  return (
    <nav className="px-8 flex flex-wrap justify-center space-x-4">
      {items.map((item) => (
        <a key={item} href={`#${item}`} className="text-primary text-sm">
          {item}
        </a>
      ))}
    </nav>
  )
}

export default IndexNav
