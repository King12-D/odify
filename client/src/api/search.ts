import { useMutation } from '@tanstack/react-query'
import type { SearchResponse } from '../types'

const API = ''

export function useSearch() {
  return useMutation({
    mutationFn: async (data: { niche: string; country: string; max_results: number }) => {
      const fd = new FormData()
      fd.append('niche', data.niche)
      fd.append('country', data.country)
      fd.append('max_results', String(data.max_results))
      const res = await fetch(`${API}/search`, { method: 'POST', body: fd })
      if (!res.ok) throw new Error(`Server error (${res.status})`)
      return res.json() as Promise<SearchResponse>
    },
  })
}

export function csvUrl(sessionId: string) {
  return `/download/csv/${sessionId}`
}

export function vcardsUrl(sessionId: string) {
  return `/download/all-vcards/${sessionId}`
}
