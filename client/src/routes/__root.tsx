import { Outlet } from '@tanstack/react-router'

export function RootLayout() {
  return (
    <>
      <Outlet />
      <div id="toaster" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none" />
    </>
  )
}

export function toast(message: string) {
  const el = document.getElementById('toaster')
  if (!el) return
  const t = document.createElement('div')
  t.className =
    'pointer-events-auto px-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-sm text-zinc-900 shadow-lg animate-fade-up'
  t.textContent = message
  el.appendChild(t)
  setTimeout(() => t.remove(), 2600)
}
