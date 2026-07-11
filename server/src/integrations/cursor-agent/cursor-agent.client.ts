const CURSOR_API_BASE = process.env.CURSOR_API_URL?.trim() || 'https://api.cursor.com'

function cursorAuthHeaders() {
  const apiKey = process.env.CURSOR_API_KEY?.trim()

  if (!apiKey) {
    throw new Error('CURSOR_API_KEY is not set. Add it to the server environment variables.')
  }

  return {
    Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
    'Content-Type': 'application/json'
  }
}

function formatCursorApiError(status: number, body: string) {
  if (/feature_unavailable|storage mode is disabled/i.test(body)) {
    return (
      'Cursor Cloud Agents are unavailable for this account (storage/privacy mode). ' +
      'Enable cloud agent storage in Cursor settings.'
    )
  }

  return `Cursor API failed (${status}): ${body}`
}

export async function cursorApiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${CURSOR_API_BASE}${path}`, {
    ...init,
    headers: {
      ...cursorAuthHeaders(),
      ...init.headers
    }
  })
  const body = await response.text()

  if (!response.ok) {
    throw new Error(formatCursorApiError(response.status, body))
  }

  return JSON.parse(body) as T
}
