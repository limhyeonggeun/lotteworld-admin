"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

interface Member {
  id: string;
  name: string;
  email: string;
  joinDate?: string;
  status: "active" | "inactive" | "banned" | string;
  grade: "Normal" | "vip" | string;
  lastLogin?: string;
  isAdmin: boolean;
}

interface MemberStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: Member["status"];
  currentGrade: Member["grade"];
  currentRole: boolean;
  onChangeStatus: (status: Member["status"]) => void;
  onChangeGrade: (grade: Member["grade"]) => void;
  onChangeRole: (isAdmin: boolean) => void;
  member: Member;
}

const STATUS_OPTIONS = [
  { label: "활성", value: "active" },
  { label: "비활성", value: "inactive" },
  { label: "정지", value: "banned" },
];

const GRADE_OPTIONS = [
  { label: "일반", value: "Normal" },
  { label: "VIP", value: "vip" }, 
];

export default function MemberStatusModal({
  isOpen,
  onClose,
  currentStatus,
  currentGrade,
  currentRole,
  onChangeStatus,
  onChangeGrade,
  onChangeRole,
  member,
}: MemberStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<Member["status"]>(currentStatus);
  const [selectedGrade, setSelectedGrade] = useState<Member["grade"]>(currentGrade);
  const [selectedRole, setSelectedRole] = useState<boolean>(currentRole);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setSelectedStatus(currentStatus);
    setSelectedGrade(currentGrade);
    setSelectedRole(currentRole);
  }, [currentStatus, currentGrade, currentRole, isOpen]);

  const dirty = useMemo(
    () =>
      selectedStatus !== currentStatus ||
      selectedGrade !== currentGrade ||
      selectedRole !== currentRole,
    [selectedStatus, selectedGrade, selectedRole, currentStatus, currentGrade, currentRole]
  );

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleConfirm = async () => {
    if (!dirty) return;

    try {
      setSaving(true);

      const payload: Partial<Pick<Member, "status" | "grade" | "isAdmin">> = {};
      if (selectedStatus !== currentStatus) payload.status = selectedStatus;
      if (selectedGrade !== currentGrade) payload.grade = selectedGrade;
      if (selectedRole !== currentRole) payload.isAdmin = selectedRole;

      await api.patch(`/api/users/${member.id}`, payload);

      if (payload.status) onChangeStatus(payload.status);
      if (payload.grade) onChangeGrade(payload.grade);
      if (payload.isAdmin !== undefined) onChangeRole(payload.isAdmin);

      showMessage("변경사항이 저장되었습니다.");
      onClose();
    } catch (err: any) {
      console.error("업데이트 실패:", err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.status === 403 ? "권한이 없습니다." : "저장 실패. 다시 시도해주세요.");
      showMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm" aria-describedby="member-status-description">
        <DialogDescription className="sr-only">
          이 대화 상자는 회원의 상태, 등급, 권한을 변경하는 데 사용됩니다.
        </DialogDescription>

        <DialogHeader>
          <DialogTitle>회원 정보 수정</DialogTitle>
        </DialogHeader>

        {message && <p className="text-sm text-center text-blue-600 my-2">{message}</p>}

        <Tabs defaultValue="status">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="status">상태</TabsTrigger>
            <TabsTrigger value="grade">등급</TabsTrigger>
            <TabsTrigger value="role">권한</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="py-4">
            <h3 className="text-sm font-medium text-gray-700">상태</h3>
            <RadioGroup
              value={selectedStatus}
              onValueChange={(v) => setSelectedStatus(v as Member["status"])}
              className="space-y-2 py-2"
            >
              {STATUS_OPTIONS.map((opt) => (
                <div key={opt.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.value} id={`status-${opt.value}`} />
                  <Label htmlFor={`status-${opt.value}`}>{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>

          <TabsContent value="grade" className="py-4">
            <h3 className="text-sm font-medium text-gray-700">등급</h3>
            <RadioGroup
              value={selectedGrade}
              onValueChange={(v) => setSelectedGrade(v as Member["grade"])}
              className="space-y-2 py-2"
            >
              {GRADE_OPTIONS.map((opt) => (
                <div key={opt.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.value} id={`grade-${opt.value}`} />
                  <Label htmlFor={`grade-${opt.value}`}>{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>

          <TabsContent value="role" className="py-4">
            <h3 className="text-sm font-medium text-gray-700">권한</h3>
            <RadioGroup
              value={selectedRole ? "admin" : "user"}
              onValueChange={(v) => setSelectedRole(v === "admin")}
              className="space-y-2 py-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="role-admin" />
                <Label htmlFor="role-admin">관리자</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="role-user" />
                <Label htmlFor="role-user">사용자</Label>
              </div>
            </RadioGroup>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={!dirty || saving}>
            {saving ? "저장 중..." : "확인"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}