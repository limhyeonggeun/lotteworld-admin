"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import MaintenanceEditModal from "./MaintenanceEditModal";

interface MaintenanceItem {
  id: number;
  date: string;
  label: string;
  reason: string;
  imageUrl: string;
}

interface MaintenanceListProps {
  groupedItems: [string, MaintenanceItem[]][];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  selectedItems: number[];
  toggleSelect: (id: number) => void;
  handleDelete: () => void;
  onUpdated?: () => void;
}

export default function MaintenanceList({
  groupedItems,
  currentPage,
  totalPages,
  onPageChange,
  selectedItems,
  toggleSelect,
  handleDelete,
  onUpdated,
}: MaintenanceListProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const openEdit = () => {
    if (selectedItems.length !== 1) {
      alert("수정은 하나만 선택해 주세요.");
      return;
    }
    setEditingId(selectedItems[0]);
    setEditOpen(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {groupedItems.length > 0 ? (
        groupedItems.map(([date, dateItems]) => (
          <div key={date} className="mb-6 border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white">{date}</h3>
              <div className="space-x-2">
                <button
                  className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
                  onClick={openEdit}
                  disabled={selectedItems.length !== 1}
                >
                  수정
                </button>
                <button
                  className="text-sm text-red-600 hover:underline disabled:text-gray-400"
                  onClick={handleDelete}
                  disabled={selectedItems.length === 0}
                >
                  삭제
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="flex gap-4">
                {dateItems.map((item) => (
                  <label
                    key={item.id}
                    className="min-w-[200px] bg-white dark:bg-gray-800 border rounded-md p-3 shadow-sm relative cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="absolute top-2 right-2 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <img
                      src={`https://lotteworld-backend-production.up.railway.app${item.imageUrl}`}
                      alt={item.label}
                      className="h-24 w-full object-cover rounded mb-2"
                    />
                    <p className="text-sm text-center font-medium">{item.label}</p>
                    <p className="text-sm text-center text-gray-600 dark:text-gray-300">{item.reason}</p>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">등록된 운휴 정보가 없습니다.</p>
      )}

      <div className="flex justify-center mt-4 space-x-2 no-print">
        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          이전
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            variant="outline"
            size="sm"
            className={currentPage === i + 1 ? "bg-blue-50 text-blue-600" : ""}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          다음
        </Button>
      </div>

      <MaintenanceEditModal
        open={editOpen}
        onOpenChange={setEditOpen}
        id={editingId}
        onUpdated={onUpdated}
      />
    </div>
  );
}