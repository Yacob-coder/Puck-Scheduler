import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import styles from './Generate.module.css'

type Phase = 'idle' | 'running' | 'success' | 'partial'

const STEPS = [
  'Loading season data',
  'Applying blackout dates',
  'Distributing matchups across slots',
  'Balancing day-of-week fairness',
  'Checking repeat matchup limits',
  'Finalising schedule',
]

const TRADE_OFFS = [
  {
    rule: 'Repeat matchup limit',
    what: 'Lakeside Lightning vs Eastside Eagles are scheduled 3 times — your limit is 2.',
    why: 'With 15 slots across 11 teams, there aren\'t enough spread opportunities to keep every cross-division matchup under 2 times.',
    fix: 'Raise the repeat-matchup limit to 3, or add more ice slots to create room.',
    fixRoute: 'constraints',
  },
  {
    rule: 'Day-of-week balance',
    what: 'Valley Vipers play 4 of their 5 games on weekdays.',
    why: 'The U15 A division has only 2 weekend slots allocated — not enough to balance 3 teams evenly across the week.',
    fix: 'Add weekend slots for this division on the Slots screen, or loosen the day-balance rule.',
    fixRoute: 'slots',
  },
]

const SUCCESS_SCORES = { overall: 94, slotEquity: 96, matchupSpread: 91, dayBalance: 94 }
const PARTIAL_SCORES = { overall: 71, slotEquity: 82, matchupSpread: 58, dayBalance: 74 }

function scoreClass(n: number) {
  if (n >= 90) return styles.green
  if (n >= 70) return styles.amber
  return styles.red
}

