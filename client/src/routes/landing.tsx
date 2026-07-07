import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Download, Loader2, AlertCircle, Building2, Phone, MapPin, Check } from 'lucide-react'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table'
import { searchPlaces, csvUrl } from '../lib/api'
import { toast } from './__root'
import type { PlaceLead } from '../types'

const logs = [
  'Searching Google Places...',
  'Fetching business listings...',
  'Checking for websites...',
  'Filtering businesses without websites...',
  'Preparing results...',
]

export function IndexPage() {
  const [niche, setNiche] = useState('')
  const [location, setLocation] = useState('')
  const [maxResults, setMaxResults] = useState(30)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [leads, setLeads] = useState<PlaceLead[]>([])
  const [currentLogIdx, setCurrentLogIdx] = useState(0)
  const logTimer = useRef<ReturnType<typeof setInterval>>(undefined)

  useEffect(() => {
    if (loading) {
      setCurrentLogIdx(0)
      logTimer.current = setInterval(() => {
        setCurrentLogIdx(prev => Math.min(prev + 1, logs.length - 1))
      }, 2000)
    } else {
      clearInterval(logTimer.current)
    }
    return () => clearInterval(logTimer.current)
  }, [loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!niche.trim() || !location.trim()) return
    setLoading(true)
    setError(null)
    setSessionId(null)
    setLeads([])
    try {
      const data = await searchPlaces(niche.trim(), location.trim(), maxResults)
      setSessionId(data.session_id)
      setLeads(data.results)
      if (!data.results.length) {
        toast('No businesses without websites found — try different terms')
      } else {
        toast(`Found ${data.results.length} businesses without websites`)
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const progress = loading ? Math.min((currentLogIdx + 1) / logs.length * 100, 95) : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient glow */}
      <div className="fixed top-[-40vh] left-[-20vw] w-[60vw] h-[60vw] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-30vh] right-[-20vw] w-[50vw] h-[50vw] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm">O</div>
          <span className="font-heading font-semibold text-lg tracking-tight">Odify</span>
        </div>
      </nav>

      {/* Hero + Search */}
      <section className="relative z-10 px-6 pt-16 pb-12 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-subtle border border-primary/20 text-primary text-xs font-medium mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Google Places Lead Finder
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight tracking-tight">
            Find businesses that<br />
            <span className="gradient-text">need a website</span>
          </h1>
          <p className="mt-4 text-zinc-500 text-lg leading-relaxed">
            Search any niche and location to discover businesses on Google without a website.
            Perfect for web designers, agencies, and freelancers.
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-5 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Niche"
                    id="niche"
                    placeholder="e.g. Dentists, Plumbers, Restaurants"
                    value={niche}
                    onChange={e => setNiche(e.target.value)}
                    required
                  />
                  <Input
                    label="Location"
                    id="location"
                    placeholder="e.g. Austin, TX"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-wrap items-end gap-3">
                  <div className="w-28">
                    <Input
                      label="Max Results"
                      id="maxResults"
                      type="number"
                      value={maxResults}
                      onChange={e => setMaxResults(Number(e.target.value))}
                      min={1}
                      max={60}
                    />
                  </div>
                  <Button type="submit" disabled={loading || !niche.trim() || !location.trim()}>
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Searching...</>
                    ) : (
                      <><Search className="w-4 h-4" /> Find Leads</>
                    )}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => { setNiche(''); setLocation(''); setMaxResults(30); setSessionId(null); setLeads([]); setError(null) }}>
                    Clear
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Loading State */}
      <section className="relative z-10 px-6 max-w-4xl mx-auto">
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <Card>
                <CardContent className="p-5 md:p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    <span className="text-sm font-medium text-zinc-700">
                      Searching for <span className="text-primary capitalize">{niche}</span> in{' '}
                      <span className="text-primary capitalize">{location}</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full gradient-primary"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    {logs.map((log, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        {i < currentLogIdx ? (
                          <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                        ) : i === currentLogIdx ? (
                          <Loader2 className="w-3.5 h-3.5 text-primary animate-spin shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span className={
                          i < currentLogIdx ? 'text-zinc-400' :
                          i === currentLogIdx ? 'text-zinc-700' :
                          'text-zinc-300'
                        }>
                          {log}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Error State */}
      <section className="relative z-10 px-6 max-w-4xl mx-auto mt-4">
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <CardContent className="p-5 md:p-6 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Search failed</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{error}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Results */}
      <section className="relative z-10 px-6 pb-16 max-w-4xl mx-auto">
        <AnimatePresence>
          {leads.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-6">
              {/* Summary */}
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="info">{leads.length} businesses found</Badge>
                <Badge variant="warning">No website</Badge>
                {sessionId && (
                  <a
                    href={csvUrl(sessionId)}
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-primary text-white hover:bg-primary-hover transition-all glow-primary"
                  >
                    <Download className="w-4 h-4" /> Download CSV
                  </a>
                )}
              </div>

              {/* Table */}
              <div className="rounded-2xl border border-zinc-200 overflow-hidden bg-white shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8">#</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="hidden md:table-cell">Address</TableHead>
                      <TableHead className="w-16">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-zinc-400 font-mono text-xs">{i + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-zinc-400 shrink-0" />
                            <span className="font-medium text-zinc-900">{lead.name || '—'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {lead.phone ? (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                              <span className="text-sm text-zinc-700">{lead.phone}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-zinc-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {lead.address ? (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                              <span className="text-sm text-zinc-600 truncate max-w-[200px]">{lead.address}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-zinc-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {lead.phone && (
                            <button
                              onClick={() => { navigator.clipboard.writeText(lead.phone); toast('Phone copied!') }}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all text-xs"
                              title="Copy phone"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-200/50 px-6 py-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center text-white font-bold text-xs">O</div>
            Odify &copy; {new Date().getFullYear()}
          </div>
          <div className="text-sm text-zinc-400">
            Find businesses without websites — built for freelancers &amp; agencies
          </div>
        </div>
      </footer>
    </div>
  )
}
