'use client'

import useAuth from '@/utils/auth'

interface Props {
  children: React.ReactNode
}

const AuthContainer = ({ children }: Props) => {
  const { user } = useAuth()
  return <>{user && children}</>
}

export default AuthContainer
