import Link from 'next/link'

interface Props {
  label: string
  href: string
}

const PageButton = ({ label, href }: Props) => {
  return (
    <Link
      href={href}
      className="px-3 py-1 w-24 bg-secondary text-white rounded-3xl text-sm">
      {label}
    </Link>
  )
}
export default PageButton
