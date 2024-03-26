'use client'

import { getCurrentUser, signOut } from 'aws-amplify/auth'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const LoginButton = () => {
  const [authenticated, setAuthenticated] = useState(false)
  useEffect(() => {
    ;(async () => {
      try {
        const currentUser = await getCurrentUser()
        setAuthenticated(currentUser !== undefined)
      } catch {
        setAuthenticated(false)
      }
    })()
  }, [authenticated])
  return (
    <div className="text-xs text-gray-500">
      {authenticated ? (
        <button
          onClick={async () => {
            await signOut()
            setAuthenticated(false)
          }}>
          Logout
        </button>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </div>
  )
}

export default LoginButton
