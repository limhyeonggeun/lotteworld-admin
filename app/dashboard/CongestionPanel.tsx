"use client"

type ZoneStatus = "low" | "medium" | "high"

const congestionZones: {
  name: string
  status: ZoneStatus
}[] = [
  { name: "어드벤처랜드", status: "high" },
  { name: "매직아일랜드", status: "medium" },
  { name: "판타지랜드", status: "low" },
  { name: "월드광장", status: "medium" },
]

const statusColorMap: Record<ZoneStatus, string> = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
}

export default function CongestionPanel() {
  return (
    <div className="border bg-content-light dark:bg-content-dark text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">실시간 혼잡도</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {congestionZones.map((zone, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-100 dark:bg-muted rounded-lg border"
          >
            <span className="text-sm font-medium">{zone.name}</span>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${statusColorMap[zone.status]}`} />
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {zone.status === "high" ? "혼잡" : zone.status === "medium" ? "보통" : "원활"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}