import { useCallback, useEffect, useState } from 'react'

export type LoadStatus = 'loading' | 'ready' | 'error'

/**
 * Simulates loading offers. Phase 2 replaces this with a real query.
 * Open the app with the URL hash #simulate-error to see the network-error state.
 */
export function useOffersStatus(delayMs = 450) {
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    setStatus('loading')
    const id = setTimeout(() => setStatus(window.location.hash === '#simulate-error' ? 'error' : 'ready'), delayMs)
    return () => clearTimeout(id)
  }, [attempt, delayMs])
  const retry = useCallback(() => {
    if (window.location.hash === '#simulate-error') history.replaceState(null, '', window.location.pathname + window.location.search)
    setAttempt((a) => a + 1)
  }, [])
  return { status, retry }
}
