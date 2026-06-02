import { NavLink, useParams } from 'react-router-dom'
import styles from './Sidebar.module.css'

/* ─── Inline SVG icons (Feather-style, MIT) ─── */
const IconHome = () => (
  <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const IconUsers = () => (
  <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
)

const IconCalendar = () => (
  <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const IconSliders = () => (
  <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
)

const IconZap = () => (
  <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const IconBarChart = () => (
  <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

const IconGrid = () => (
  <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
)

const IconSend = () => (
  <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const navClass = ({ isActive }: { isActive: boolean }) =>
  [styles.navItem, isActive ? styles.navItemActive : ''].filter(Boolean).join(' ')

const seasonSteps = [
  { to: 'setup',       label: 'League Setup',     Icon: IconUsers,    step: 1 },
  { to: 'slots',       label: 'Ice Slots',         Icon: IconCalendar, step: 2 },
  { to: 'constraints', label: 'Fairness Rules',    Icon: IconSliders,  step: 3 },
  { to: 'generate',    label: 'Generate',          Icon: IconZap,      step: 4 },
  { to: 'report',      label: 'Fairness Report',   Icon: IconBarChart, step: 5 },
  { to: 'schedule',    label: 'Schedule',          Icon: IconGrid,     step: 6 },
  { to: 'publish',     label: 'Publish',           Icon: IconSend,     step: 7 },
]

export function Sidebar() {
  const { id } = useParams<{ id: string }>()

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <NavLink to="/" className={styles.logoArea}>
        <svg className={styles.logoIcon} viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" fill="#533afd" />
          <ellipse cx="14" cy="19" rx="7" ry="2.5" fill="white" opacity="0.95" />
          <ellipse cx="14" cy="9" rx="7" ry="2.5" fill="none" stroke="white" strokeWidth="1.4" opacity="0.9" />
          <rect x="7" y="9" width="14" height="10" fill="none" stroke="white" strokeWidth="1.4" opacity="0.7" />
        </svg>
        <span className={styles.logoText}>
          Puck <span>Scheduler</span>
        </span>
      </NavLink>

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navSection}>
          <NavLink to="/" end className={navClass}>
            <IconHome />
            Dashboard
          </NavLink>
        </div>

        {id && (
          <div className={styles.navSection}>
            <div className={styles.navSectionLabel}>This season</div>
            {seasonSteps.map(({ to, label, step }) => (
              <NavLink
                key={to}
                to={`/seasons/${id}/${to}`}
                className={navClass}
              >
                <span className={styles.stepNumber}>{step}</span>
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Bottom placeholder for future account section */}
      <div className={styles.bottom} />
    </aside>
  )
}
