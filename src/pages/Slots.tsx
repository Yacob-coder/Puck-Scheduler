import { useState, useMemo } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import styles from './Slots.module.css'

type Desirability = 'high' | 'medium' | 'low'

type Slot = {
  id: string
  venue: string
  date: string       // YYYY-MM-DD
  startTime: string  // HH:MM (24h)
  durationMins: number
  override: Desirability | null
}

let nextId = 200
function uid() { return String(nextId++) }

// Weekend 9am–4pm = high. Weekday 5–9pm / weekend off-peak = medium.
// Before 7am or 9pm+ = low.
function computeDesirability(dateStr: string, timeStr: string): Desirability {
  if (!dateStr || !timeStr) return 'medium'
  const h = parseInt(timeStr.split(':')[0], 10)
  const day = new Date(dateStr + 'T12:00:00').getDay()
  const isWeekend = day === 0 || day === 6
  if (h < 7 || h >= 21) return 'low'
  if (isWeekend && h >= 9 && h < 16) return 'high'
  if (!isWeekend && h >= 17) return 'medium'
  if (isWeekend) return 'medium'
  return 'low'
}

function effectiveDesirability(slot: Slot): Desirability {
  return slot.override ?? computeDesirability(slot.date, slot.startTime)
}

function fmt12h(t: string) {
  const [hh, mm] = t.split(':').map(Number)
  return `${hh % 12 || 12}:${String(mm).padStart(2, '0')} ${hh >= 12 ? 'PM' : 'AM'}`
}

function fmtDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

function fmtDuration(m: number) {
  const h = Math.floor(m / 60)
  const rem = m % 60
  return rem === 0 ? `${h}h` : `${h}h ${rem}m`
}

const LABEL: Record<Desirability, string> = { high: 'High', medium: 'Medium', low: 'Low' }
const BADGE_CLASS: Record<Desirability, string> = {
  high: styles.badgeHigh,
  medium: styles.badgeMedium,
  low: styles.badgeLow,
}

const INITIAL_SLOTS: Slot[] = [
  { id: '1',  venue: 'Westside Arena',       date: '2024-10-01', startTime: '06:30', durationMins: 60, override: null },
  { id: '2',  venue: 'Westside Arena',       date: '2024-10-05', startTime: '13:00', durationMins: 75, override: null },
  { id: '3',  venue: 'Westside Arena',       date: '2024-10-06', startTime: '10:30', durationMins: 60, override: null },
  { id: '4',  venue: 'Westside Arena',       date: '2024-10-08', startTime: '19:00', durationMins: 60, override: null },
  { id: '5',  venue: 'Westside Arena',       date: '2024-10-10', startTime: '21:15', durationMins: 60, override: null },
  { id: '6',  venue: 'Westside Arena',       date: '2024-10-12', startTime: '08:00', durationMins: 60, override: null },
  { id: '7',  venue: 'Westside Arena',       date: '2024-10-13', startTime: '14:30', durationMins: 75, override: null },
  { id: '8',  venue: 'Westside Arena',       date: '2024-10-15', startTime: '18:00', durationMins: 60, override: null },
  { id: '9',  venue: 'Community Ice Centre', date: '2024-10-07', startTime: '06:00', durationMins: 60, override: null },
  { id: '10', venue: 'Community Ice Centre', date: '2024-10-09', startTime: '20:30', durationMins: 60, override: null },
  { id: '11', venue: 'Community Ice Centre', date: '2024-10-11', startTime: '22:00', durationMins: 60, override: null },
  { id: '12', venue: 'Community Ice Centre', date: '2024-10-12', startTime: '11:00', durationMins: 75, override: null },
  { id: '13', venue: 'Community Ice Centre', date: '2024-10-13', startTime: '09:00', durationMins: 60, override: null },
  { id: '14', venue: 'Community Ice Centre', date: '2024-10-16', startTime: '19:30', durationMins: 60, override: null },
  { id: '15', venue: 'Community Ice Centre', date: '2024-10-18', startTime: '18:00', durationMins: 60, override: null },
]

const INITIAL_VENUES = ['Westside Arena', 'Community Ice Centre']
const DURATION_OPTIONS = [60, 75, 90]

