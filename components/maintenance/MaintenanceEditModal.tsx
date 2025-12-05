"use client";

import React, { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/date-range-picker";

type MaintenanceItem = {
  id: number;
  date: string;    
  label: string;
  reason: string;
  imageUrl: string; 
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: number | null;          
  onUpdated?: () => void;  
}

function getDateRangeArray(from: Date, to: Date) {
  const dates: string[] = [];
  const cur = new Date(from);
  cur.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);
  while (cur.getTime() <= end.getTime()) {
    const y = cur.getFullYear();
    const m = `${cur.getMonth() + 1}`.padStart(2, "0");
    const d = `${cur.getDate()}`.padStart(2, "0");
    dates.push(`${y}-${m}-${d}`);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

export default function MaintenanceEditModal({
  open,
  onOpenChange,
  id,
  onUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<MaintenanceItem | null>(null);

  const [labelVal, setLabelVal] = useState("");
  const [reason, setReason] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open || !id) return;
    setLoading(true);
    (async () => {
      try {
        const res = await api.get(`/api/maintenance/${id}`);
        const data: MaintenanceItem = res.data;
        setItem(data);
        setLabelVal(data.label ?? "");
        setReason(data.reason ?? "");
        const [y, m, d] = (data.date ?? "").split("-").map(Number);
        const single = new Date(y, (m || 1) - 1, d || 1);
        setDateRange({ from: single, to: single });
        setPreview(data.imageUrl ? `http://localhost:5040${data.imageUrl}` : null);
      } catch (e) {
        console.error("운휴 항목 불러오기 실패:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, id]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleSave = async () => {
    if (!id || !item) return;

    const effectiveRange: DateRange = dateRange ?? {
      from: new Date(item.date),
      to: new Date(item.date),
    };
    if (!effectiveRange.from || !effectiveRange.to) {
      alert("운휴 기간을 선택하세요.");
      return;
    }

    const dates = getDateRangeArray(effectiveRange.from, effectiveRange.to);
    if (!dates.length) {
      alert("유효한 날짜를 선택하세요.");
      return;
    }

    const file = fileRef.current?.files?.[0] || null;

    setLoading(true);
    try {
      let effectiveImageUrl = item.imageUrl;

      if (file) {
        const form = new FormData();
        form.append("label", labelVal);
        form.append("reason", reason);
        form.append("date", dates[0]);
        form.append("image", file);

        const putRes = await api.put(`/api/maintenance/${id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        effectiveImageUrl = putRes.data?.imageUrl ?? effectiveImageUrl;
      } else {
        // 파일 변경 없음 → JSON PUT
        await api.put(`/api/maintenance/${id}`, {
          label: labelVal,
          reason,
          date: dates[0],
          imageUrl: effectiveImageUrl,
        });
      }
      if (dates.length > 1) {
        await Promise.all(
          dates.slice(1).map((date) =>
            api.post("/api/maintenance", {
              label: labelVal,
              reason,
              date,
              imageUrl: effectiveImageUrl,
            })
          )
        );
      }

      onOpenChange(false);
      onUpdated?.();
    } catch (e) {
      console.error("운휴 항목 수정 실패:", e);
      alert("수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    onOpenChange(false);
    if (fileRef.current) fileRef.current.value = "";
    setPreview(item?.imageUrl ? `http://localhost:5040${item.imageUrl}` : null);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : resetAndClose())}>
      <DialogContent className="max-w-md">
        <DialogDescription className="sr-only">
          선택된 운휴 항목을 등록 폼과 같은 방식으로 수정합니다.
        </DialogDescription>
        <DialogHeader>
          <DialogTitle>운휴 정보 수정</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">불러오는 중...</div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 space-y-3">
            <div className="grid gap-2">
              <Label className="text-sm">운휴 어트랙션 이름</Label>
              <Input
                value={labelVal}
                onChange={(e) => setLabelVal(e.target.value)}
                required
                className="h-8 text-sm"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-sm">운휴 사유</Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="h-8 text-sm"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-sm">운휴 기간</Label>
              <DatePickerWithRange
                date={dateRange}
                onChange={setDateRange}
                numberOfMonths={1}
              />
              <p className="text-xs text-muted-foreground">
                범위를 선택하면 첫째 날은 현재 항목을 수정하고, 나머지 날은 새 항목으로 등록됩니다.
              </p>
            </div>

            <div className="grid gap-2">
              <Label className="text-sm">이미지 (선택)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                ref={fileRef}
                className="h-8 text-sm"
              />
              {preview && (
                <img
                  src={preview}
                  alt="미리보기"
                  className="w-full h-36 object-cover rounded-md"
                />
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={resetAndClose}>취소</Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "저장 중..." : "저장"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}