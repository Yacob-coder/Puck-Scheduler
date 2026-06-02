import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import styles from './LeagueSetup.module.css'

const AGE_GROUPS = ['U7', 'U9', 'U11', 'U13', 'U15', 'U18'] as const
const TIERS = ['AAA', 'AA', 'A', 'B'] as const

type AgeGroup = typeof AGE_GROUPS[number] | ''
type Tier = typeof TIERS[number] | ''
type Team = { id: string; name: string }
type Division = { id: string; ageGroup: AgeGroup; tier: Tier; teams: Team[] }

let nextId = 100
function uid() { return String(nextId++) }

const INITIAL_DIVISIONS: Division[] = [
  {
    id: '1',
    ageGroup: 'U13',
    tier: 'AA',
    teams: [
      { id: '11', name: 'Lakeside Lightning' },
      { id: '12', name: 'Riverside Rockets' },
      { id: '13', name: 'Northside Wolves' },
      { id: '14', name: 'Central Storm' },
    ],
  },
  {
    id: '2',
    ageGroup: 'U15',
    tier: 'A',
    teams: [
      { id: '21', name: 'Eastside Eagles' },
      { id: '22', name: 'Westfield Bears' },
      { id: '23', name: 'Valley Vipers' },
    ],
  },
  {
    id: '3',
    ageGroup: 'U18',
    tier: 'B',
    teams: [
      { id: '31', name: 'Ridgecrest Falcons' },
      { id: '32', name: 'Harborview Sharks' },
      { id: '33', name: 'Pinewood Panthers' },
      { id: '34', name: 'Summit Stallions' },
    ],
  },
]

function divisionLabel(div: Division) {
  if (!div.ageGroup && !div.tier) return 'New division'
  return [div.ageGroup, div.tier].filter(Boolean).join(' ')
}

export function LeagueSetup() {
  const [seasonName, setSeasonName] = useState('Winter 2024–25')
  const [startDate, setStartDate] = useState('2024-10-01')
  const [endDate, setEndDate] = useState('2025-03-30')
  const [divisions, setDivisions] = useState<Division[]>(INITIAL_DIVISIONS)

  function addDivision() {
    setDivisions(prev => [
      ...prev,
      { id: uid(), ageGroup: '', tier: '', teams: [{ id: uid(), name: '' }] },
    ])
  }

  function removeDivision(divId: string) {
    setDivisions(prev => prev.filter(d => d.id !== divId))
  }

  function updateDivision(divId: string, patch: Partial<Pick<Division, 'ageGroup' | 'tier'>>) {
    setDivisions(prev => prev.map(d => d.id === divId ? { ...d, ...patch } : d))
  }

  function addTeam(divId: string) {
    setDivisions(prev =>
      prev.map(d =>
        d.id === divId
          ? { ...d, teams: [...d.teams, { id: uid(), name: '' }] }
          : d
      )
    )
  }

  function removeTeam(divId: string, teamId: string) {
    setDivisions(prev =>
      prev.map(d =>
        d.id === divId
          ? { ...d, teams: d.teams.filter(t => t.id !== teamId) }
          : d
      )
    )
  }

  function updateTeamName(divId: string, teamId: string, name: string) {
    setDivisions(prev =>
      prev.map(d =>
        d.id === divId
          ? { ...d, teams: d.teams.map(t => t.id === teamId ? { ...t, name } : t) }
          : d
      )
    )
  }

  const totalTeams = divisions.reduce((n, d) => n + d.teams.length, 0)

  return (
    <>
      <PageHeader
        title="League setup"
        subtitle="Add your divisions, teams, and season dates. You can change these any time before generating."
        withMesh
        action={<Button>Save draft</Button>}
      />

      <div className={styles.stack}>

        {/* ── Season dates ── */}
        <Card variant="feature">
          <h2 className={styles.sectionTitle}>Season</h2>
          <p className={styles.sectionHint}>Set the window your schedule will fall within.</p>
          <div className={styles.seasonGrid}>
            <Input
              label="Season name"
              value={seasonName}
              onChange={e => setSeasonName(e.target.value)}
              placeholder="e.g. Winter 2024–25"
            />
            <Input
              label="Start date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
            <Input
              label="End date"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </Card>

        {/* ── Divisions & teams ── */}
        <Card variant="feature">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Divisions &amp; teams</h2>
              <p className={styles.sectionHint}>
                {divisions.length} division{divisions.length !== 1 ? 's' : ''} · {totalTeams} team{totalTeams !== 1 ? 's' : ''}
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={addDivision}>
              + Add division
            </Button>
          </div>

          <div className={styles.divisionList}>
            {divisions.map((div, divIdx) => (
              <div key={div.id} className={styles.division}>
                <div className={styles.divisionHeader}>
                  <span className={styles.divisionIndex}>{divIdx + 1}</span>

                  <div className={styles.divisionPickers}>
                    <div className={styles.selectWrap}>
                      <label className={styles.selectLabel}>Age group</label>
                      <select
                        className={styles.select}
                        value={div.ageGroup}
                        onChange={e => updateDivision(div.id, { ageGroup: e.target.value as AgeGroup })}
                        aria-label="Age group"
                      >
                        <option value="">Age group</option>
                        {AGE_GROUPS.map(ag => (
                          <option key={ag} value={ag}>{ag}</option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.selectWrap}>
                      <label className={styles.selectLabel}>Tier</label>
                      <select
                        className={styles.select}
                        value={div.tier}
                        onChange={e => updateDivision(div.id, { tier: e.target.value as Tier })}
                        aria-label="Tier"
                      >
                        <option value="">Tier</option>
                        {TIERS.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <span className={styles.divisionLabelPreview}>
                      {divisionLabel(div)}
                    </span>
                  </div>

                  <button
                    className={styles.removeBtn}
                    onClick={() => removeDivision(div.id)}
                    aria-label="Remove division"
                    title="Remove division"
                  >
                    ✕
                  </button>
                </div>

                <div className={styles.teamList}>
                  {div.teams.map((team, teamIdx) => (
                    <div key={team.id} className={styles.teamRow}>
                      <span className={styles.teamIndex}>{teamIdx + 1}</span>
                      <input
                        className={styles.teamInput}
                        value={team.name}
                        onChange={e => updateTeamName(div.id, team.id, e.target.value)}
                        placeholder="Team name"
                        aria-label="Team name"
                      />
                      {div.teams.length > 1 && (
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeTeam(div.id, team.id)}
                          aria-label="Remove team"
                          title="Remove team"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    className={styles.addTeamBtn}
                    onClick={() => addTeam(div.id)}
                  >
                    + Add team
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── CSV import stub ── */}
        <Card variant="soft">
          <div className={styles.csvRow}>
            <div className={styles.csvText}>
              <div className={styles.csvTitleRow}>
                <span className={styles.csvTitle}>Import from CSV</span>
                <Badge variant="neutral">Coming soon</Badge>
              </div>
              <p className={styles.csvHint}>
                Have 20+ teams? Entering them one by one is tedious. We're building a CSV import so you can paste in a spreadsheet in seconds.
              </p>
            </div>
            <Button variant="secondary" size="sm" disabled>
              Import CSV
            </Button>
          </div>
        </Card>

      </div>
    </>
  )
}
