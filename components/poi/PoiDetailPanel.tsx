"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Tag } from "lucide-react"
import type { POI } from "@/lib/PoiData"

interface POIDetailPanelProps {
  poi: POI | null
  isOpen: boolean
  onClose: () => void
}

export function POIDetailPanel({ poi, isOpen, onClose }: POIDetailPanelProps) {
  if (!poi) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">{poi.name}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Thumbnail */}
          {poi.thumbnail && (
            <div className="w-full h-48 rounded-lg overflow-hidden">
              <img src={poi.thumbnail || "/placeholder.svg"} alt={poi.name} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">카테고리</span>
              <Badge variant="secondary">{poi.category}</Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">운영시간</span>
              <span className="text-sm font-medium">
                {poi.open_time} - {poi.close_time}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">위치</span>
              <span className="text-sm font-medium">
                X: {poi.location_x}, Y: {poi.location_y}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${poi.is_open ? "bg-green-500" : "bg-red-500"}`}></div>
              </div>
              <span className="text-sm text-gray-600">상태</span>
              <Badge variant={poi.is_open ? "default" : "destructive"}>{poi.is_open ? "운영중" : "휴무"}</Badge>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">설명</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{poi.description || "설명이 없습니다."}</p>
          </div>

          {/* Location Map Preview */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">위치 미리보기</h3>
            <div className="relative w-full h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-blue-200 to-purple-200">
                {/* Adventure area */}
                <div className="absolute top-2 left-2 w-16 h-12 bg-green-300 rounded opacity-60 flex items-center justify-center text-xs">
                  어드벤처
                </div>

                {/* Magic Island area */}
                <div className="absolute bottom-2 right-2 w-16 h-12 bg-blue-300 rounded opacity-60 flex items-center justify-center text-xs">
                  매직아일랜드
                </div>
              </div>

              {/* POI marker */}
              <div
                className="absolute w-3 h-3 bg-red-500 border border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${poi.location_x}%`,
                  top: `${poi.location_y}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">메타데이터</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div>POI ID: #{poi.id}</div>
              <div>생성일: 2024-01-15</div>
              <div>최종 수정: 2024-01-20</div>
              <div>생성자: 관리자</div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
