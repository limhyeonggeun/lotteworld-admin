"use client"

import { NoticeSection } from "@/components/noticesfaq/noticesection";
import { FaqSection } from "@/components/noticesfaq/faqsection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FAQ, Notice, faqs as defaultFaqs, notices as defaultNotices } from "@/lib/noticesfaqdata";

export default function NoticesFaqPage() {
  const [activeTab, setActiveTab] = useState("notices");
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [notices, setNotices] = useState<Notice[]>(defaultNotices);
  const [faqs, setFaqs] = useState<FAQ[]>(defaultFaqs);
  return (
    <Layout title="공지사항 및 FAQ">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">공지사항 및 FAQ</h1>
            <p className="text-sm text-gray-500">
              시스템 공지사항과 자주 묻는 질문을 조회하고 관리할 수 있습니다.
            </p>
          </div>
          <div className="flex gap-2">
            {activeTab === "notices" ? (
              <Button variant="outline" onClick={() => setNoticeModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> 새 공지 등록
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setFaqModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> 새 FAQ 등록
              </Button>
            )}
          </div>
        </div>
        <Tabs
          defaultValue="notices"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="notices">공지사항</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          <TabsContent value="notices" className="space-y-0">
            <NoticeSection
              notices={notices}
              externalTriggerCreate={noticeModalOpen}
              onFinishCreate={() => setNoticeModalOpen(false)}
            />
          </TabsContent>
          <TabsContent value="faq" className="space-y-0">
            <FaqSection
              faqs={faqs}
              externalTriggerCreate={faqModalOpen}
              onFinishCreate={() => setFaqModalOpen(false)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
