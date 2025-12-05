"use client"

import { useState, type FormEvent, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SettingsForm() {
  const [adminName, setAdminName] = useState<string>("김관리자")
  const [initialPage, setInitialPage] = useState<string>("dashboard")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const [receiveSystemAlerts, setReceiveSystemAlerts] = useState<boolean>(true)
  const [receiveOrderAlerts, setReceiveOrderAlerts] = useState<boolean>(true)

  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")

  const [passwordError, setPasswordError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const validatePasswords = (): boolean => {
    if (newPassword && newPassword.length < 8) {
      setPasswordError("비밀번호는 8자 이상이어야 합니다.")
      return false
    }

    if (newPassword && newPassword !== confirmPassword) {
      setPasswordError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.")
      return false
    }

    if (newPassword && !currentPassword) {
      setPasswordError("현재 비밀번호를 입력해주세요.")
      return false
    }

    setPasswordError("")
    return true
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validatePasswords()) {
      return
    }

    setIsSubmitting(true)

    const settingsData = {
      general: {
        adminName,
        initialPage,
      },
      notifications: {
        receiveSystemAlerts,
        receiveOrderAlerts,
      },
      security: {
        currentPassword,
        newPassword: newPassword || undefined,
      },
    }


    console.log("설정 저장:", settingsData)

    try {
      // API 요청 시뮬레이션 (실제 구현 시 fetch 또는 axios 사용)
      // const response = await fetch('/api/admin/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settingsData),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("설정 저장 실패:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">일반 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="adminName">관리자 이름</Label>
              <Input id="adminName" value={adminName} readOnly className="bg-gray-50" />
              <p className="text-xs text-gray-500">관리자 이름은 시스템 관리자만 변경할 수 있습니다.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialPage">초기 접속 페이지</Label>
              <Select value={initialPage} onValueChange={setInitialPage}>
                <SelectTrigger id="initialPage">
                  <SelectValue placeholder="초기 페이지 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">대시보드</SelectItem>
                  <SelectItem value="members">회원 관리</SelectItem>
                  <SelectItem value="reservations">예매 관리</SelectItem>
                  <SelectItem value="notices-faq">공지사항 관리</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme">테마 설정</Label>
              <p className="text-sm text-gray-500">다크 모드를 활성화하면 어두운 테마로 전환됩니다.</p>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="theme" className="text-sm">
                {theme === "dark" ? "다크" : "라이트"}
              </Label>
              <Switch id="theme" checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">알림 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="systemAlerts"
              checked={receiveSystemAlerts}
              onCheckedChange={(checked) => setReceiveSystemAlerts(checked as boolean)}
            />
            <div className="space-y-1">
              <Label htmlFor="systemAlerts" className="text-base font-medium cursor-pointer">
                시스템 알림 수신
              </Label>
              <p className="text-sm text-gray-500">시스템 업데이트, 점검 일정 등의 알림을 수신합니다.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="orderAlerts"
              checked={receiveOrderAlerts}
              onCheckedChange={(checked) => setReceiveOrderAlerts(checked as boolean)}
            />
            <div className="space-y-1">
              <Label htmlFor="orderAlerts" className="text-base font-medium cursor-pointer">
                주문 알림 수신
              </Label>
              <p className="text-sm text-gray-500">새로운 주문이 접수되면 알림을 수신합니다.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">보안 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {passwordError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{passwordError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">현재 비밀번호</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호 입력"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newPassword">새 비밀번호</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호 입력"
              />
              <p className="text-xs text-gray-500">8자 이상의 영문, 숫자, 특수문자 조합</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새 비밀번호 재입력"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border-t pt-4 flex justify-end items-center space-x-4">
        {saveSuccess && <p className="text-green-600 font-medium mr-auto">설정이 성공적으로 저장되었습니다.</p>}
        <Button variant="outline" type="button">
          취소
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "저장 중..." : "설정 저장"}
        </Button>
      </div>
    </form>
  )
}
