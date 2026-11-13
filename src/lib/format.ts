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

/** "9:00 – 11:00 pm": the am/pm marker is shown once when both ends share it. */
export const formatWindow = (startIso: string, endIso: string): string => {
  const [start, end] = [formatKarachiTime(startIso), formatKarachiTime(endIso)]
  const [sTime, sMark] = start.split(' ')
  const [, eMark] = end.split(' ')
  return sMark === eMark ? `${sTime} – ${end}` : `${start} – ${end}`
}
