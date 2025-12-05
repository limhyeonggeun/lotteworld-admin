"use client"

import type React from "react"

interface MapPickerProps {
  selectedX: number
  selectedY: number
  onMapClick: (x: number, y: number) => void
}

export function MapPicker({ selectedX, selectedY, onMapClick }: MapPickerProps) {
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    onMapClick(Math.round(x * 10) / 10, Math.round(y * 10) / 10)
  }

  return (
    <div className="space-y-2">
      <div
        className="relative w-full h-64 bg-gradient-to-br from-green-100 to-blue-100 border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair overflow-hidden"
        onClick={handleMapClick}
      >
        {/* Mock theme park map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-blue-200 to-purple-200">
          {/* Adventure area */}
          <div className="absolute top-4 left-4 w-32 h-24 bg-green-300 rounded-lg opacity-60 flex items-center justify-center text-xs font-medium">
            어드벤처
          </div>

          {/* Magic Island area */}
          <div className="absolute bottom-4 right-4 w-32 h-24 bg-blue-300 rounded-lg opacity-60 flex items-center justify-center text-xs font-medium">
            매직아일랜드
          </div>

          {/* Central lake */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-16 bg-blue-400 rounded-full opacity-70"></div>
        </div>

        {/* Selected position marker */}
        {(selectedX !== 0 || selectedY !== 0) && (
          <div
            className="absolute w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              left: `${selectedX}%`,
              top: `${selectedY}%`,
            }}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              ({selectedX}, {selectedY})
            </div>
          </div>
        )}

        {/* Click instruction */}
        <div className="absolute bottom-2 left-2 text-xs text-gray-600 bg-white px-2 py-1 rounded">
          지도를 클릭하여 위치를 선택하세요
        </div>
      </div>

      <div className="text-sm text-gray-600">
        선택된 좌표: X: {selectedX}, Y: {selectedY}
      </div>
    </div>
  )
}
