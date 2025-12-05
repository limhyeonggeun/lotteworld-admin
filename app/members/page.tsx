"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Layout from "@/components/layout/Layout";
import MemberFilterBar from "@/components/members/MemberFilterBar";
import MemberTable from "@/components/members/MemberTable";
import MemberDetailModal from "@/components/members/MemberDetailModal";
import MemberStatusModal from "@/components/members/MemberStatusModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import saveAs from "file-saver";
import api from "@/lib/axios";

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 10;

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get("/api/users");
        setMembers(res.data);
      } catch (error) {
        console.error("회원 정보 불러오기 실패:", error);
      }
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    setSelectedMembers((prev) =>
      prev.filter((id) => members.some((member) => member.id === id))
    );
  }, [members]);

  const handleSelectMember = (id: string, checked: boolean) => {
    setSelectedMembers((prev) => (checked ? [...prev, id] : prev.filter((m) => m !== id)));
  };

  const handleOpenDetail = (member: any) => {
    setSelectedMember(member);
    setIsModalOpen(true);
    setIsStatusModalOpen(false);
  };

  const handleOpenStatusModal = (member: any) => {
    if (!member) return;
    setSelectedMember(member);
    setIsStatusModalOpen(true);
    setIsModalOpen(false);
  };

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(members.map((member) => member.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleStatusChange = (id: string | undefined, newStatus: string) => {
    if (!id) return;
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, status: newStatus } : member
      )
    );
  };

  const handleGradeChange = (id: string | undefined, newGrade: string) => {
    if (!id) return;
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, grade: newGrade } : member
      )
    );
  };

  const handleRoleChange = (id: string | undefined, isAdmin: boolean) => {
    if (!id) return;
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, isAdmin } : member
      )
    );
  };

  const filteredMembers = members
    .filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.id.toString().includes(searchQuery)
    )
    .filter((member) =>
      statusFilter === "all" ? true : member.status === statusFilter
    )
    .filter((member) =>
      gradeFilter === "all"
        ? true
        : member.grade.toLowerCase() === gradeFilter.toLowerCase()
    );

  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * membersPerPage,
    currentPage * membersPerPage
  );

  const handleExport = () => {
    const exportData = filteredMembers.map((member) => ({
      회원ID: member.id,
      이름: member.name,
      이메일: member.email,
      전화번호: member.phone,
      상태: member.status,
      등급: member.grade,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, `members_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handlePrint = () => {
    window.print()
  };

  return (
    <Layout title="회원 관리">
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b pb-3 no-print">
          <div>
            <h1 className="text-2xl font-bold">회원 관리</h1>
            <p className="text-sm text-gray-500">회원 정보를 조회하고 상세 내용을 확인할 수 있습니다.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-sm px-3" onClick={handleExport}>
              <Download className="w-4 h-4 mr-1" /> 내보내기
            </Button>
            <Button variant="outline" className="text-sm px-3" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" /> 인쇄
            </Button>
          </div>
        </div>

        <div className="no-print">
          <MemberFilterBar
            searchKeyword={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            gradeFilter={gradeFilter}
            onGradeFilterChange={setGradeFilter}
            dateRange={undefined}
            onDateRangeChange={(range: DateRange | undefined) => {
              console.log("Date range changed:", range);
            }}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>회원 목록 ({filteredMembers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div id="print-area">
              {filteredMembers.length > 0 ? (
                <MemberTable
                  initialMembers={paginatedMembers}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  selectedMembers={selectedMembers}
                  onSelectMember={handleSelectMember}
                  onView={handleOpenDetail}
                  onOpenStatusModal={handleOpenStatusModal}
                  onToggleAll={handleToggleAll}
                />
              ) : (
                <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {isModalOpen && selectedMember && (
        <MemberDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          member={selectedMember || {}}
        />
      )}

      {isStatusModalOpen && selectedMember && (
        <MemberStatusModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          member={selectedMember}
          currentStatus={selectedMember?.status || ""}
          currentGrade={selectedMember?.grade || ""}
          currentRole={selectedMember?.isAdmin || false}
          onChangeStatus={(newStatus) => handleStatusChange(selectedMember.id, newStatus)}
          onChangeGrade={(newGrade) => handleGradeChange(selectedMember.id, newGrade)}
          onChangeRole={(isAdmin) => handleRoleChange(selectedMember.id, isAdmin)}
        />
      )}
    </Layout>
  );
}