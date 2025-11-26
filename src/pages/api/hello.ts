// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// api router visit http://localhost:3000/api/*  http://localhost:3000/api/hello
import type { NextApiRequest, NextApiResponse } from 'next'

import connectToDatabase from '../../lib/mongodb';
import User from '../../models/User'; // 需要自己定义 mongoose schema

type Data = {
  name: string
}

// database - mongoose(MongoDB)
// REST api - add(post)/delete/update(put)/get
// page UI lib(antDesgin/Theme UI（React库）) - Form/list action delete button/update form/list

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    // res.status(200).json({ message: 'MongoDB 连接成功' });
  } catch (error) {
    res.status(500).json({ message: 'MongoDB 连接失败', error: error.message });
  }
  if (req.method === 'GET') {
    // 处理 GET 请求
    // const {count, pid} = req.query;
    // res.status(200).json({ name: 'Anna G', count, pid, message: '这是 GET 请求响应' });
    const users = await User.find({});
    return res.status(200).json(users);
  } else if (req.method === 'POST') {
    // 处理 POST 请求
    res.status(200).json({ message: '这是 POST 请求响应' });
  } else {
    // 处理其他 HTTP 方法或者返回 405 方法不被允许
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


// export default function handler(req, res) {
//   if (req.method === 'GET') {
//     // 处理 GET 请求
//     const {count, pid} = req.query;
//     res.status(200).json({ name: 'Anna G', count, pid, message: '这是 GET 请求响应' });
//   } else if (req.method === 'POST') {
//     // 处理 POST 请求
//     res.status(200).json({ message: '这是 POST 请求响应' });
//   } else {
//     // 处理其他 HTTP 方法或者返回 405 方法不被允许
//     res.setHeader('Allow', ['GET', 'POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

