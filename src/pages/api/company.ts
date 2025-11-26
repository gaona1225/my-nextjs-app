// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// api router visit http://localhost:3000/api/*  http://localhost:3000/api/hello
import type { NextApiRequest, NextApiResponse } from 'next'

import connectToDatabase from '../../lib/mongodb';
import Company from '../../models/Company';


export default async function handler(req, res) {
  try {
    await connectToDatabase();
    // res.status(500).json({ message: 'MongoDB connect success'});
  } catch (error) {
    res.status(500).json({ message: 'MongoDB connect fail', error: error.message });
  }
  
  if (req.method === 'GET') {
    let resp = await Company.find();
    // console.log('get Resp:', resp);
    res.status(200).json(resp);
  } else if (req.method === 'POST') {
    const {key, name, founder, year, address} = JSON.parse(req.body);
    await Company.create({key, name, founder, year, address});
    res.status(200).json({ msg: `save success`, type: 'success'});
  } else if (req.method === 'PUT') {
    const {key, name, founder, year, address} = JSON.parse(req.body);
    // console.log('new name:', name);
    await Company.findOneAndUpdate({key: key}, {name, founder, year, address})
    res.status(200).json({ message: '这是 Update 请求响应' });
  } if (req.method === 'DELETE') {
    const {id} = req.query;
    await Company.findOneAndDelete({key: id}).exec();
    res.status(200).json({ msg: `delete ${id} success`, type: 'success'});
  } else {
    // 处理其他 HTTP 方法或者返回 405 方法不被允许
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

