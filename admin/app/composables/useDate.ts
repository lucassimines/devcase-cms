import { parseDate, today } from '@internationalized/date'

export function useDate() {
  const { timeZone } = useAppConfig()

  const todayDate = computed(() => today(timeZone))

  function parseISO(isoString: string) {
    return parseDate(isoString.split('T')?.[0] ?? '')
  }

  return {
    todayDate,
    parseISO
  }
}
