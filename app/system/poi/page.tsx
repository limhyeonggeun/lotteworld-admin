"use client"

import { useState } from "react"
import Layout from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Eye, Edit, Trash2, Upload, MapPin, RouterIcon, Tag, FileImage } from "lucide-react"

import { InteractiveMap } from "@/components/MapManagement/InteractiveMap"
import { POIDetailPanel } from "@/components/MapManagement/PoiDetailPanel"
import { POIModal } from "@/components/MapManagement/PoiModal"
import { RouteModal } from "@/components/MapManagement/RouteModal"
import { CategoryModal } from "@/components/MapManagement/CategoryModal"
import { SVGUploadModal } from "@/components/MapManagement/SvgUploadModal"
import MapManagementTabs from "@/components/MapManagement/MapManagementTabs"

import { poiData, type POI } from "@/lib/PoiData"
import { routeData, type Route } from "@/lib/RouteData"
import { categoryData, type Category } from "@/lib/CategoryData"

export default function MapManagementPage() {
  const [pois, setPois] = useState<POI[]>(poiData)
  const [routes, setRoutes] = useState<Route[]>(routeData)
  const [categories, setCategories] = useState<Category[]>(categoryData)

  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isAddPOIModalOpen, setIsAddPOIModalOpen] = useState(false)
  const [isEditPOIModalOpen, setIsEditPOIModalOpen] = useState(false)
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isSVGUploadModalOpen, setIsSVGUploadModalOpen] = useState(false)
  const [editingPOI, setEditingPOI] = useState<POI | null>(null)
  const [editingRoute, setEditingRoute] = useState<Route | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [mapSVG, setMapSVG] = useState<string | null>(null)
  const itemsPerPage = 8

  const filteredPOIs = pois.filter(
    (poi) =>
      poi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poi.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredPOIs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPOIs = filteredPOIs.slice(startIndex, startIndex + itemsPerPage)

  const handlePOIClick = (poi: POI) => {
    setSelectedPOI(poi)
    setIsPanelOpen(true)
  }

  const handleAddPOI = (newPOI: Omit<POI, "id">) => {
    const poi: POI = {
      ...newPOI,
      id: Math.max(...pois.map((p) => p.id)) + 1,
    }
    setPois([...pois, poi])
    setIsAddPOIModalOpen(false)
  }

  const handleEditPOI = (updatedPOI: POI) => {
    setPois(pois.map((poi) => (poi.id === updatedPOI.id ? updatedPOI : poi)))
    setIsEditPOIModalOpen(false)
    setEditingPOI(null)
  }

  const handleDeletePOI = (id: number) => {
    if (confirm("이 POI를 삭제하시겠습니까?")) {
      setPois(pois.filter((poi) => poi.id !== id))
      if (selectedPOI?.id === id) {
        setIsPanelOpen(false)
        setSelectedPOI(null)
      }
    }
  }

  const handleEditPOIClick = (poi: POI) => {
    setEditingPOI(poi)
    setIsEditPOIModalOpen(true)
  }

  const handleAddRoute = (newRoute: Omit<Route, "id">) => {
    const route: Route = {
      ...newRoute,
      id: Math.max(...routes.map((r) => r.id)) + 1,
    }
    setRoutes([...routes, route])
    setIsRouteModalOpen(false)
  }

  const handleEditRoute = (updatedRoute: Route) => {
    setRoutes(routes.map((route) => (route.id === updatedRoute.id ? updatedRoute : route)))
    setIsRouteModalOpen(false)
    setEditingRoute(null)
  }

  const handleDeleteRoute = (id: number) => {
    if (confirm("이 경로를 삭제하시겠습니까?")) {
      setRoutes(routes.filter((route) => route.id !== id))
    }
  }

  const handleAddCategory = (newCategory: Omit<Category, "id">) => {
    const category: Category = {
      ...newCategory,
      id: Math.max(...categories.map((c) => c.id)) + 1,
    }
    setCategories([...categories, category])
    setIsCategoryModalOpen(false)
  }

  const handleEditCategory = (updatedCategory: Category) => {
    setCategories(categories.map((category) => (category.id === updatedCategory.id ? updatedCategory : category)))
    setIsCategoryModalOpen(false)
    setEditingCategory(null)
  }

  const handleDeleteCategory = (id: number) => {
    if (confirm("이 카테고리를 삭제하시겠습니까?")) {
      setCategories(categories.filter((category) => category.id !== id))
    }
  }

  return (
    <Layout title="지도 및 POI 관리">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">지도 및 POI 관리</h1>
            <p className="text-sm text-gray-500">POI, 경로, 카테고리를 통합 관리합니다</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddPOIModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              POI 추가
            </Button>
            <Button onClick={() => setIsSVGUploadModalOpen(true)} variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              지도 업로드
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              인터랙티브 지도
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <InteractiveMap pois={pois} routes={routes} onPOIClick={handlePOIClick} mapSVG={mapSVG} />
          </CardContent>
        </Card>

        <MapManagementTabs
          filteredPOIs={filteredPOIs}
          paginatedPOIs={paginatedPOIs}
          currentPage={currentPage}
          totalPages={totalPages}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setCurrentPage={setCurrentPage}
          handlePOIClick={handlePOIClick}
          handleEditPOIClick={handleEditPOIClick}
          handleDeletePOI={handleDeletePOI}
          routes={routes}
          setIsRouteModalOpen={setIsRouteModalOpen}
          setEditingRoute={setEditingRoute}
          handleDeleteRoute={handleDeleteRoute}
          categories={categories}
          setIsCategoryModalOpen={setIsCategoryModalOpen}
          setEditingCategory={setEditingCategory}
          handleDeleteCategory={handleDeleteCategory}
          mapSVG={mapSVG}
          setIsSVGUploadModalOpen={setIsSVGUploadModalOpen}
        />

      <POIDetailPanel
        poi={selectedPOI}
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false)
          setSelectedPOI(null)
        }}
        onEdit={handleEditPOIClick}
        onDelete={handleDeletePOI}
      />

      <POIModal
        isOpen={isAddPOIModalOpen}
        onClose={() => setIsAddPOIModalOpen(false)}
        onSubmit={(poi) => handleAddPOI(poi as Omit<POI, "id">)}
        categories={categories}
      />

      <POIModal
        isOpen={isEditPOIModalOpen}
        onClose={() => {
          setIsEditPOIModalOpen(false)
          setEditingPOI(null)
        }}
        onSubmit={(poi) => handleEditPOI(poi as POI)}
        editingPOI={editingPOI}
        categories={categories}
      />

      <RouteModal
        isOpen={isRouteModalOpen}
        onClose={() => {
          setIsRouteModalOpen(false)
          setEditingRoute(null)
        }}
        onSubmit={(route) =>
          editingRoute
            ? handleEditRoute(route as Route)
            : handleAddRoute(route as Omit<Route, "id">)
        }
        editingRoute={editingRoute}
        pois={pois}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false)
          setEditingCategory(null)
        }}
        onSubmit={(category) =>
          editingCategory
            ? handleEditCategory(category as Category)
            : handleAddCategory(category as Omit<Category, "id">)
        }
        editingCategory={editingCategory}
      />

      <SVGUploadModal
        isOpen={isSVGUploadModalOpen}
        onClose={() => setIsSVGUploadModalOpen(false)}
        onUpload={(svgContent) => {
          setMapSVG(svgContent)
          setIsSVGUploadModalOpen(false)
        }}
      />
      </div>
    </Layout>
  )
}
