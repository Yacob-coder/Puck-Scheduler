import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import styles from './Constraints.module.css'

/* ─── Types ─── */
type BlackoutEntry = { id: string; scope: string; date: string; note: string }

/* ─── Sample data ─── */
const TEAM_GROUPS = [
  { division: 'U13 AA', teams: ['Lakeside Lightning', 'Riverside Rockets', 'Northside Wolves', 'Central Storm'] },
  { division: 'U15 A',  teams: ['Eastside Eagles', 'Westfield Bears', 'Valley Vipers'] },
  { division: 'U18 B',  teams: ['Ridgecrest Falcons', 'Harborview Sharks', 'Pinewood Panthers', 'Summit Stallions'] },
]

const INITIAL_BLACKOUTS: BlackoutEntry[] = [
  { id: '1', scope: 'league',             date: '2024-12-24', note: 'Christmas Eve' },
  { id: '2', scope: 'league',             date: '2024-12-25', note: 'Christmas Day' },
  { id: '3', scope: 'league',             date: '2024-12-31', note: "New Year's Eve" },
  { id: '4', scope: 'league',             date: '2025-01-01', note: "New Year's Day" },
  { id: '5', scope: 'Lakeside Lightning', date: '2024-11-09', note: 'Tournament weekend' },
  { id: '6', scope: 'Eastside Eagles',    date: '2024-11-23', note: 'Tournament' },
]

let nextId = 300
function uid() { return String(nextId++) }

function fmtDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

/* ─── Small reusable toggle ─── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      className={[styles.toggle, checked ? styles.toggleOn : ''].filter(Boolean).join(' ')}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.toggleThumb} />
    </button>
  )
}

/* ─── Stepper ─── */
function Stepper({ value, min = 1, max = 10, onChange }: {
  value: number; min?: number; max?: number; onChange: (v: number) => void
}) {
  return (
    <div className={styles.stepper}>
      <button
        className={styles.stepBtn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >−</button>
      <span className={styles.stepValue}>{value}</span>
      <button
        className={styles.stepBtn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >+</button>
    </div>
  )
}

/* ─── Chevron icon ─── */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={[styles.chevron, open ? styles.chevronOpen : ''].filter(Boolean).join(' ')}
      viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.75}
      strokeLinecap="round" strokeLinejoin="round"
    >
      <polyline points="4 6 8 10 12 6" />
    </svg>
  )
}

