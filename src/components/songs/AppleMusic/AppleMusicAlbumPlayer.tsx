import { appleMusicAt } from '@/consts/ids'

interface AppleMusicAlbumPlayerProps {
  appleMusicRecordId: string
}

export const AppleMusicAlbumPreviewPlayer = ({
  appleMusicRecordId,
}: AppleMusicAlbumPlayerProps) => {
  return (
    <div className="pb-2">
      <iframe
        id="embedPlayer"
        src={`https://embed.music.apple.com/jp/album/${appleMusicRecordId}?app=music&amp;itsct=music_box_player&amp;itscg=30200&amp;at=${appleMusicAt}&amp;ls=1&amp;theme=auto`}
        height="450px"
        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
        allow="autoplay *; encrypted-media *; clipboard-write"
        style={{
          width: '100%',
          maxWidth: '1200px',
          overflow: 'hidden',
          border: '0',
          borderRadius: '10px',
          transform: 'translateZ(0px)',
          animation: '2s ease 0s 6 normal none running loading-indicator',
          backgroundColor: 'rgb(228, 228, 228)',
        }}
      />
    </div>
  )
}
