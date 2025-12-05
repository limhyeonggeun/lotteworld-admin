"use client"

import type React from "react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import type { POI } from "@/lib/PoiData"
import type { Route } from "@/lib/RouteData"

interface InteractiveMapProps {
  pois: POI[]
  routes: Route[]
  onPOIClick: (poi: POI) => void
  mapSVG?: string | null
}

export function InteractiveMap({ pois, routes, onPOIClick, mapSVG }: InteractiveMapProps) {
  const [hoveredPOI, setHoveredPOI] = useState<POI | null>(null)

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    console.log(`Clicked coordinates: X: ${x.toFixed(1)}, Y: ${y.toFixed(1)}`)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      어트랙션: "bg-red-500",
      레스토랑: "bg-orange-500",
      카페: "bg-yellow-500",
      상점: "bg-green-500",
      화장실: "bg-blue-500",
      의무실: "bg-purple-500",
      안내소: "bg-pink-500",
      주차장: "bg-gray-500",
    }
    return colors[category] || "bg-gray-500"
  }

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-green-100 to-blue-100 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
      {mapSVG ? (
        <div
          className="w-full h-full cursor-crosshair"
          onClick={handleMapClick}
          dangerouslySetInnerHTML={{ __html: mapSVG }}
        />
      ) : (
        <div className="w-full h-full cursor-crosshair relative" onClick={handleMapClick}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900">
            <div className="absolute top-8 left-8 w-48 h-32 bg-green-300 bg-opacity-60 rounded-lg shadow-lg">
              <div className="w-full h-full flex items-center justify-center text-sm font-medium text-gray-900 dark:text-white">
                어드벤처 랜드
              </div>
            </div>
            <div className="absolute bottom-8 right-8 w-48 h-32 bg-blue-300 bg-opacity-60 rounded-lg shadow-lg">
              <div className="w-full h-full flex items-center justify-center text-sm font-medium text-gray-900 dark:text-white">
                매직 아일랜드
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-24 bg-blue-400 rounded-full opacity-70 shadow-lg"></div>
            <div className="absolute top-1/3 left-1/4 w-1/2 h-2 bg-yellow-200 opacity-80 rounded"></div>
            <div className="absolute top-2/3 left-1/3 w-1/3 h-2 bg-yellow-200 opacity-80 rounded"></div>
          </div>
        </div>
      )}

      {pois.map((poi) => (
        <div
          key={poi.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
          style={{
            left: `${poi.location_x}%`,
            top: `${poi.location_y}%`,
          }}
          onClick={(e) => {
            e.stopPropagation()
            onPOIClick(poi)
          }}
          onMouseEnter={() => setHoveredPOI(poi)}
          onMouseLeave={() => setHoveredPOI(null)}
        >
          <div
            className={`w-4 h-4 ${getCategoryColor(poi.category)} border-2 border-white rounded-full shadow-lg hover:scale-125 transition-transform`}
          >
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
          </div>

          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
            {poi.name}
          </div>
        </div>
      ))}

      {routes.map((route) => {
        const startPOI = pois.find((p) => p.name === route.start_poi)
        const endPOI = pois.find((p) => p.name === route.end_poi)

        if (!startPOI || !endPOI) return null

        return (
          <svg key={route.id} className="absolute inset-0 w-full h-full pointer-events-none z-5" style={{ zIndex: 5 }}>
            <line
              x1={`${startPOI.location_x}%`}
              y1={`${startPOI.location_y}%`}
              x2={`${endPOI.location_x}%`}
              y2={`${endPOI.location_y}%`}
              stroke="#3B82F6"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.7"
            />
          </svg>
        )
      })}
      {hoveredPOI && (
        <div className="absolute top-4 left-4 bg-content-light dark:bg-muted p-3 rounded-lg shadow-lg border border-border z-20">
          <div className="flex items-center space-x-2 mb-1">
            <div className={`w-3 h-3 ${getCategoryColor(hoveredPOI.category)} rounded-full`}></div>
            <span className="font-medium text-foreground">{hoveredPOI.name}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <Badge variant="secondary" className="mr-2">
              {hoveredPOI.category}
            </Badge>
            <span>
              {hoveredPOI.open_time} - {hoveredPOI.close_time}
            </span>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 bg-content-light dark:bg-muted p-3 rounded-lg shadow-lg border border-border z-20">
        <h4 className="text-sm font-medium mb-2 text-foreground">범례</h4>
        <div className="space-y-1 text-xs text-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>어트랙션</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>레스토랑</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>편의시설</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-blue-600" style={{ borderStyle: "dashed" }}></div>
            <span>경로</span>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-content-light dark:bg-muted p-2 rounded-lg shadow-lg border border-border z-20">
        <div className="text-xs text-muted-foreground">
          POI: {pois.length}개 | 경로: {routes.length}개
        </div>
      </div>
    </div>
  )
}