export function Slots() {
  const [slots, setSlots] = useState<Slot[]>(INITIAL_SLOTS)
  const [venues, setVenues] = useState<string[]>(INITIAL_VENUES)
  const [overridingId, setOverridingId] = useState<string | null>(null)
  const [addingSlotFor, setAddingSlotFor] = useState<string | null>(null)
  const [addForm, setAddForm] = useState({ date: '', time: '18:00', durationMins: 60 })
  const [addingVenue, setAddingVenue] = useState(false)
  const [newVenueName, setNewVenueName] = useState('')

  const grouped = useMemo(() => {
    const map = new Map<string, Slot[]>()
    for (const v of venues) map.set(v, [])
    for (const s of slots) {
      if (!map.has(s.venue)) map.set(s.venue, [])
      map.get(s.venue)!.push(s)
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
    }
    return map
  }, [slots, venues])

  const counts = useMemo(() => {
    const c = { high: 0, medium: 0, low: 0 }
    for (const s of slots) c[effectiveDesirability(s)]++
    return c
  }, [slots])

  function setOverride(slotId: string, value: Desirability | null) {
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, override: value } : s))
  }

  function removeSlot(slotId: string) {
    setSlots(prev => prev.filter(s => s.id !== slotId))
    if (overridingId === slotId) setOverridingId(null)
  }

  function startAddSlot(venue: string) {
    setAddingSlotFor(venue)
    setAddForm({ date: '', time: '18:00', durationMins: 60 })
    setOverridingId(null)
  }

  function confirmAddSlot() {
    if (!addingSlotFor || !addForm.date || !addForm.time) return
    setSlots(prev => [...prev, {
      id: uid(), venue: addingSlotFor,
      date: addForm.date, startTime: addForm.time,
      durationMins: addForm.durationMins, override: null,
    }])
    setAddingSlotFor(null)
  }

  function confirmAddVenue() {
    const name = newVenueName.trim()
    if (!name || venues.includes(name)) return
    setVenues(prev => [...prev, name])
    setNewVenueName('')
    setAddingVenue(false)
    startAddSlot(name)
  }

  return (
    <>
      <PageHeader
        title="Ice slots"
        subtitle="Enter the slots your rinks have given you. We'll score each one automatically so the schedule can spread them fairly."
        withMesh
        action={
          <Button onClick={() => { setAddingVenue(true); setAddingSlotFor(null) }}>
            + Add rink
          </Button>
        }
      />

      {/* ── Summary bar ── */}
      <div className={styles.summary}>
        <span className={styles.summaryCount}>
          {slots.length} slot{slots.length !== 1 ? 's' : ''} · {venues.length} rink{venues.length !== 1 ? 's' : ''}
        </span>
        <div className={styles.qualityBreakdown}>
          <span className={`${styles.qualityChip} ${styles.chipHigh}`}>
            <span className={styles.dot} />{counts.high} high
          </span>
          <span className={`${styles.qualityChip} ${styles.chipMedium}`}>
            <span className={styles.dot} />{counts.medium} medium
          </span>
          <span className={`${styles.qualityChip} ${styles.chipLow}`}>
            <span className={styles.dot} />{counts.low} low
          </span>
        </div>
      </div>

      <div className={styles.stack}>

        {/* ── Venue groups ── */}
        {[...grouped.entries()].map(([venue, venueSlots]) => (
          <Card key={venue} variant="feature">
            <div className={styles.venueHeader}>
              <div>
                <h2 className={styles.venueName}>{venue}</h2>
                <p className={styles.venueCount}>
                  {venueSlots.length} slot{venueSlots.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  addingSlotFor === venue ? setAddingSlotFor(null) : startAddSlot(venue)
                }
              >
                {addingSlotFor === venue ? 'Cancel' : '+ Add slot'}
              </Button>
            </div>

            {venueSlots.length > 0 && (
              <div className={styles.slotTable}>
                <div className={styles.slotHead}>
                  <span>Date</span>
                  <span>Time</span>
                  <span>Duration</span>
                  <span>Slot quality</span>
                  <span />
                </div>

                {venueSlots.map(slot => {
                  const quality = effectiveDesirability(slot)
                  const isOverriding = overridingId === slot.id

                  return (
                    <div key={slot.id} className={styles.slotRow}>
                      <span className={styles.dateCell}>{fmtDate(slot.date)}</span>
                      <span className={styles.timeCell}>{fmt12h(slot.startTime)}</span>
                      <span className={styles.durCell}>{fmtDuration(slot.durationMins)}</span>

                      <span className={styles.qualityCell}>
                        {isOverriding ? (
                          <span className={styles.overrideControl}>
                            <select
                              className={styles.overrideSelect}
                              value={slot.override ?? ''}
                              onChange={e => {
                                const v = e.target.value as Desirability | ''
                                setOverride(slot.id, v === '' ? null : v)
                              }}
                              autoFocus
                            >
                              <option value="">
                                Auto — {LABEL[computeDesirability(slot.date, slot.startTime)]}
                              </option>
                              <option value="high">High</option>
                              <option value="medium">Medium</option>
                              <option value="low">Low</option>
                            </select>
                            <button
                              className={styles.overrideDone}
                              onClick={() => setOverridingId(null)}
                            >
                              Done
                            </button>
                          </span>
                        ) : (
                          <span className={styles.qualityPill}>
                            <span className={`${styles.badge} ${BADGE_CLASS[quality]}`}>
                              {LABEL[quality]}
                            </span>
                            {slot.override !== null && (
                              <span className={styles.customTag}>custom</span>
                            )}
                            <button
                              className={styles.editBtn}
                              onClick={() => setOverridingId(slot.id)}
                              title="Override slot quality"
                            >
                              Edit
                            </button>
                          </span>
                        )}
                      </span>

                      <button
                        className={styles.removeBtn}
                        onClick={() => removeSlot(slot.id)}
                        title="Remove slot"
                      >
                        ✕
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {venueSlots.length === 0 && addingSlotFor !== venue && (
              <p className={styles.emptyHint}>
                No slots yet — add the times this rink has given you.
              </p>
            )}

            {addingSlotFor === venue && (
              <div className={styles.addSlotForm}>
                <input
                  type="date"
                  className={styles.addInput}
                  value={addForm.date}
                  onChange={e => setAddForm(f => ({ ...f, date: e.target.value }))}
                />
                <input
                  type="time"
                  className={styles.addInput}
                  value={addForm.time}
                  onChange={e => setAddForm(f => ({ ...f, time: e.target.value }))}
                />
                <select
                  className={styles.addSelect}
                  value={addForm.durationMins}
                  onChange={e => setAddForm(f => ({ ...f, durationMins: Number(e.target.value) }))}
                >
                  {DURATION_OPTIONS.map(d => (
                    <option key={d} value={d}>{fmtDuration(d)}</option>
                  ))}
                </select>
                {addForm.date && addForm.time && (
                  <span className={`${styles.badge} ${BADGE_CLASS[computeDesirability(addForm.date, addForm.time)]}`}>
                    {LABEL[computeDesirability(addForm.date, addForm.time)]}
                  </span>
                )}
                <Button
                  size="sm"
                  onClick={confirmAddSlot}
                  disabled={!addForm.date || !addForm.time}
                >
                  Add
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setAddingSlotFor(null)}>
                  Cancel
                </Button>
              </div>
            )}
          </Card>
        ))}

        {/* ── Add rink form ── */}
        {addingVenue && (
          <Card variant="soft">
            <div className={styles.addVenueForm}>
              <span className={styles.addVenueLabel}>New rink</span>
              <input
                className={styles.addInput}
                placeholder="e.g. Memorial Gardens"
                value={newVenueName}
                onChange={e => setNewVenueName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') confirmAddVenue() }}
                autoFocus
              />
              <Button size="sm" onClick={confirmAddVenue} disabled={!newVenueName.trim()}>
                Add rink
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setAddingVenue(false); setNewVenueName('') }}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* ── Quality legend ── */}
        <Card variant="soft">
          <div className={styles.legend}>
            <span className={styles.legendTitle}>How slot quality is scored</span>
            <div className={styles.legendItems}>
              <div className={styles.legendItem}>
                <span className={`${styles.badge} ${styles.badgeHigh}`}>High</span>
                <span className={styles.legendText}>Weekend, 9 AM – 4 PM</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.badge} ${styles.badgeMedium}`}>Medium</span>
                <span className={styles.legendText}>Weekday evenings 5 – 9 PM · Weekend outside prime hours</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.badge} ${styles.badgeLow}`}>Low</span>
                <span className={styles.legendText}>Before 7 AM or after 9 PM any day</span>
              </div>
            </div>
            <p className={styles.legendNote}>
              Every team gets a fair share of high, medium, and low slots. If your rink's reality is different — weekend mornings are prime for your league — use the <strong>Edit</strong> button on any slot to override its quality.
            </p>
          </div>
        </Card>

      </div>
    </>
  )
}
