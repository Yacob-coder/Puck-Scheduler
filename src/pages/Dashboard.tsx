import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui'

export function Dashboard() {
  return (
    <>
      <PageHeader
        title="Your leagues"
        subtitle="Create a season and build a schedule your teams can count on."
        withMesh
        action={<Button>New season</Button>}
      />
      {/* Screen coming soon */}
    </>
  )
}
