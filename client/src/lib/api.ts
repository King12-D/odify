const BASE = ''

export interface PlaceLeadDTO {
  name: string
  phone: string
  address: string
  email: string
  website: string
}

export interface SearchPlacesResponse {
  session_id: string
  results: PlaceLeadDTO[]
}

export async function searchPlaces(
  niche: string,
  location: string,
  maxResults: number,
): Promise<SearchPlacesResponse> {
  const params = new URLSearchParams()
  params.set('niche', niche)
  params.set('location', location)
  params.set('max_results', String(maxResults))
  const res = await fetch(`${BASE}/search-places`, { method: 'POST', body: params })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Search failed (${res.status})`)
  }
  return res.json()
}

export function csvUrl(sessionId: string) {
  return `${BASE}/download/csv/${sessionId}`
}

export function vcardUrl(sessionId: string, idx: number) {
  return `${BASE}/download/vcard/${sessionId}/${idx}`
}

export function allVcardsUrl(sessionId: string) {
  return `${BASE}/download/all-vcards/${sessionId}`
}
