import amplifyConfig from '@/amplifyconfiguration.json'
import { createServerRunner } from '@aws-amplify/adapter-nextjs'
import {
  generateServerClientUsingCookies,
  generateServerClientUsingReqRes,
} from '@aws-amplify/adapter-nextjs/api'
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth/server'
import { cookies } from 'next/headers'

import config from '@/amplifyconfiguration.json'

export const { runWithAmplifyServerContext } = createServerRunner({
  config,
})

export const cookieBasedClient = generateServerClientUsingCookies({
  config: amplifyConfig,
  cookies,
})

export async function AuthGetCurrentUserServer() {
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => getCurrentUser(contextSpec),
    })
    return currentUser
  } catch (error) {
    console.error(error)
  }
}

export async function groupsServer() {
  const { tokens } = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => fetchAuthSession(contextSpec),
  })
  const groups = tokens?.idToken?.payload[`cognito:groups`] as string[] | undefined
  return groups || []
}

export async function isAdminUserServer() {
  const groups = await groupsServer()
  return groups?.includes('administrators') || false
}

export async function isAssociateUserServer() {
  const groups = await groupsServer()
  return groups?.includes('administrators') || groups?.includes('associates') || false
}

export const reqResBasedClient = generateServerClientUsingReqRes({
  config: amplifyConfig,
})
