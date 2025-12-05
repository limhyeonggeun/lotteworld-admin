"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import dayjs from "dayjs"

interface Member {
  id: string
  name: string
  email: string
  joinDate?: string
  status: string
  grade: string
  lastLogin?: string
  isAdmin: boolean
  createdAt?: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  member: Member | null
}

export default function MemberDetailModal({ isOpen, onClose, member }: Props) {
  const [status, setStatus] = useState("")
  const [grade, setGrade] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (member) {
      setStatus(member.status)
      setGrade(member.grade)
      setIsAdmin(member.isAdmin)
    }
  }, [member])

  if (!member) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-content-light dark:bg-content-dark text-gray-900 dark:text-white">
        <DialogDescription className="sr-only">
          이 대화 상자는 회원 상세 정보를 보여줍니다.
        </DialogDescription>
        <DialogHeader>
          <DialogTitle>회원 상세 정보 - {member.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="inline-block text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-1 rounded">회원 번호</p>
            <p className="mt-1 ml-1">{member.id}</p>
          </div>
          <div>
            <p className="inline-block text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-1 rounded">이름</p>
            <p className="mt-1 ml-1">{member.name}</p>
          </div>
          <div>
            <p className="inline-block text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-1 rounded">Email</p>
            <p className="mt-1 ml-1">{member.email}</p>
          </div>
          <div>
            <p className="inline-block text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-1 rounded">가입일</p>
            <p className="mt-1 ml-1">
              {member.createdAt
                ? dayjs(member.createdAt).format("YYYY.MM.DD HH:mm")
                : "정보 없음"}
            </p>
          </div>
          <div>
            <p className="inline-block text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-1 rounded">상태</p>
            <p className="mt-1 ml-1">
              {{
                active: "정상",
                inactive: "비활성화",
                banned: "정지",
              }[status] || "알 수 없음"}
            </p>
          </div>
          <div>
            <p className="inline-block text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-1 rounded">등급</p>
            <p className="mt-1 ml-1">
              {{
                Normal: "일반",
                vip: "VIP",
              }[grade] || "알 수 없음"}
            </p>
          </div>
          <div>
            <p className="inline-block text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-1 rounded">권한</p>
            <p className="mt-1 ml-1">{isAdmin ? "관리자" : "일반"}</p>
          </div>
          <div>
            <p className="inline-block text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-1 rounded">마지막 로그인</p>
            <p className="mt-1 ml-1">
              {member.lastLogin
                ? dayjs(member.lastLogin).format("YYYY.MM.DD HH:mm")
                : "기록 없음"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}