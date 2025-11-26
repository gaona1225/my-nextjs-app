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
  const {id} = req.query;
  let resp = await Company.findOne({key: id});
  // console.log('gaona--resp:', resp);
  res.status(200).json(resp);
}

