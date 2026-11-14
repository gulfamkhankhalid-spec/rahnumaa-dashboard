import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { levelName, type LevelKey } from './data'

export { Modal, Empty } from '../academy/ui'

/** Reads text aloud with the browser's speech engine, where available. */
export function Speak({ text, label = 'Listen' }: { text: string; label?: string }) {
  const [speaking, setSpeaking] = useState(false)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  useEffect(() => () => { if (supported) window.speechSynthesis.cancel() }, [supported])
  if (!supported) return null
  function toggle() {
    const synth = window.speechSynthesis
    if (speaking) { synth.cancel(); setSpeaking(false); return }
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.95
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    synth.cancel()
    synth.speak(u)
    setSpeaking(true)
  }
  return (
    <button type="button" className={`sd-speak ${speaking ? 'on' : ''}`} onClick={toggle} aria-pressed={speaking}>
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4Z" fill="currentColor" /></svg>
      {speaking ? 'Stop' : label}
    </button>
  )
}

export function LevelPill({ level }: { level: LevelKey }) {
  return <span className={`sd-level sd-${level}`}>{levelName[level]}</span>
}

export function Ring({ pct, size = 56, label }: { pct: number; size?: number; label?: string }) {
  const r = (size - 8) / 2
  const c = 2 * Math.PI * r
  return (
    <span className="sd-ring" style={{ width: size, height: size }} role="img" aria-label={`${pct}% ${label ?? 'complete'}`}>
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--tint)" strokeWidth="6" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--brand)" strokeWidth="6" fill="none" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <strong>{pct}%</strong>
    </span>
  )
}

export function Check({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return <li className={ok ? 'ok' : ''}><span>{ok ? <Icon name="check" size={12} /> : ''}</span>{children}</li>
}

/** Downloads a calendar file for one session. */
export function icsHref(title: string, date: string, time: string, hours: number, where: string) {
  const [h, m] = time.split(':').map(Number)
  const start = `${date.replace(/-/g, '')}T${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`
  const endH = h + Math.floor(hours)
  const endM = m + Math.round((hours % 1) * 60)
  const end = `${date.replace(/-/g, '')}T${String(endH + Math.floor(endM / 60)).padStart(2, '0')}${String(endM % 60).padStart(2, '0')}00`
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Rahnuma//SDC//EN', 'BEGIN:VEVENT', `UID:${date}-${time}-${Math.random().toString(36).slice(2)}@rahnumaa.com`, `DTSTART;TZID=Asia/Karachi:${start}`, `DTEND;TZID=Asia/Karachi:${end}`, `SUMMARY:${title}`, `LOCATION:${where}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
  return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(body)
}
