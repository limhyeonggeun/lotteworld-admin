import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/date-range-picker";
import type { DateRange } from "react-day-picker";
import api from "@/lib/axios";

interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  ticketTypeFilter: string;
  setTicketTypeFilter: (type: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const statusOptions = ["전체 상태", "예매완료", "사용완료", "취소완료", "사용불가"];

export default function ReservationFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  ticketTypeFilter,
  setTicketTypeFilter,
  dateRange,
  setDateRange,
}: Props) {
  const [ticketTypeOptions, setTicketTypeOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get<{ optionName: string }[]>("/api/orders");

        const optionNames = res.data
          .map((order) => order.optionName)
          .filter((name) => !!name);

        const uniqueOptions = Array.from(new Set(optionNames));
        setTicketTypeOptions(uniqueOptions);
      } catch (error) {
        console.error("티켓 옵션 가져오기 실패", error);
      }
    };

    fetchOptions();
  }, []);

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
              placeholder="예매 번호, 이름으로 검색하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="상태 선택" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={ticketTypeFilter} onValueChange={setTicketTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="티켓 유형 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체 티켓</SelectItem>
              {ticketTypeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DatePickerWithRange date={dateRange} onChange={setDateRange} />
        </div>
      </CardContent>
    </Card>
  );
}