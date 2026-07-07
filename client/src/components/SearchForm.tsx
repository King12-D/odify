import { useState, type FormEvent } from 'react'

interface Props {
  loading: boolean
  onSubmit: (niche: string, country: string, maxResults: number) => void
}

export function SearchForm({ loading, onSubmit }: Props) {
  const [niche, setNiche] = useState('plumber')
  const [country, setCountry] = useState('USA')
  const [maxResults, setMaxResults] = useState(10)

  const handle = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(niche, country, maxResults)
  }

  return (
    <div className="search-card">
      <form onSubmit={handle} className="form-grid">
        <div className="form-group">
          <label htmlFor="niche">Niche</label>
          <input id="niche" value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. plumber" required />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input id="country" value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. USA" required />
        </div>
        <div className="form-group">
          <label htmlFor="max">Results</label>
          <input id="max" type="number" value={maxResults} onChange={e => setMaxResults(Number(e.target.value))} min={1} max={50} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {loading && (
        <div className="spinner-wrap active">
          <div className="progress-track"><div className="progress-fill"></div></div>
          <span className="spinner-label">Scraping pages…</span>
        </div>
      )}
    </div>
  )
}
