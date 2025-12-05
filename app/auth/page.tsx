'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/axios'
import { useUser } from '@/context/UserContext'

export default function AdminLoginPage() {
  const router = useRouter()
  const { setUser } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    try {
      const res = await api.post('/api/admin/login', { email, password })
      const { token, id, name } = res.data

      localStorage.setItem('adminToken', token)
      setUser({
        id: id || 0,
        name: name || '관리자',
        email,
        token,
      })

      router.push('/dashboard')
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          '로그인 중 오류가 발생했습니다. 이메일 또는 비밀번호를 확인해주세요.'
      )
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-xl font-bold mb-6 text-center">관리자 로그인</h1>

        <label className="block mb-2 text-sm font-medium">이메일</label>
        <input
          type="email"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm font-medium">비밀번호</label>
        <input
          type="password"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          로그인
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">아직 관리자 계정이 없으신가요?</p>
          <Link
            href="/auth/register"
            className="mt-2 text-red-600 hover:underline text-sm font-medium inline-block"
          >
            관리자 회원가입
          </Link>
        </div>
      </form>
    </div>
  )
}