/* ── Icons ─────────────────────────────────────────── */
const IconZap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
    strokeLinecap="round" strokeLinejoin="round" className={styles.zapIcon}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const IconCheck = () => (
  <svg viewBox="0 0 20 20" fill="none" className={styles.stepIcon}>
    <circle cx="10" cy="10" r="9" fill="#d1fae5" />
    <polyline points="6 10 9 13 14 7" stroke="#065f46" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconSpinning = () => (
  <svg viewBox="0 0 20 20" fill="none" className={`${styles.stepIcon} ${styles.spinning}`}>
    <circle cx="10" cy="10" r="8" stroke="var(--color-primary-bg-subdued)" strokeWidth="2" />
    <path d="M10 2 A8 8 0 0 1 18 10" stroke="var(--color-primary)" strokeWidth="2"
      strokeLinecap="round" />
  </svg>
)

const IconDot = () => (
  <svg viewBox="0 0 20 20" fill="none" className={styles.stepIcon}>
    <circle cx="10" cy="10" r="3" fill="var(--color-hairline)" />
  </svg>
)

const IconSuccess = () => (
  <svg viewBox="0 0 48 48" fill="none" className={styles.resultIcon}>
    <circle cx="24" cy="24" r="22" fill="#d1fae5" />
    <polyline points="14 24 21 31 34 17" stroke="#065f46" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconWarning = () => (
  <svg viewBox="0 0 48 48" fill="none" className={styles.resultIcon}>
    <circle cx="24" cy="24" r="22" fill="#fef3c7" />
    <line x1="24" y1="16" x2="24" y2="27" stroke="#92400e" strokeWidth="2.5"
      strokeLinecap="round" />
    <circle cx="24" cy="33" r="1.5" fill="#92400e" />
  </svg>
)

/* ── Main component ─────────────────────────────────── */
export function Generate() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const demo = searchParams.get('demo') as 'success' | 'partial' | null

  const [phase, setPhase] = useState<Phase>(
    demo === 'success' ? 'success' : demo === 'partial' ? 'partial' : 'idle'
  )
  const [stepIndex, setStepIndex] = useState(0)
  const [outcome, setOutcome] = useState<'success' | 'partial'>('success')

  useEffect(() => {
    if (phase !== 'running') return
    if (stepIndex >= STEPS.length) {
      const t = setTimeout(() => setPhase(outcome), 800)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setStepIndex(i => i + 1), 720)
    return () => clearTimeout(t)
  }, [phase, stepIndex, outcome])

  function start(o: 'success' | 'partial' = 'success') {
    setOutcome(o)
    setStepIndex(0)
    setPhase('running')
  }

  function reset() {
    setPhase('idle')
    setStepIndex(0)
  }

  const progressPct = Math.min(100, Math.round((stepIndex / STEPS.length) * 100))
  const scores = phase === 'partial' ? PARTIAL_SCORES : SUCCESS_SCORES

  return (
    <>
      <PageHeader
        title="Generate schedule"
        subtitle="We'll find the fairest arrangement for your teams and slots."
        withMesh
      />

      <div className={styles.content}>

        {/* ─── IDLE ─────────────────────────────── */}
        {phase === 'idle' && (
          <Card variant="feature">
            <div className={styles.idleWrap}>
              <div className={styles.idleLeft}>
                <div className={styles.idleIconWrap}><IconZap /></div>
                <h2 className={styles.idleTitle}>Ready to generate</h2>
                <p className={styles.idleDesc}>
                  The engine will assign your teams to their allocated slots — spreading good and bad times as fairly as possible across every team.
                </p>
                <Button onClick={() => start('success')} className={styles.generateBtn}>
                  Generate schedule
                </Button>
                <p className={styles.timing}>Usually takes 10–30 seconds.</p>
              </div>

              <div className={styles.idleRight}>
                <div className={styles.summaryLabel}>Using</div>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryNum}>15</span>
                    <span className={styles.summaryUnit}>ice slots</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryNum}>11</span>
                    <span className={styles.summaryUnit}>teams</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryNum}>3</span>
                    <span className={styles.summaryUnit}>divisions</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryNum}>3</span>
                    <span className={styles.summaryUnit}>active rules</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryNum}>6</span>
                    <span className={styles.summaryUnit}>blackout dates</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryNum}>2</span>
                    <span className={styles.summaryUnit}>rinks</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.demoStrip}>
              <span className={styles.demoLabel}>Preview result:</span>
              <button className={styles.demoLink} onClick={() => start('success')}>
                Clean schedule
              </button>
              <span className={styles.demoDivider}>·</span>
              <button className={styles.demoLink} onClick={() => start('partial')}>
                With trade-offs
              </button>
            </div>
          </Card>
        )}

        {/* ─── RUNNING ──────────────────────────── */}
        {phase === 'running' && (
          <Card variant="feature">
            <div className={styles.runningWrap}>
              <p className={styles.runningTitle}>Generating your schedule…</p>

              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
              </div>
              <p className={styles.progressLabel}>{progressPct}%</p>

              <div className={styles.stepList}>
                {STEPS.map((step, i) => {
                  const done   = i < stepIndex
                  const active = i === stepIndex
                  return (
                    <div
                      key={step}
                      className={[
                        styles.stepRow,
                        done   ? styles.stepDone   : '',
                        active ? styles.stepActive : '',
                        !done && !active ? styles.stepWaiting : '',
                      ].filter(Boolean).join(' ')}
                    >
                      {done   && <IconCheck />}
                      {active && <IconSpinning />}
                      {!done && !active && <IconDot />}
                      <span>{step}</span>
                    </div>
                  )
                })}
              </div>

              <Button variant="ghost" size="sm" onClick={reset} className={styles.cancelBtn}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* ─── SUCCESS ──────────────────────────── */}
        {phase === 'success' && (
          <div className={styles.resultStack}>
            <Card variant="feature">
              <div className={styles.resultHeader}>
                <IconSuccess />
                <div>
                  <h2 className={styles.resultTitle}>Schedule generated</h2>
                  <p className={styles.resultDesc}>
                    All 15 slots assigned. Every team has a full fixture list.
                  </p>
                </div>
              </div>

              <div className={styles.scoreBand}>
                <div className={styles.overallScore}>
                  <span className={`${styles.scoreNum} ${scoreClass(scores.overall)}`}>
                    {scores.overall}
                  </span>
                  <div className={styles.scoreLabel}>
                    <span className={styles.scoreDenom}>/100</span>
                    <span className={styles.scoreName}>Fairness score</span>
                  </div>
                </div>
                <div className={styles.subScores}>
                  {[
                    { label: 'Slot equity',      v: scores.slotEquity },
                    { label: 'Matchup spread',   v: scores.matchupSpread },
                    { label: 'Day balance',      v: scores.dayBalance },
                  ].map(({ label, v }) => (
                    <div key={label} className={styles.subScore}>
                      <span className={`${styles.subScoreNum} ${scoreClass(v)}`}>{v}</span>
                      <span className={styles.subScoreLabel}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.resultActions}>
                <Button onClick={() => navigate(`/seasons/${id}/report`)}>
                  View Fairness Report →
                </Button>
                <Button variant="secondary" onClick={() => navigate(`/seasons/${id}/schedule`)}>
                  View Schedule
                </Button>
              </div>
            </Card>

            <div className={styles.regenRow}>
              <button className={styles.regenLink} onClick={reset}>Regenerate</button>
            </div>
          </div>
        )}

        {/* ─── PARTIAL / OVER-CONSTRAINED ───────── */}
        {phase === 'partial' && (
          <div className={styles.resultStack}>
            <Card variant="feature">
              <div className={styles.resultHeader}>
                <IconWarning />
                <div>
                  <h2 className={styles.resultTitle}>Schedule generated with trade-offs</h2>
                  <p className={styles.resultDesc}>
                    All 15 slots were assigned, but I had to relax 2 rules to make it work. Here's exactly what happened and how to fix it.
                  </p>
                </div>
              </div>

              <div className={`${styles.scoreBand} ${styles.scoreBandAmber}`}>
                <div className={styles.overallScore}>
                  <span className={`${styles.scoreNum} ${scoreClass(scores.overall)}`}>
                    {scores.overall}
                  </span>
                  <div className={styles.scoreLabel}>
                    <span className={styles.scoreDenom}>/100</span>
                    <span className={styles.scoreName}>Fairness score</span>
                  </div>
                </div>
                <div className={styles.subScores}>
                  {[
                    { label: 'Slot equity',      v: scores.slotEquity },
                    { label: 'Matchup spread',   v: scores.matchupSpread },
                    { label: 'Day balance',      v: scores.dayBalance },
                  ].map(({ label, v }) => (
                    <div key={label} className={styles.subScore}>
                      <span className={`${styles.subScoreNum} ${scoreClass(v)}`}>{v}</span>
                      <span className={styles.subScoreLabel}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.tradeOffList}>
                <p className={styles.tradeOffIntro}>What was relaxed:</p>
                {TRADE_OFFS.map((t) => (
                  <div key={t.rule} className={styles.tradeOffCard}>
                    <div className={styles.tradeOffRule}>
                      {t.rule}
                    </div>
                    <p className={styles.tradeOffWhat}>{t.what}</p>
                    <p className={styles.tradeOffWhy}>{t.why}</p>
                    <div className={styles.tradeOffFix}>
                      <span className={styles.tradeOffFixLabel}>To fix:</span> {t.fix}
                      <button
                        className={styles.tradeOffFixLink}
                        onClick={() => navigate(`/seasons/${id}/${t.fixRoute}`)}
                      >
                        Go →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.resultActions}>
                <Button onClick={() => navigate(`/seasons/${id}/report`)}>
                  View Fairness Report →
                </Button>
                <Button variant="secondary" onClick={() => navigate(`/seasons/${id}/constraints`)}>
                  Adjust rules
                </Button>
              </div>
            </Card>

            <div className={styles.regenRow}>
              <button className={styles.regenLink} onClick={reset}>Regenerate</button>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
