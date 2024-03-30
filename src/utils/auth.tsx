import { AuthUser, fetchAuthSession, getCurrentUser } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'
import { useEffect, useState } from 'react'

const useAuth = () => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<AuthUser>()
  const [groups, setGroups] = useState<string[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const [u, s] = await Promise.all([getCurrentUser(), fetchAuthSession()])
        setUser(u)
        const { tokens } = s
        const groups = tokens?.idToken?.payload[`cognito:groups`] as string[] | undefined
        setGroups(groups || [])
      } catch {}
      const unsubscribe = Hub.listen('auth', ({ payload }) => {
        switch (payload.event) {
          case 'signedIn':
            setUser(payload.data)
            break
          case 'signedOut':
            setUser(undefined)
            setGroups([])
        }
      })
      setLoading(false)
      return () => unsubscribe()
    })()
  }, [])

  return {
    loading,
    user,
    groups,
  }
}

export default useAuth
