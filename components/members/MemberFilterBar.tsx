import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DateRange } from "react-day-picker";

interface MemberFilterBarProps {
  searchKeyword: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  gradeFilter: string;
  onGradeFilterChange: (value: string) => void;
  dateRange: DateRange | undefined; 
  onDateRangeChange: (range: DateRange | undefined) => void; 
}

export default function MemberFilterBar({
  searchKeyword,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  gradeFilter,
  onGradeFilterChange,
  dateRange,
  onDateRangeChange,
}: MemberFilterBarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="mr-2 h-5 w-5" />
          필터 및 검색
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="이름, 이메일, ID로 검색하세요"
              value={searchKeyword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: string) => onStatusFilterChange(value)}>
            <SelectTrigger>
              <SelectValue placeholder="상태 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="inactive">비활성</SelectItem>
              <SelectItem value="suspended">정지</SelectItem>
              <SelectItem value="withdrawn">탈퇴</SelectItem>
            </SelectContent>
          </Select>
          <Select value={gradeFilter} onValueChange={onGradeFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="등급 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 등급</SelectItem>
              <SelectItem value="Normal">일반</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
              <SelectItem value="Admin">관리자</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}