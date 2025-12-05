'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'

const positions = ['매니저', '운영자', '관리자']

export default function AdminRegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    email: '',
    code: '',
    name: '',
    phone: '',
    position: '',
    password: '',
    confirmPassword: '',
  })

  const [codeSent, setCodeSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleEmailAction = async () => {
    if (!form.email) return alert('이메일을 입력해주세요.')

    try {
      if (!codeSent) {
        await api.post('/api/admin/email/send-code', { email: form.email })
        setCodeSent(true)
        alert('인증코드가 전송되었습니다.')
      } else {
        const res = await api.post('/api/admin/email/verify-code', {
          email: form.email,
          code: form.code,
        })
        if (res.data.message === '인증 성공') {
          setIsVerified(true)
          alert('이메일 인증 완료!')
        }
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        alert('이미 등록된 관리자 이메일입니다.')
        return
      }

      const msg =
        err.response?.data?.message || '이메일 인증 중 오류가 발생했습니다.'
      alert(msg)
      console.error('[Email Verify Error]', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isVerified) {
      return alert('이메일 인증을 먼저 완료해주세요.')
    }

    if (form.password !== form.confirmPassword) {
      return alert('비밀번호가 일치하지 않습니다.')
    }

    try {
      await api.post('/api/admin/register', {
        email: form.email,
        name: form.name,
        phone: form.phone,
        position: form.position,
        password: form.password,
      })
      alert('회원가입 완료! 로그인 해주세요.')
      router.push('/auth')
    } catch (err: any) {
      console.error('회원가입 오류:', err.response?.data || err.message)
      alert(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-xl font-bold mb-6 text-center">관리자 회원가입</h1>

        <label className="block text-sm mb-1">이메일</label>
        <div className="flex gap-2 mb-2">
          <input
            type="email"
            value={form.email}
            onChange={e => handleChange('email', e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded"
            disabled={isVerified}
            required
          />
          <button
            type="button"
            onClick={handleEmailAction}
            disabled={isVerified}
            className="bg-red-600 text-white px-3 py-2 rounded text-sm"
          >
            {codeSent ? '인증하기' : '전송하기'}
          </button>
        </div>

        {codeSent && !isVerified && (
          <input
            type="text"
            placeholder="인증코드"
            value={form.code}
            onChange={e => handleChange('code', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />
        )}

        <label className="block text-sm mb-1">이름</label>
        <input
          type="text"
          value={form.name}
          onChange={e => handleChange('name', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        <label className="block text-sm mb-1">전화번호</label>
        <input
          type="tel"
          value={form.phone}
          onChange={e => handleChange('phone', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        <label className="block text-sm mb-1">직책</label>
        <select
          value={form.position}
          onChange={e => handleChange('position', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        >
          <option value="">선택</option>
          {positions.map((p, i) => (
            <option key={i} value={p}>
              {p}
            </option>
          ))}
        </select>

        <label className="block text-sm mb-1">비밀번호</label>
        <input
          type="password"
          value={form.password}
          onChange={e => handleChange('password', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        <label className="block text-sm mb-1">비밀번호 확인</label>
        <input
          type="password"
          value={form.confirmPassword}
          onChange={e => handleChange('confirmPassword', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          회원가입
        </button>
      </form>
    </div>
  )
}