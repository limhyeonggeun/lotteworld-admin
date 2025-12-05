"use client"

import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs"
import {
  Card, CardHeader, CardContent, CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { POI } from "@/lib/PoiData"
import type { Route } from "@/lib/RouteData"
import type { Category } from "@/lib/CategoryData"
import {
  Plus, Search, Eye, Edit, Trash2, Upload,
  MapPin, RouterIcon, Tag, FileImage
} from "lucide-react"

interface MapManagementTabsProps {
  filteredPOIs: POI[]
  paginatedPOIs: POI[]
  currentPage: number
  totalPages: number
  searchTerm: string
  setSearchTerm: (term: string) => void
  setCurrentPage: (page: number) => void
  handlePOIClick: (poi: POI) => void
  handleEditPOIClick: (poi: POI) => void
  handleDeletePOI: (id: number) => void
  routes: Route[]
  setIsRouteModalOpen: (v: boolean) => void
  setEditingRoute: (route: Route) => void
  handleDeleteRoute: (id: number) => void
  categories: Category[]
  setIsCategoryModalOpen: (v: boolean) => void
  setEditingCategory: (category: Category) => void
  handleDeleteCategory: (id: number) => void
  mapSVG: string | null
  setIsSVGUploadModalOpen: (v: boolean) => void
}

export default function MapManagementTabs({
  filteredPOIs,
  paginatedPOIs,
  currentPage,
  setCurrentPage,
  totalPages,
  searchTerm,
  setSearchTerm,
  handlePOIClick,
  handleEditPOIClick,
  handleDeletePOI,
  routes,
  setIsRouteModalOpen,
  setEditingRoute,
  handleDeleteRoute,
  categories,
  setIsCategoryModalOpen,
  setEditingCategory,
  handleDeleteCategory,
  mapSVG,
  setIsSVGUploadModalOpen,
}: MapManagementTabsProps) {

  return (
    <Tabs defaultValue="pois" className="w-full space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="pois">POI 목록</TabsTrigger>
        <TabsTrigger value="routes">경로 관리</TabsTrigger>
        <TabsTrigger value="categories">카테고리</TabsTrigger>
        <TabsTrigger value="upload">파일 관리</TabsTrigger>
      </TabsList>

      {/* POI List Tab */}
      <TabsContent value="pois" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>POI 목록 ({filteredPOIs.length}개)</CardTitle>
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="POI 이름 또는 카테고리로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-center py-3 px-4 font-medium text-foreground">ID</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">이름</th>
                        <th className="text-center py-3 px-4 font-medium text-foreground">카테고리</th>
                        <th className="text-center py-3 px-4 font-medium text-foreground">운영시간</th>
                        <th className="text-center py-3 px-4 font-medium text-foreground">상태</th>
                        <th className="text-center py-3 px-4 font-medium text-foreground">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPOIs.map((poi) => (
                        <tr key={poi.id} className="border-b hover:bg-accent transition-colors">
                          <td className="py-3 px-4 text-sm text-foreground text-center">#{poi.id}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={poi.thumbnail ? poi.thumbnail : "/no-image.png"}
                                alt={poi.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <div>
                                <div className="font-medium text-foreground">{poi.name}</div>
                                <div className="text-sm text-muted-foreground truncate max-w-xs">{poi.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge variant="secondary">{poi.category}</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-foreground text-center">
                            {poi.open_time} - {poi.close_time}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge variant={poi.is_open ? "default" : "destructive"}>
                              {poi.is_open ? "운영중" : "휴무"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center align-middle">
                            <div className="inline-flex items-center justify-center space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handlePOIClick(poi)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditPOIClick(poi)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePOI(poi.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      이전
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant="outline"
                        size="sm"
                        className={currentPage === i + 1 ? "bg-blue-50 text-blue-600" : ""}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      다음
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Routes Tab */}
          <TabsContent value="routes" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>경로 관리 ({routes.length}개)</CardTitle>
                  <Button onClick={() => setIsRouteModalOpen(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    경로 추가
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {routes.map((route) => (
                    <div
                      key={route.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-muted-foreground">#{route.id}</div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{route.start_poi}</Badge>
                          <span className="text-muted-foreground">→</span>
                          <Badge variant="outline">{route.end_poi}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">{route.svg_path_url}</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingRoute(route)
                            setIsRouteModalOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRoute(route.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>카테고리 관리 ({categories.length}개)</CardTitle>
                  <Button onClick={() => setIsCategoryModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    카테고리 추가
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {category.icon && (
                            <img
                              src={category.icon || "/placeholder.svg"}
                              alt={category.name}
                              className="w-6 h-6 object-contain"
                            />
                          )}
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingCategory(category)
                              setIsCategoryModalOpen(true)
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">ID: #{category.id}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* File Upload Tab */}
          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>파일 관리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <FileImage className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">기본 지도 SVG</h3>
                  {mapSVG ? (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600 dark:text-green-400">지도가 업로드되었습니다</p>
                      <Button onClick={() => setIsSVGUploadModalOpen(true)} variant="outline">
                        지도 교체
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">테마파크 기본 지도를 업로드하세요</p>
                      <Button onClick={() => setIsSVGUploadModalOpen(true)}>
                        <Upload className="w-4 h-4 mr-2" />
                        SVG 업로드
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
  )
}