'use client'

import { WithAuthenticatorProps, withAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

function App({ user }: WithAuthenticatorProps) {
  useEffect(() => {
    if (user) {
      redirect('/dashboard')
    }
  }, [user])
  return null
}

export default withAuthenticator(App)
