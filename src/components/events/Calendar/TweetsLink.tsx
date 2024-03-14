'use client'

import Tooltip from '@/components/commons/Tooltip'
import Link from 'next/link'
import { FaTwitterSquare } from 'react-icons/fa'

interface Props {
  date: Date
  screenName: 'sendenbu_staff' | 'julia_an115'
  color?: string
}

const sendenbuTwitterSince = new Date(2015, 5 - 1, 1)
const juliaTwitterSince = new Date(2023, 1 - 1, 15)

const enableLink = (date: Date, screenName: string) => {
  switch (screenName) {
    case 'sendenbu_staff':
      return sendenbuTwitterSince <= date && date <= new Date()
    case 'julia_an115':
      return juliaTwitterSince <= date && date <= new Date()
    default:
      return false
  }
}

const tweetsUrl = (date: Date, screenName: string) => {
  const d = new Date(date)
  d.setDate(date.getDate() + 1)
  const until = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  return `https://twitter.com/search?q=from%3A${screenName}%20until%3A${until}%20include:nativeretweets&src=typed_query&f=live`
}

const TweetsLink = ({ date, screenName, color }: Props) => {
  const showLink = enableLink(date, screenName)
  return showLink ? (
    <Tooltip text={`@${screenName} のツイート`} tipPosition="right">
      <Link href={tweetsUrl(date, screenName)} target="_blank">
        <FaTwitterSquare size={20} color={color} />
      </Link>
    </Tooltip>
  ) : (
    <FaTwitterSquare size={20} className="text-gray-200" />
  )
}

export default TweetsLink
