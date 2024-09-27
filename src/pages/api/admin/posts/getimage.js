import { Formidable } from 'formidable';
import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';
import { getToken } from 'next-auth/jwt';
import { sanitize } from '@/utils/utils';

export default async function handler(req, res) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) return res.status(401).send({ message: 'Not authorized' });

    const { id: userid, role } = token;

    if (role !== 'admin') {
      return res.status(401).send({ message: 'Not authorized' });
    }

    const { url } = req.query;

    const extension = url.split('.').pop();
    let contentType = '';
    if (extension === 'jpg' || extension === 'jpeg') contentType = 'jpeg';
    if (extension === 'gif') contentType = 'gif';
    if (extension === 'png') contentType = 'png';

    const img = await fetch(url);
    const buffer = await img.arrayBuffer();
    res.setHeader('Content-Type', contentType);
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error getting token or session:', error);
  }
}
