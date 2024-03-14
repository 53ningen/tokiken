export const dateToYYYYMMDD = (date: Date): string => {
  return date.toISOString().split('T')[0].replaceAll('-', '.')
}

export const numToYYYYMMDD = (year: number, month: number, day: number): string => {
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

export const numToMMDD = (month: number, day: number): string => {
  return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}
