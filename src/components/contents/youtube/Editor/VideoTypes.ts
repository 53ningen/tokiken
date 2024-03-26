const typeMapping = {
  MusicVideo: 1,
  LIVE: 2,
  Dance: 3,
  踊ってみた: 4,
  歌ってみた: 5,
  ときバロTV: 6,
  グッツCM: 9,
  VLOG: 14,
  おはるチャンネル: 18,
  かなみんチャンネル: 19,
  菅田愛貴ちゃんねる: 20,
  ひとちゃんねる: 21,
  生配信: 25,
  Shorts: 30,
  Uncategorized: 31,
}

const keywordTypeMapping = [
  // ときバロTV
  { keyword: '上昇TV', videoType: typeMapping.ときバロTV },
  { keyword: ' epi.', videoType: typeMapping.ときバロTV },
  { keyword: 'epi ', videoType: typeMapping.ときバロTV },
  { keyword: ' ep6', videoType: typeMapping.ときバロTV },
  { keyword: ' ep7', videoType: typeMapping.ときバロTV },
  { keyword: ' ep8', videoType: typeMapping.ときバロTV },
  { keyword: ' ep9', videoType: typeMapping.ときバロTV },

  // VLOG
  { keyword: 'Cho Tokimeki♡VLOG', videoType: typeMapping.VLOG },
  { keyword: '#TOKISENVLOG', videoType: typeMapping.VLOG },

  { keyword: 'グッズCM', videoType: typeMapping.グッツCM },
  { keyword: 'グッズCM', videoType: typeMapping.グッツCM },
  { keyword: 'ソロダンス', videoType: typeMapping.Dance },
  { keyword: 'ペアダンス', videoType: typeMapping.Dance },
  { keyword: 'Dance Practice', videoType: typeMapping.Dance },

  { keyword: 'Live at ', videoType: typeMapping.LIVE },
  { keyword: 'MUSIC VIDEO', videoType: typeMapping.MusicVideo },
  { keyword: 'MUSICVIDEO', videoType: typeMapping.MusicVideo },
  { keyword: '踊ってみた', videoType: typeMapping.踊ってみた },
  { keyword: '歌ってみた', videoType: typeMapping.歌ってみた },
  { keyword: '生配信', videoType: typeMapping.生配信 },
  { keyword: ' Ust ', videoType: typeMapping.生配信 },
]

export const isShortVideo = async (videoId: string): Promise<boolean> => {
  const res = await fetch(`https://www.youtube.com/shorts/${videoId}`, {
    redirect: 'manual',
  })
  return res.status === 200
}

export const getVideoTypeId = (
  isShort: boolean,
  channelId?: string,
  videoTitle?: string
): number => {
  // ショート判定
  if (isShort) {
    return typeMapping.Shorts
  }
  // チャンネル名による判定
  switch (channelId) {
    case 'UCTzXzFlpQ499MjVT4zqaqJQ':
      return typeMapping.かなみんチャンネル
    case 'UCa_d0vpgZMQpCohGa6bKvlA':
      return typeMapping.おはるチャンネル
    case 'UC6TlNNvPmG1DRNY5aAiMyuA':
      return typeMapping.菅田愛貴ちゃんねる
    case 'UCGC45RR74JOhOPIc6rHO31g':
      return typeMapping.ひとちゃんねる
  }

  // 動画タイトルによる判定
  let videoTypeId = typeMapping.Uncategorized
  if (!videoTitle) {
    return typeMapping.Uncategorized
  }
  for (const mapping of keywordTypeMapping) {
    if (videoTitle.includes(mapping.keyword)) {
      videoTypeId = mapping.videoType
      break
    }
  }
  return videoTypeId
}
