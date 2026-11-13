export function Toast({ message }: { message: string | null }) {
  return <div role="status" aria-live="polite">{message && <div className="toast">{message}</div>}</div>
}
