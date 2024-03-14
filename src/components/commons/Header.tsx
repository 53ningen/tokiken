import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 py-2 flex justify-center items-center bg-secondary">
        <Link href="/">
          <Image
            src="/logo.webp"
            alt="超ときめき♡研究部"
            width={204}
            height={33}
            priority={true}
          />
        </Link>
      </header>
      <div className="h-14 w-full" />
    </>
  )
}

export default Header
