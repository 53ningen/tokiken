'use client'

import { signOut } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import ActionButton from './ActionButton'

interface Props {}

const LogoutButton = ({}: Props) => {
  const router = useRouter()
  return (
    <ActionButton
      type="button"
      onClick={async () => {
        await signOut()
        router.push('/')
      }}>
      ログアウト
    </ActionButton>
  )
}

export default LogoutButton
