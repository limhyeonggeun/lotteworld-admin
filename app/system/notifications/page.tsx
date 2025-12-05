"use client"

import { useEffect, useState } from "react";
import { AlertFilters } from "@/components/alerts/alertfilters";
import { AlertsTable } from "@/components/alerts/alertstable";
import { CreateEditAlertDrawer } from "@/components/alerts/createeditalertdrawer";
import { ViewAlertModal } from "@/components/alerts/viewalertmodal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Send, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import type { Alert } from"@/lib/alertTypes";
import Layout from "@/components/layout/Layout";
import api from "@/lib/axios";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [recipientFilter, setRecipientFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 10;

  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const tabOptions = [
    { key: "all", label: "전체 알림" },
    { key: "system", label: "시스템" },
    { key: "ride_closed", label: "운휴 알림" },
    { key: "ride_resumed", label: "운행 재개" },
    { key: "event", label: "이벤트" },
    { key: "parade", label: "퍼레이드" },
  ];

  const tabTypeMap: Record<string, Alert["type"] | Alert["type"][] | null> = {
    all: null,
    system: "system",
    ride_closed: "ride_closed",
    ride_resumed: "ride_resumed",
    event: "event",
    parade: "parade",
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get("/api/notifications");
        const data: Alert[] = res.data;

        const deduped = data.filter((alert, i, self) => {
          if (alert.recipient !== "all_users") return true;
          return i === self.findIndex(
            (a) =>
              a.recipient === "all_users" &&
              a.title === alert.title &&
              a.content === alert.content &&
              a.type === alert.type &&
              a.deliveryTime === alert.deliveryTime
          );
        });

        setAlerts(deduped);
      } catch (err) {
        console.error("❌ 알림 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const handleSelectAlert = (id: string, checked: boolean) => {
    setSelectedAlerts((prev) =>
      checked ? [...prev, id] : prev.filter((alertId) => alertId !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAlerts(filteredAlerts.map((alert) => alert.id));
    } else {
      setSelectedAlerts([]);
    }
  };

  const handleViewAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setViewModalOpen(true);
  };

  const handleEditAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setEditDrawerOpen(true);
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (!confirm("이 알림을 삭제하시겠습니까?")) return;
  
    try {
      await api.delete(`/api/notifications/${alertId}`);
  
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== alertId));
      setSelectedAlerts((prevSelected) => prevSelected.filter((id) => id !== alertId));
    } catch (err) {
      console.error("알림 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleResendAlert = (alertId: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, status: "scheduled" } : alert
      )
    );
  };

  const handleCancelAlert = (alertId: string) => {
    console.log(`Cancel alert: ${alertId}`);
  };

  const handleBulkDelete = async () => {
    try {
      await api.post("/api/notifications/bulk-delete", {
        ids: selectedAlerts,
      });
      setAlerts((prev) => prev.filter((alert) => !selectedAlerts.includes(alert.id)));
      setSelectedAlerts([]);
    } catch (err) {
      console.error("일괄 삭제 실패:", err);
    }
  };

  const handleBulkResend = async () => {
    try {
      await api.post("/api/notifications/bulk-resend", {
        ids: selectedAlerts,
      });
  
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) =>
          selectedAlerts.includes(alert.id) ? { ...alert, status: "scheduled" } : alert
        )
      );
  
      setSelectedAlerts([]);
    } catch (err) {
      console.error("일괄 재전송 실패:", err);
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      searchQuery === "" ||
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    const matchesRecipient = recipientFilter === "all" || alert.recipient === recipientFilter;
    const matchesMethod = methodFilter === "all" || alert.deliveryMethod === methodFilter;
    const tabType = tabTypeMap[activeTab];
    const matchesTab =
      tabType === null ||
      (Array.isArray(tabType) ? tabType.includes(alert.type) : alert.type === tabType);
    return matchesSearch && matchesStatus && matchesRecipient && matchesMethod && matchesTab;
  });

  const totalPages = Math.ceil(filteredAlerts.length / alertsPerPage);
  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * alertsPerPage,
    currentPage * alertsPerPage
  );

  const stats = {
    total: alerts.length,
    scheduled: alerts.filter((a) => a.status === "scheduled").length,
    sent: alerts.filter((a) => a.status === "sent").length,
    failed: alerts.filter((a) => a.status === "failed").length,
  };

  if (loading) {
    return (
      <Layout title="알림 관리">
        <div className="text-center text-gray-500 mt-10">⏳ 알림 데이터를 불러오는 중...</div>
      </Layout>
    );
  }

  return (
    <Layout title="알림 관리">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">알림 관리</h1>
            <p className="text-sm text-gray-500">시스템 알림을 생성하고 관리할 수 있습니다.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCreateDrawerOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> 새 알림 생성
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">총 알림</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Send className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">예약됨</p>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
              </div>
              <Clock className="w-8 h-8 text-indigo-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">전송됨</p>
                <p className="text-2xl font-bold">{stats.sent}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">실패</p>
                <p className="text-2xl font-bold">{stats.failed}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="shadow gap-2">
            {tabOptions.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>

          {tabOptions.map((tab) => (
            <TabsContent key={tab.key} value={tab.key} className="space-y-4">
              {selectedAlerts.length > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {selectedAlerts.length}개 알림이 선택되었습니다.
                      </span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={handleBulkResend}>
                          일괄 재전송
                        </Button>
                        <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                          일괄 삭제
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <AlertFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                recipientFilter={recipientFilter}
                setRecipientFilter={setRecipientFilter}
                methodFilter={methodFilter}
                setMethodFilter={setMethodFilter}
              />

              <Card>
                <CardHeader>
                  <CardTitle>알림 목록 ({filteredAlerts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredAlerts.length > 0 ? (
                    <AlertsTable
                      alerts={paginatedAlerts}
                      selectedAlerts={selectedAlerts}
                      onSelectAlert={handleSelectAlert}
                      onSelectAll={handleSelectAll}
                      onViewAlert={handleViewAlert}
                      onEditAlert={handleEditAlert}
                      onDeleteAlert={handleDeleteAlert}
                      onResendAlert={handleResendAlert}
                      onCancelAlert={handleCancelAlert}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setCurrentPage={setCurrentPage}
                    />
                  ) : (
                    <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <CreateEditAlertDrawer
          isOpen={createDrawerOpen}
          onClose={() => setCreateDrawerOpen(false)}
          mode="create"
          alert={null}
          alerts={alerts}
          onCreateAlert={(newAlert) => setAlerts([...alerts, newAlert])}
          onUpdateAlert={(updatedAlert) =>
            setAlerts(alerts.map((a) => (a.id === updatedAlert.id ? updatedAlert : a)))
          }
        />

        <CreateEditAlertDrawer
          isOpen={editDrawerOpen}
          onClose={() => setEditDrawerOpen(false)}
          mode="edit"
          alert={selectedAlert}
          alerts={alerts}
          onCreateAlert={(newAlert) => setAlerts([...alerts, newAlert])}
          onUpdateAlert={(updatedAlert) =>
            setAlerts(alerts.map((a) => (a.id === updatedAlert.id ? updatedAlert : a)))
          }
        />

        <ViewAlertModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          alert={selectedAlert}
        />
      </div>
    </Layout>
  );
}
