import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const navLink = (href: string) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      router.pathname === href
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
    }`

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">C</span>
            <span className="text-lg font-bold text-gray-800">公司信息管理</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link href="/" className={navLink('/')}>首页</Link>
            <Link href="/company/list" className={navLink('/company/list')}>公司列表</Link>
            <Link href="/company/create" className={navLink('/company/create')}>新增公司</Link>
          </nav>
        </div>
      </header>
      <Component {...pageProps} />
    </div>
  )
}
