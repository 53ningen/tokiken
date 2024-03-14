import SectionHeading from '@/components/SectionHeading'
import { listYouTubeChannels } from '@/db/youtube-channels'
import ChannelItem from './ChannelItem'

const ChannelCollection = async () => {
  const channels = await listYouTubeChannels()
  return (
    <div>
      <SectionHeading title="🎬 チャンネル" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 text-left">
        {channels.map((channel) => (
          <ChannelItem key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  )
}

export default ChannelCollection
