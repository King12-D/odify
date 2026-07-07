import { useMemo } from 'react'
import { flexRender, getCoreRowModel, useReactTable, createColumnHelper } from '@tanstack/react-table'
import type { LeadResult } from '../types'
import { toast } from './Toast'

const col = createColumnHelper<LeadResult>()

interface Props { results: LeadResult[] }

function BadgeList({ items }: { items: string[] }) {
  if (!items.length) return <span className="badge-none">&mdash;</span>
  return (
    <div className="badge-row">
      {items.map(v => (
        <span key={v} className="badge badge-email">
          {v}
          <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(v); toast('Copied!') }}>copy</button>
        </span>
      ))}
    </div>
  )
}

export function ResultsTable({ results }: Props) {
  const columns = useMemo(() => [
    col.display({ id: 'index', header: '#', cell: i => <span className="row-num">{i.row.index + 1}</span> }),
    col.accessor('url', {
      header: 'URL',
      cell: i => (
        <a href={i.getValue()} target="_blank" rel="noopener" className="url-link">
          {i.getValue()}
        </a>
      ),
    }),
    col.accessor('emails', {
      header: 'Emails',
      cell: i => <BadgeList items={i.getValue()} />,
    }),
    col.accessor('phones', {
      header: 'Phones',
      cell: i => <BadgeList items={i.getValue()} />,
    }),
  ], [])

  const table = useReactTable({ data: results, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="results-card">
      <div className="mobile-cards">
        {results.map((r, i) => (
          <div key={i} className="result-item">
            <div className="result-item-header">
              <span className="result-item-num">{i + 1}</span>
              <span className="result-item-label">Lead</span>
            </div>
            <div className="result-item-url">
              <a href={r.url} target="_blank" rel="noopener">{r.url}</a>
            </div>
            <div className="result-item-section">
              <div className="result-item-section-label">Emails</div>
              <BadgeList items={r.emails} />
            </div>
            <div className="result-item-section">
              <div className="result-item-section-label">Phones</div>
              <BadgeList items={r.phones} />
            </div>
          </div>
        ))}
      </div>
      <table className="desktop-table">
        <thead>
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
