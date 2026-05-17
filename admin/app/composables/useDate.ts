import { parseDate, today } from '@internationalized/date'
import { format as formatDateFns, isValid, parseISO as parseDateFnsISO } from 'date-fns'

export function useDate() {
  const { timeZone } = useAppConfig()

  const todayDate = computed(() => today(timeZone))

  function parseISO(isoString: string) {
    return parseDate(isoString.split('T')?.[0] ?? '')
  }

  /** Locale-aware display dates (date-fns), e.g. table cells. */
  function format(value: string | Date | null | undefined, pattern = 'PP') {
    if (value == null || value === '') return '—'

    const date = value instanceof Date ? value : parseDateFnsISO(value)
    if (!isValid(date)) return '—'

    return formatDateFns(date, pattern)
  }

  return {
    todayDate,
    parseISO,
    format
  }
}
