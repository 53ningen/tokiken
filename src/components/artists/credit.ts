import { SongCreditRole } from '@/db/songs'

export const getCreditTitle = (role: SongCreditRole) => {
  switch (role) {
    case 'Lyrics':
      return '作詞'
    case 'Music':
      return '作曲'
    case 'Arrangement':
      return '編曲'
    case 'Dance':
      return '振付け'
    default:
      return '制作'
  }
}
