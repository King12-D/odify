import type { LeadResult } from '../types'

interface Props { results: LeadResult[] }

export function StatsBar({ results }: Props) {
  const urls = results.length
  const emails = results.reduce((s, r) => s + r.emails.length, 0)
  const phones = results.reduce((s, r) => s + r.phones.length, 0)

  return (
    <div className="stats-bar visible">
      <span className="stat">
        <span className="stat-icon url">#</span>
        <span className="stat-info">
          <span className="stat-value">{urls}</span>
          <span className="stat-label">URLs</span>
        </span>
      </span>
      <span className="stat">
        <span className="stat-icon email">@</span>
        <span className="stat-info">
          <span className="stat-value">{emails}</span>
          <span className="stat-label">Emails</span>
        </span>
      </span>
      <span className="stat">
        <span className="stat-icon phone">T</span>
        <span className="stat-info">
          <span className="stat-value">{phones}</span>
          <span className="stat-label">Phones</span>
        </span>
      </span>
    </div>
  )
}
