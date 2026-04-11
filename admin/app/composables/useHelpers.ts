export default function useHelpers() {
  // Convert string to slug
  function toSlug(value: string) {
    return value
      .normalize('NFD') // Normalize the string to decompose accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks (accents)
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Insert a space between camelCase or PascalCase words
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Handle edge case where uppercase letters are followed by lowercase letters
      .toLowerCase() // Convert the string to lowercase
      .trim() // Remove whitespace from both ends of the string
      .replace(/[^\w\s-]/g, '') // Remove all non-word characters except spaces and dashes
      .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple dashes with a single dash
      .replace(/^-+|-+$/g, '') // Remove leading and trailing dashes
  }

  // Debounce
  function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number) {
    let timeout: NodeJS.Timeout | null = null

    return function (this: unknown, ...args: Parameters<T>) {
      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => {
        func.apply(this, args)
      }, wait)
    }
  }

  // Converts a string to Pascal Case
  function pascalCase(value: string) {
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Insert a space between camelCase words
      .split(/[_\s-]+/) // Split the string by underscores, spaces, or dashes.
      .map((word) => {
        // Capitalize the first letter of each word and make the rest lowercase.
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join('') // Join the words without spaces.
  }

  // Check if item is typeof TextValue
  function isTextValue<T>(item: string | TextValue<T>): item is TextValue<T> {
    return typeof item === 'object'
  }

  // Map object items to text and value properties
  function toTextValue<T>(items: T[], text: keyof T, value: keyof T): TextValue<T>[] {
    return items.map((i) => ({ text: i[text]?.toString() ?? '', value: i[value] }))
  }

  const brlFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  function formatCurrency(value: number | string | null | undefined): string {
    return brlFormatter.format(Number(value ?? 0))
  }

  function getApiErrorMessage(err: unknown): string | undefined {
    if (typeof err === 'object' && err !== null && 'data' in err) {
      const data = err.data
      if (
        typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof data.message === 'string'
      ) {
        return data.message
      }
    }
  }

  // Convert number to decimal 2 places
  function toDecimals(value: number | string | null, decimalPlaces = 2) {
    if (value === null || isNaN(Number(value))) {
      return '0.' + '0'.repeat(decimalPlaces)
    }
    return Number(value).toFixed(decimalPlaces)
  }

  return {
    toSlug,
    pascalCase,
    debounce,
    isTextValue,
    toTextValue,
    formatCurrency,
    getApiErrorMessage,
    toDecimals
  }
}
