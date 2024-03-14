/** とき宣に関する定数群 */

interface Regime {
  startDate: string
  members: { name: string; no: number; color: string; colorId: string }[]
  groupName: string
}

export const TokisenRegimes: Regime[] = [
  {
    startDate: '2015-04-11',
    members: [
      { name: '辻野かなみ', no: 1, color: 'ときめき♡ブルー', colorId: 'blue' },
      { name: '小泉遥香', no: 2, color: 'ときめき♡ピンク', colorId: 'pink' },
      { name: '坂井仁香', no: 3, color: 'ときめき♡レッド', colorId: 'red' },
      { name: '吉川ひより', no: 4, color: 'ときめき♡グリーン', colorId: 'green' },
      { name: '永坂真心', no: 5, color: 'ときめき♡イエロー', colorId: 'yellow' },
    ],
    groupName: 'ときめき♡宣伝部',
  },
  {
    startDate: '2017-03-21',
    members: [
      { name: '辻野かなみ', no: 1, color: 'ときめき♡ブルー', colorId: 'blue' },
      { name: '小泉遥香', no: 2, color: 'ときめき♡ピンク', colorId: 'pink' },
      { name: '坂井仁香', no: 3, color: 'ときめき♡レッド', colorId: 'red' },
      { name: '吉川ひより', no: 4, color: 'ときめき♡グリーン', colorId: 'green' },
    ],
    groupName: 'ときめき♡宣伝部',
  },
  {
    startDate: '2017-06-18',
    members: [
      { name: '辻野かなみ', no: 1, color: '超ときめき♡ブルー', colorId: 'blue' },
      { name: '藤本ばんび', no: 2, color: '超ときめき♡レモン', colorId: 'lemon' },
      { name: '坂井仁香', no: 3, color: '超ときめき♡レッド', colorId: 'red' },
      { name: '小泉遥香', no: 4, color: '超ときめき♡ピンク', colorId: 'pink' },
      { name: '小高サラ', no: 5, color: '超ときめき♡パープル', colorId: 'purple' },
      { name: '吉川ひより', no: 6, color: '超ときめき♡グリーン', colorId: 'green' },
    ],
    groupName: 'ときめき♡宣伝部',
  },
  {
    startDate: '2018-10-08',
    members: [
      { name: '辻野かなみ', no: 1, color: '超ときめき♡ブルー', colorId: 'blue' },
      { name: '藤本ばんび', no: 2, color: '超ときめき♡レモン', colorId: 'lemon' },
      { name: '坂井仁香', no: 3, color: '超ときめき♡レッド', colorId: 'red' },
      { name: '小泉遥香', no: 4, color: '超ときめき♡ピンク', colorId: 'pink' },
      { name: '吉川ひより', no: 6, color: '超ときめき♡グリーン', colorId: 'green' },
    ],
    groupName: 'ときめき♡宣伝部',
  },
  {
    startDate: '2018-10-14',
    members: [
      { name: '辻野かなみ', no: 1, color: 'ときめき♡ブルー', colorId: 'blue' },
      { name: '藤本ばんび', no: 2, color: 'ときめき♡レモン', colorId: 'lemon' },
      { name: '坂井仁香', no: 3, color: 'ときめき♡レッド', colorId: 'red' },
      { name: '小泉遥香', no: 4, color: 'ときめき♡ピンク', colorId: 'pink' },
      {
        name: '杏ジュリア',
        no: 5,
        color: '二代目超ときめき♡パープル',
        colorId: 'purple',
      },
      { name: '吉川ひより', no: 6, color: 'ときめき♡グリーン', colorId: 'green' },
    ],
    groupName: 'ときめき♡宣伝部',
  },
  {
    startDate: '2020-04-01',
    members: [
      { name: '辻野かなみ', no: 1, color: '超ときめき♡ブルー', colorId: 'blue' },
      { name: '杏ジュリア', no: 2, color: '超ときめき♡パープル', colorId: 'purple' },
      { name: '坂井仁香', no: 3, color: '超ときめき♡レッド', colorId: 'red' },
      { name: '小泉遥香', no: 4, color: '超ときめき♡ピンク', colorId: 'pink' },
      { name: '菅田愛貴', no: 5, color: '超ときめき♡レモン', colorId: 'lemon' },
      { name: '吉川ひより', no: 6, color: '超ときめき♡グリーン', colorId: 'green' },
    ],
    groupName: '超ときめき♡宣伝部',
  },
]

export const getTokisenRegime = (date: string): Regime | undefined => {
  const d = new Date(date)
  if (isNaN(d.getTime()) || d < new Date(TokisenRegimes[0].startDate)) {
    return undefined
  }
  if (d > new Date(TokisenRegimes[TokisenRegimes.length - 1].startDate)) {
    return TokisenRegimes[TokisenRegimes.length - 1]
  }
  for (let i = 1; i < TokisenRegimes.length; i++) {
    if (d < new Date(TokisenRegimes[i].startDate)) {
      return TokisenRegimes[i - 1]
    }
  }
  return undefined
}
