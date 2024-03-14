import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const { API_KEY } = process.env

export const PUT = async (request: Request) => {
  try {
    const ACTION_KEY = request.headers.get('authorization')
    if (API_KEY === ACTION_KEY) {
      const path = await request.text()
      revalidatePath(path, 'page')
      console.log('revalidatePath', path)
      return NextResponse.json({ message: 'Success', path }, { status: 200 })
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      {
        message: 'Internal Server Error',
      },
      { status: 500 }
    )
  }
}
