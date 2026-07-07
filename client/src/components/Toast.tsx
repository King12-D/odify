import { useEffect, useState, useCallback } from 'react'

let toastId = 0
const listeners: Set<(msg: string) => void> = new Set()

export function toast(msg: string) {
  listeners.forEach(fn => fn(msg))
}

export function ToastContainer() {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([])

  const add = useCallback((msg: string) => {
    const id = ++toastId
    setItems(prev => [...prev, { id, msg }])
    setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), 2600)
  }, [])

  useEffect(() => {
    listeners.add(add)
    return () => { listeners.delete(add) }
  }, [add])

  return (
    <div className="toast-container">
      {items.map(i => (
        <div key={i.id} className="toast">
          <span className="toast-icon">&#10003;</span>
          {i.msg}
        </div>
      ))}
    </div>
  )
}
