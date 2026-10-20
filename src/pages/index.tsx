import Head from 'next/head'
import Link from 'next/link'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>公司信息管理</title>
        <meta name="description" content="Company management CRUD app built with Next.js + MongoDB" />
      </Head>
      <main className={`flex min-h-screen flex-col items-center justify-center p-8 ${inter.className}`}>
        <h1 className="text-4xl font-bold mb-4">公司信息管理</h1>
        <p className="text-gray-500 mb-12 text-center max-w-md">
          基于 Next.js + TypeScript + MongoDB 的公司信息增删改查应用
        </p>

        <div className="grid gap-6 sm:grid-cols-2 w-full max-w-2xl">
          <Link
            href="/company/list"
            className="group rounded-xl border border-gray-200 px-6 py-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50"
          >
            <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
              公司列表 →
            </h2>
            <p className="text-sm text-gray-500">查看、编辑和删除公司信息</p>
          </Link>

          <Link
            href="/company/create"
            className="group rounded-xl border border-gray-200 px-6 py-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50"
          >
            <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
              新增公司 →
            </h2>
            <p className="text-sm text-gray-500">录入一家新的公司信息</p>
          </Link>
        </div>

        <p className="mt-16 text-xs text-gray-400">
          Next.js · React · TypeScript · Tailwind CSS · MongoDB
        </p>
      </main>
    </>
  )
}
