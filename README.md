# my-nextjs-app

My first Next.js project: a company management CRUD app built with Next.js (Pages Router), TypeScript and MongoDB.

## Tech stack

- Next.js 13 (Pages Router) · React 18 · TypeScript
- Tailwind CSS · Ant Design
- MongoDB + Mongoose (via Next.js API routes)

## Features

- Company management: list / create / edit pages (`src/pages/company/`)
- API routes for company data (`src/pages/api/company.ts`, `companyDetail.ts`)
- Mongoose models (`src/models/`) with a cached database connection to survive hot reloads (`src/lib/mongodb.js`)

## Getting started

```bash
npm install
# create .env.local first:
# MONGODB_URI=your-mongodb-connection-string
# 启动.env.local数据库连接
npm run dev
