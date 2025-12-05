"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, Eye, Edit, Trash2 } from "lucide-react"
import type { Notice } from "@/lib/noticesfaqdata"
import { EditNoticeModal } from "./editnoticemodal"
import api from "@/lib/axios"


interface ViewNoticeModalProps {
  isOpen: boolean
  onClose: () => void
  notice: Notice | null
  onDelete: (id: string) => void
}

const fetchNotice = async (id: string): Promise<Notice> => {
  const response = await api.get(`/api/notices/${id}`)
  const data = response.data

  return {
    ...data,
    attachments: data.attachments?.map((attachment: any) => ({
      name: attachment.name,
      url: attachment.url,
    })),
  }
}

export function ViewNoticeModal({ isOpen, onClose, notice, onDelete }: ViewNoticeModalProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  if (!notice) return null

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">긴급</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">중요</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">일반</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">게시중</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300">임시저장</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">예약</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto bg-content-light dark:bg-content-dark" aria-describedby="notice-detail-description">
          <DialogDescription className="sr-only">
            이 대화 상자는 공지사항의 상세 내용을 확인하는 데 사용됩니다.
          </DialogDescription>
          <DialogHeader>
            <DialogTitle>공지사항 상세</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <div />
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  setIsEditOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                수정
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-800"
                onClick={() => {
                  if (notice && confirm("이 공지사항을 삭제하시겠습니까?")) {
                    onDelete(notice.id);
                    onClose();
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {getPriorityBadge(notice.priority)}
                {getStatusBadge(notice.status)}
                <Badge variant="outline">{notice.category}</Badge>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{notice.title}</h1>

              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  작성자: {notice.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  작성일: {notice.createdAt}
                </div>
                <div className="flex items-center">
                  <Eye className="mr-1 h-4 w-4" />
                  조회수: {notice.views}
                </div>
              </div>
            </div>

            <Separator />
            <div className="prose max-w-none">
              <div className="bg-gray-50 dark:bg-muted /30 rounded-lg p-6">
                <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">{notice.content}</div>
              </div>
            </div>

            {notice.attachments && notice.attachments.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3">첨부파일</h3>
                  <div className="space-y-2">
                    {notice.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                        <span className="text-sm">{attachment.name}</span>
                        <Button variant="outline" size="sm">
                          다운로드
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">생성일:</span>
                <span className="ml-2">{notice.createdAt}</span>
              </div>
              {notice.publishDate && (
                <div>
                  <span className="font-medium text-gray-500 dark:text-gray-400">게시일:</span>
                  <span className="ml-2">{notice.publishDate.toString()}</span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <EditNoticeModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        notice={notice}
        onUpdate={(updatedNotice) => {
          setIsEditOpen(false);
          onClose();
        }}
      />
    </>
  )
}
