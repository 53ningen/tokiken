import { Redis } from '@upstash/redis'

const redisSingleton = () => {
  return new Redis({
    url: process.env.REDIS_URL as string,
    token: process.env.REDIS_TOKEN as string,
  })
}

declare global {
  var redis: undefined | ReturnType<typeof redisSingleton>
}

const redis = globalThis.redis ?? redisSingleton()

export default redis

if (process.env.NODE_ENV !== 'production') globalThis.redis = redis
