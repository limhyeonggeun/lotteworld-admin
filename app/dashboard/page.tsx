
import Layout from "@/components/layout/Layout"
import KpiCardSection from "./KpiCardSection"
import TrendChartTabs from "./TrendChartTabs"
import RecentAlertsAndTasks from "./RecentAlertsAndTasks"
import CongestionPanel from "./CongestionPanel"

export default function DashboardPage() {
  return (
    <Layout title="대시보드">
      <div className="space-y-6">
        <KpiCardSection />
        <CongestionPanel />
        <TrendChartTabs />
        <RecentAlertsAndTasks />
      </div>
    </Layout>
  )
}