export interface LeadResult {
  url: string
  emails: string[]
  phones: string[]
  emails_str: string
  phones_str: string
}

export interface SearchResponse {
  session_id: string
  results: LeadResult[]
}
