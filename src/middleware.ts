import { fetchAuthSession } from 'aws-amplify/auth/server'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { runWithAmplifyServerContext } from './utils/amplify'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec)
        return session.tokens !== undefined
      } catch (error) {
        console.log(error)
        return false
      }
    },
  })
  if (authenticated) {
    return response
  } else {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/dashboard',
    '/events/add',
    '/events/:id/edit',
    '/costumes/edit',
    '/costumes/:id/edit',
    '/youtube/edit',
  ],
}
