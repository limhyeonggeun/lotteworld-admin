import { Eye, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "active" | "inactive" | "suspended" | "deleted";
  grade: "VIP" | "Normal" | string;
}

interface MemberTableProps {
  initialMembers: Member[];
  selectedMembers: string[];
  onSelectMember: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onView?: (member: Member) => void;
  onOpenStatusModal?: (member: Member) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const formatPhoneNumber = (phone: string | undefined) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, ""); 
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  return phone; 
};

export default function MemberTable({
  initialMembers,
  selectedMembers,
  onSelectMember,
  onToggleAll,
  onView,
  onOpenStatusModal,
  currentPage,
  totalPages,
  setCurrentPage,
}: MemberTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">활성</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">비활성</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">정지</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">탈퇴</Badge>;
    }
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case "vip":
        return <Badge className="bg-purple-100 text-purple-800">VIP</Badge>;
      case "Normal":
        return <Badge className="bg-blue-100 text-blue-800">일반</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">기타</Badge>;
    }
  };

  return (
    <ScrollArea className="w-full">
      <div className="min-w-[1000px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[40px] print:hidden">
                <Checkbox
                  checked={
                    selectedMembers.length === initialMembers.length &&
                    initialMembers.length > 0
                  }
                  onCheckedChange={(checked) => onToggleAll(!!checked)}
                  className="m-auto"
                />
              </TableHead>
              <TableHead className="text-center">회원 ID</TableHead>
              <TableHead className="text-center">이름</TableHead>
              <TableHead className="text-center">이메일</TableHead>
              <TableHead className="text-center">전화번호</TableHead>
              <TableHead className="text-center">상태</TableHead>
              <TableHead className="text-center">등급</TableHead>
              <TableHead className="text-center no-print">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialMembers.map((member) => (
              <TableRow
                key={member.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <TableCell className="text-center w-[40px] print:hidden">
                  <Checkbox
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={(checked) =>
                      onSelectMember(member.id, !!checked)
                    }
                    className="m-auto"
                  />
                </TableCell>
                <TableCell className="text-center">{member.id}</TableCell>
                <TableCell className="text-center">{member.name}</TableCell>
                <TableCell className="text-center">{member.email}</TableCell>
                <TableCell className="text-center">
                  {formatPhoneNumber(member.phone)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    {getStatusBadge(member.status)}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    {getGradeBadge(member.grade)}
                  </div>
                </TableCell>
                <TableCell className="text-center no-print">
                  <div className="flex justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView?.(member)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onOpenStatusModal?.(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-4 space-x-2 no-print">
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
      </div>
    </ScrollArea>
  );
}