"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EditFAQModal } from "@/components/noticesfaq/editfaqmodal"
import { CreateFAQModal } from "@/components/noticesfaq/createfaqmodal"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { faqs, faqCategories } from "@/lib/noticesfaqdata"
import type { FAQ } from "@/lib/noticesfaqdata"

interface ViewFAQModalProps {
  isOpen: boolean
  onClose: () => void
  faq: FAQ | null
  onDelete: (id: string) => void
  onEdit: () => void
}

function ViewFAQModal({ isOpen, onClose, faq, onDelete, onEdit }: ViewFAQModalProps) {
  if (!isOpen || !faq) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">{faq.question}</h2>
        <p className="mb-6">{faq.answer}</p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button variant="secondary" onClick={onEdit}>
            수정
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("이 FAQ를 삭제하시겠습니까?")) {
                onDelete(faq.id)
              }
            }}
          >
            삭제
          </Button>
        </div>
      </div>
    </div>
  )
}

export function FaqSection({
  faqs,
  externalTriggerCreate,
  onFinishCreate,
}: {
  faqs: FAQ[];
  externalTriggerCreate: boolean;
  onFinishCreate?: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [faqData, setFaqData] = useState<FAQ[]>(faqs)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  useEffect(() => {
    if (externalTriggerCreate) {
      setCreateModalOpen(true);
    }
  }, [externalTriggerCreate]);

  const filteredFaqs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const groupedFaqs = filteredFaqs.reduce(
    (acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = []
      }
      acc[faq.category].push(faq)
      return acc
    },
    {} as Record<string, FAQ[]>,
  )

  const getCategoryName = (categoryId: string) => {
    const category = faqCategories.find((cat) => cat.id === categoryId)
    return category ? category.name : categoryId
  }

  const getCategoryColor = (categoryId: string) => {
    const colors = {
      alert_management: "bg-blue-100 text-blue-800",
      food_order: "bg-green-100 text-green-800",
      map_poi: "bg-purple-100 text-purple-800",
      account_permission: "bg-orange-100 text-orange-800",
      statistics: "bg-pink-100 text-pink-800",
    }
    return colors[categoryId as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              필터 및 검색
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="제목 또는 키워드 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                {faqCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {Object.entries(groupedFaqs).map(([categoryId, categoryFaqs]) => (
          <Card key={categoryId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CardTitle className="text-lg">{getCategoryName(categoryId)}</CardTitle>
                  <Badge className={getCategoryColor(categoryId)}>{categoryFaqs.length}개</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {categoryFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                    <div className="flex items-center justify-between w-full pr-4">
                      <AccordionTrigger
                        className="hover:no-underline flex-1 text-left"
                        onClick={() => {
                          setSelectedFAQ(faq);
                          setViewModalOpen(true);
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <Badge variant="outline" className="mt-1 text-xs">
                            Q{faq.order}
                          </Badge>
                          <span className="font-medium">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFAQ(faq);
                            setEditModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("이 FAQ를 삭제하시겠습니까?")) {
                              setFaqData((prev) => prev.filter((f) => f.id !== faq.id));
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <AccordionContent className="pt-4 pb-6">
                      <div className="bg-gray-50 rounded-lg p-4 ml-8">
                        <div className="flex items-start space-x-3">
                          <Badge variant="secondary" className="mt-1 text-xs">
                            A
                          </Badge>
                          <div className="text-gray-700 leading-relaxed">{faq.answer}</div>
                        </div>
                        {faq.lastUpdated && (
                          <div className="mt-4 text-xs text-gray-500 ml-8">마지막 업데이트: {faq.lastUpdated}</div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFaqs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
            <p className="text-sm text-gray-400 mt-2">다른 키워드로 검색하거나 카테고리를 변경해보세요.</p>
          </CardContent>
        </Card>
      )}

      <ViewFAQModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        faq={selectedFAQ}
        onDelete={(id) => {
          setFaqData((prev) => prev.filter((faq) => faq.id !== id))
          setSelectedFAQ(null)
          setViewModalOpen(false)
        }}
        onEdit={() => {
          setViewModalOpen(false)
          setEditModalOpen(true)
        }}
      />
      <EditFAQModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        faq={selectedFAQ}
        onUpdate={(updatedFAQ) => {
          setFaqData((prev) =>
            prev.map((faq) => (faq.id === updatedFAQ.id ? updatedFAQ : faq))
          );
          setEditModalOpen(false);
        }}
      />
      <CreateFAQModal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          onFinishCreate?.();
        }}
        onCreate={(newFAQ) => {
          const fullFAQ: FAQ = {
            ...newFAQ,
            id: Date.now().toString(),
            order: faqData.length + 1,
            lastUpdated: new Date().toISOString(),
          };
          setFaqData((prev) => [...prev, fullFAQ]);
          setCreateModalOpen(false);
          onFinishCreate?.();
        }}
      />
    </div>
  )
}
