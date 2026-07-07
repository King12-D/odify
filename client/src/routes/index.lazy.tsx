import { useState } from 'react'
import { SearchForm } from '../components/SearchForm'
import { ResultsTable } from '../components/ResultsTable'
import { StatsBar } from '../components/StatsBar'
import { useSearch, csvUrl, vcardsUrl } from '../api/search'
import { toast } from '../components/Toast'
import type { LeadResult } from '../types'

export default function Index() {
  const search = useSearch()
  const [results, setResults] = useState<LeadResult[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)

  const handleSearch = async (niche: string, country: string, maxResults: number) => {
    const data = await search.mutateAsync({ niche, country, max_results: maxResults })
    setSessionId(data.session_id)
    setResults(data.results)
    if (!data.results.length) toast('No leads found — try different terms')
    else toast(`Found ${data.results.length} leads`)
  }

  return (
    <>
      <header className="header">
        <div className="header-badge">
          <span className="header-badge-dot"></span>
          Lead Intelligence
        </div>
        <h1>Odify</h1>
        <p>Search any niche in any country. Extract emails &amp; phone numbers. Export to CSV or vCards.</p>
      </header>

      <div className="main-wrap">
        <SearchForm loading={search.isPending} onSubmit={handleSearch} />

        {results.length > 0 && <StatsBar results={results} />}

        {results.length > 0 && (
          <div className="toolbar">
            <a href={csvUrl(sessionId!)} download className="btn btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download CSV
            </a>
            <a href={vcardsUrl(sessionId!)} download className="btn btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              Download All vCards
            </a>
          </div>
        )}

        {results.length > 0 && <ResultsTable results={results} />}

        {search.isError && (
          <div className="empty-state">
            <div className="empty-state-icon">&#9888;</div>
            <div className="empty-state-text">{(search.error as Error).message}</div>
          </div>
        )}
      </div>

      <footer>Odify &mdash; Lead generation for freelancers</footer>
    </>
  )
}
