import { inquiryFormUrl } from '@/consts/metadata'
import Link from 'next/link'
import LoginButton from './LoginButton'

const Footer = () => {
  const isoDate = new Date().toISOString()
  return (
    <footer className="grid gap-4 p-32 text-center">
      <div className="">
        <Link href="/" className="text-xs text-gray-500">
          超ときめき♡研究部
        </Link>
      </div>
      <div className="flex justify-center space-x-4">
        <Link href={inquiryFormUrl} target="_blank" className="text-xs text-gray-500">
          Contact
        </Link>
        <Link href="/privacy" className="text-xs text-gray-500">
          Privacy Policy
        </Link>
        <Link
          href="https://twitter.com/kusabure"
          target="_blank"
          className="text-xs text-gray-500">
          Twitter
        </Link>
      </div>
      <LoginButton />
      <div className="text-xs text-gray-200">generated at {isoDate}</div>
    </footer>
  )
}

export default Footer
