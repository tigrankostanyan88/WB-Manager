// client/lib/workingHours.ts

export interface DaySchedule {
  open: string
  close: string
  closed?: boolean
}

export interface WorkingHours {
  mon?: DaySchedule
  tue?: DaySchedule
  wed?: DaySchedule
  thu?: DaySchedule
  fri?: DaySchedule
  sat?: DaySchedule
  sun?: DaySchedule
}

interface DayInfo {
  key: keyof WorkingHours
  short: string
  full: string
}

const DAYS: DayInfo[] = [
  { key: 'mon', short: 'Երկ', full: 'Երկ' },
  { key: 'tue', short: 'Երք', full: 'Երք' },
  { key: 'wed', short: 'Չոր', full: 'Չոր' },
  { key: 'thu', short: 'Հինգ', full: 'Հինգ' },
  { key: 'fri', short: 'Ուրբ', full: 'Ուրբ' },
  { key: 'sat', short: 'Շաբ', full: 'Շաբ' },
  { key: 'sun', short: 'Կիր', full: 'Կիր' },
] as const

interface NormalizedDay {
  key: keyof WorkingHours
  closed: boolean
  open: string
  close: string
}

interface TimeGroup {
  start: number
  end: number
  open: string
  close: string
}

export function getWorkingHoursLabel(raw?: unknown): string {
  if (!raw) return ''

  try {
    const data: WorkingHours =
      typeof raw === 'string' ? (JSON.parse(raw) as WorkingHours) : (raw as WorkingHours)

    const normalized: NormalizedDay[] = DAYS.map(({ key }) => {
      const dayData = data?.[key]
      const open = (dayData?.open ?? '00:00').slice(0, 5)
      const close = (dayData?.close ?? '00:00').slice(0, 5)
      const closed = dayData?.closed === true || !dayData || open === close

      return { key, closed, open, close }
    })

    const openDays = normalized.filter((d) => !d.closed)

    if (openDays.length === 0) return 'Փակ'

    if (
      openDays.every((d) => d.open === '00:00' && d.close === '00:00')
    ) {
      return 'Փակ'
    }

    if (
      openDays.length === 7 &&
      openDays.every(
        (d) => d.open === openDays[0].open && d.close === openDays[0].close
      )
    ) {
      return `Ամեն օր ${openDays[0].open}-${openDays[0].close}`
    }

    const groups: TimeGroup[] = []
    let i = 0
    while (i < normalized.length) {
      if (normalized[i].closed) {
        i++
        continue
      }

      const { open, close } = normalized[i]
      let j = i
      while (
        j + 1 < normalized.length &&
        !normalized[j + 1].closed &&
        normalized[j + 1].open === open &&
        normalized[j + 1].close === close
      ) {
        j++
      }
      groups.push({ start: i, end: j, open, close })
      i = j + 1
    }

    const segments = groups.map((g) => {
      const a = DAYS[g.start]
      const b = DAYS[g.end]
      const name = g.start === g.end ? a.full : `${a.full}-${b.full}`
      return `${name} ${g.open}-${g.close}`
    })

    return segments.join('; ')
  } catch {
    return typeof raw === 'string' ? raw : ''
  }
}