/* ─── Main component ─── */
export function Constraints() {
  /* Primary rules */
  const [dayBalance, setDayBalance]         = useState(true)
  const [repeatEnabled, setRepeatEnabled]   = useState(true)
  const [avoidBackToBack, setAvoidBackToBack] = useState(true)
  const [maxRepeat, setMaxRepeat]           = useState(2)

  /* Blackouts */
  const [blackouts, setBlackouts]           = useState<BlackoutEntry[]>(INITIAL_BLACKOUTS)
  const [addingBlackout, setAddingBlackout] = useState(false)
  const [newScope, setNewScope]             = useState('league')
  const [newDate, setNewDate]               = useState('')
  const [newNote, setNewNote]               = useState('')

  /* Advanced */
  const [showAdvanced, setShowAdvanced]     = useState(false)
  const [travelTime, setTravelTime]         = useState(false)
  const [minTravelMins, setMinTravelMins]   = useState(30)

  function removeBlackout(id: string) {
    setBlackouts(prev => prev.filter(b => b.id !== id))
  }

  function confirmAddBlackout() {
    if (!newDate) return
    setBlackouts(prev => [...prev, { id: uid(), scope: newScope, date: newDate, note: newNote.trim() }])
    setNewDate('')
    setNewNote('')
    setNewScope('league')
    setAddingBlackout(false)
  }

  const sortedBlackouts = [...blackouts].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <>
      <PageHeader
        title="Fairness rules"
        subtitle="Set the guardrails. Sensible defaults are already in place — change only what your league needs."
        withMesh
        action={<Button>Save rules</Button>}
      />

      <div className={styles.stack}>

        {/* ── 1. Day-of-week balance ── */}
        <Card variant="feature">
          <div className={styles.constraintHeader}>
            <div>
              <h2 className={styles.constraintTitle}>Day-of-week balance</h2>
              <p className={styles.constraintDesc}>
                No team should be stuck playing on the same day of the week all season. We'll spread games across the week as evenly as your slots allow.
              </p>
            </div>
            <Toggle checked={dayBalance} onChange={setDayBalance} />
          </div>
          {dayBalance && (
            <div className={styles.constraintBody}>
              <div className={styles.ruleNote}>
                The engine will try to give each team a balanced mix of weekday and weekend games. No manual setup required.
              </div>
            </div>
          )}
        </Card>

        {/* ── 2. Repeat matchups ── */}
        <Card variant="feature">
          <div className={styles.constraintHeader}>
            <div>
              <h2 className={styles.constraintTitle}>Repeat matchups</h2>
              <p className={styles.constraintDesc}>
                Keep the schedule feeling fresh. Limit how often the same two teams face each other, and avoid putting them back-to-back.
              </p>
            </div>
            <Toggle checked={repeatEnabled} onChange={setRepeatEnabled} />
          </div>

          {repeatEnabled && (
            <div className={styles.constraintBody}>
              <div className={styles.subControl}>
                <div className={styles.subControlRow}>
                  <div className={styles.subControlText}>
                    <span className={styles.subLabel}>Avoid back-to-back opponents</span>
                    <span className={styles.subHint}>
                      The same two teams won't be scheduled against each other in consecutive games.
                    </span>
                  </div>
                  <Toggle checked={avoidBackToBack} onChange={setAvoidBackToBack} />
                </div>
              </div>

              <div className={styles.subControl}>
                <div className={styles.subControlRow}>
                  <div className={styles.subControlText}>
                    <span className={styles.subLabel}>Limit how often the same matchup repeats</span>
                    <span className={styles.subHint}>
                      Same two teams play each other at most this many times per season.
                    </span>
                  </div>
                  <div className={styles.stepperRow}>
                    <Stepper value={maxRepeat} min={1} max={6} onChange={setMaxRepeat} />
                    <span className={styles.stepperUnit}>times</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* ── 3. Blackout dates ── */}
        <Card variant="feature">
          <div className={styles.constraintHeader}>
            <div>
              <h2 className={styles.constraintTitle}>Blackout dates</h2>
              <p className={styles.constraintDesc}>
                Dates when a team or the whole league can't play — holidays, tournaments, venue closures. The engine will work around them.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAddingBlackout(v => !v)}
            >
              {addingBlackout ? 'Cancel' : '+ Add date'}
            </Button>
          </div>

          {sortedBlackouts.length > 0 && (
            <div className={styles.blackoutList}>
              <div className={styles.blackoutHead}>
                <span>Scope</span>
                <span>Date</span>
                <span>Note</span>
                <span />
              </div>
              {sortedBlackouts.map(b => (
                <div key={b.id} className={styles.blackoutRow}>
                  <span>
                    {b.scope === 'league'
                      ? <span className={styles.leagueTag}>Whole league</span>
                      : <span className={styles.teamTag}>{b.scope}</span>}
                  </span>
                  <span className={styles.blackoutDate}>{fmtDate(b.date)}</span>
                  <span className={styles.blackoutNote}>{b.note}</span>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeBlackout(b.id)}
                    title="Remove"
                  >✕</button>
                </div>
              ))}
            </div>
          )}

          {sortedBlackouts.length === 0 && !addingBlackout && (
            <p className={styles.emptyHint}>No blackout dates yet.</p>
          )}

          {addingBlackout && (
            <div className={styles.addBlackoutForm}>
              <select
                className={styles.addSelect}
                value={newScope}
                onChange={e => setNewScope(e.target.value)}
              >
                <option value="league">Whole league</option>
                {TEAM_GROUPS.map(g => (
                  <optgroup key={g.division} label={g.division}>
                    {g.teams.map(t => <option key={t} value={t}>{t}</option>)}
                  </optgroup>
                ))}
              </select>
              <input
                type="date"
                className={styles.addInput}
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
              />
              <input
                type="text"
                className={styles.addInput}
                placeholder="Note (optional)"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') confirmAddBlackout() }}
              />
              <Button size="sm" onClick={confirmAddBlackout} disabled={!newDate}>
                Add
              </Button>
            </div>
          )}
        </Card>

        {/* ── Advanced section ── */}
        <button
          className={styles.advancedToggle}
          onClick={() => setShowAdvanced(v => !v)}
        >
          <Chevron open={showAdvanced} />
          Advanced settings
          <span className={styles.advancedHint}>Travel time between rinks</span>
        </button>

        {showAdvanced && (
          <Card variant="feature">
            <div className={styles.constraintHeader}>
              <div>
                <h2 className={styles.constraintTitle}>Travel time between rinks</h2>
                <p className={styles.constraintDesc}>
                  Only needed if your league uses multiple rinks. Ensures teams have enough travel time between back-to-back games at different venues.
                </p>
              </div>
              <Toggle checked={travelTime} onChange={setTravelTime} />
            </div>

            {travelTime && (
              <div className={styles.constraintBody}>
                <div className={styles.subControl}>
                  <div className={styles.subControlRow}>
                    <div className={styles.subControlText}>
                      <span className={styles.subLabel}>Minimum gap between games at different rinks</span>
                      <span className={styles.subHint}>
                        Teams won't be scheduled at a different rink within this window.
                      </span>
                    </div>
                    <div className={styles.stepperRow}>
                      <Stepper value={minTravelMins} min={15} max={120} onChange={setMinTravelMins} />
                      <span className={styles.stepperUnit}>min</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

      </div>
    </>
  )
}
