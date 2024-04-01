const calendarTag = { _tag: 'calendar' }
export const CalendarLocalStorageKeys = {
  showBlogTitles: {
    value: 'showBlogTitles',
    ...calendarTag,
  },
}

type LocalStorageKey = {
  _tag: string
  value: string
}

export const LocalStorage = {
  getItem: (key: LocalStorageKey): string | null => {
    if (typeof window === 'undefined') {
      return null
    }
    return localStorage.getItem(`${key._tag}.${key.value}`)
  },
  setItem: (key: LocalStorageKey, value: string) => {
    if (typeof window === 'undefined') {
      return
    }
    localStorage.setItem(`${key._tag}.${key.value}`, value)
  },
}
