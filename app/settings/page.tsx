"use client"

import SettingsForm from "@/components/settings/SettingsForm";
import Layout from "@/components/layout/Layout";

export default function SettingsPage() {
  return (
    <Layout title="관리자 설정">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">관리자 설정</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              서비스 운영에 필요한 관리자 환경을 설정할 수 있습니다.
            </p>
          </div>
        </div>
        <SettingsForm />
      </div>
    </Layout>
  );
}