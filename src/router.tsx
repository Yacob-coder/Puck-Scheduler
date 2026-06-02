import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Dashboard } from './pages/Dashboard'
import { LeagueSetup } from './pages/LeagueSetup'
import { Slots } from './pages/Slots'
import { Constraints } from './pages/Constraints'
import { Generate } from './pages/Generate'
import { FairnessReport } from './pages/FairnessReport'
import { ScheduleView } from './pages/ScheduleView'
import { Publish } from './pages/Publish'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'seasons/:id/setup', element: <LeagueSetup /> },
      { path: 'seasons/:id/slots', element: <Slots /> },
      { path: 'seasons/:id/constraints', element: <Constraints /> },
      { path: 'seasons/:id/generate', element: <Generate /> },
      { path: 'seasons/:id/report', element: <FairnessReport /> },
      { path: 'seasons/:id/schedule', element: <ScheduleView /> },
      { path: 'seasons/:id/publish', element: <Publish /> },
    ],
  },
])
