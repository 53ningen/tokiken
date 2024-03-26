import ConfigureAmplifyClientSide from '@/components/commons/ConfigureAmplify'
import Footer from '@/components/commons/Footer'
import Header from '@/components/commons/Header'
import { GoogleTagManager } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const title = '超ときめき♡研究部'
const description = 'ときめく何かを研究する超ときめき♡研究部（非公式）のページ'
const gtmId = process.env.NEXT_PUBLIC_GTM_ID

export const metadata: Metadata = {
  title,
  description,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: './300x300.png',
  },
  metadataBase: new URL('https://tokiken.com'),
  openGraph: {
    title,
    description,
    siteName: title,
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: 'https://tokiken.com/300x300.png',
        width: 300,
        height: 300,
      },
    ],
  },
  twitter: {
    title,
    description,
    creator: '@kusabure',
    images: ['https://tokiken.com/300x300.png'],
    card: 'summary',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ConfigureAmplifyClientSide />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
    </html>
  )
}
