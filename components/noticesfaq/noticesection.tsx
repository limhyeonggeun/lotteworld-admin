"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { EditNoticeModal } from "@/components/noticesfaq/editnoticemodal"
import { CreateNoticeModal } from "@/components/noticesfaq/createnoticemodal"
import { ViewNoticeModal } from "@/components/noticesfaq/viewnoticemodal"
import { Plus, Search, Calendar, Eye, Edit, Trash2 } from "lucide-react"
import { notices } from "@/lib/noticesfaqdata"
import type { Notice } from "@/lib/noticesfaqdata"

interface NoticeSectionProps {
  showCreateButton?: boolean;
  externalTriggerCreate?: boolean;
  onFinishCreate?: () => void;
  notices: Notice[];
}

export function NoticeSection({ showCreateButton = false, externalTriggerCreate = false, onFinishCreate }: NoticeSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null)
  const [noticesData, setNoticesData] = useState<Notice[]>(notices)

  useEffect(() => {
    if (externalTriggerCreate) setCreateModalOpen(true)
  }, [externalTriggerCreate])

  const filteredNotices = noticesData.filter(
    (notice) =>
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 5;
  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage);
  const paginatedNotices = filteredNotices.slice(
    (currentPage - 1) * noticesPerPage,
    currentPage * noticesPerPage
  );

  const handleViewNotice = (notice: Notice) => {
    setSelectedNotice(notice)
    setViewModalOpen(true)
  }

  const handleEditNotice = (notice: Notice) => {
    setSelectedNotice(notice)
    setEditModalOpen(true)
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">긴급</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">중요</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">일반</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">게시중</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">임시저장</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">예약</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
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
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="제목 또는 키워드 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">검색 결과가 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          paginatedNotices.map((notice) => (
            <Card key={notice.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(notice.priority)}
                      {getStatusBadge(notice.status)}
                      <Badge variant="outline">{notice.category}</Badge>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{notice.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{notice.content}</p>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {notice.createdAt}
                      </div>
                      <div>작성자: {notice.author}</div>
                      <div>조회수: {notice.views}</div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => handleViewNotice(notice)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditNotice(notice)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        if (confirm("이 공지사항을 삭제하시겠습니까?")) {
                          setNoticesData(noticesData.filter((n) => n.id !== notice.id));
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          이전
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            variant="outline"
            size="sm"
            className={currentPage === i + 1 ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          다음
        </Button>
      </div>

      <CreateNoticeModal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          onFinishCreate?.();
        }}
        onCreate={(newNotice) => {
          const fullNotice: Notice = {
            ...newNotice,
            id: Date.now().toString(),
            author: "관리자",
            createdAt: new Date().toISOString(),
            views: 0,
            priority: newNotice.priority as "low" | "medium" | "high",
            status: newNotice.status as "published" | "draft" | "scheduled",
          };
          setNoticesData((prev) => [...prev, fullNotice]);
          setCreateModalOpen(false);
          onFinishCreate?.();
        }}
      />

      <EditNoticeModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        notice={selectedNotice}
        onUpdate={(updated) => {
          setNoticesData((prev) =>
            prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
          )
        }}
      />

      <ViewNoticeModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        notice={selectedNotice}
        onDelete={(id) => {
          setNoticesData((prev) => prev.filter((n) => n.id !== id));
          setViewModalOpen(false);
        }}
      />
    </div>
  )
}
