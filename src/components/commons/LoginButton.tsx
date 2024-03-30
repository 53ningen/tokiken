'use client'

import useAuth from '@/utils/auth'
import Link from 'next/link'

const LoginButton = () => {
  const { user } = useAuth()
  return (
    <div className="text-xs text-gray-500">
      {user ? <Link href="/dashboard">Dashboard</Link> : <Link href="/login">Login</Link>}
    </div>
  )
}

export default LoginButton
