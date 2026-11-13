/** Formatting helpers. All money is integer PKR (no paisa). */
const pkr = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 })

export const formatPKR = (amount: number): string => `Rs ${pkr.format(amount)}`

const karachiTime = new Intl.DateTimeFormat('en-PK', {
  timeZone: 'Asia/Karachi',
  hour: 'numeric',
  minute: '2-digit',
})

/** Display a stored UTC instant in Karachi local time. */
export const formatKarachiTime = (iso: string): string => karachiTime.format(new Date(iso))

export const formatWindow = (startIso: string, endIso: string): string =>
  `${formatKarachiTime(startIso)} – ${formatKarachiTime(endIso)}`
