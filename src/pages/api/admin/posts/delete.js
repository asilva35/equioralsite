import fetch from 'node-fetch';
import { getToken } from 'next-auth/jwt';
import { sanitize, generateUUID } from '@/utils/utils';

async function deleteRecord(uid) {
  try {
    const url = `${process.env.VIDASHY_URL}${
      process.env.VIDASHY_ORGANIZATION
    }/${process.env.VIDASHY_DATABASE}/posts?uid=${sanitize(uid)}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.VIDASHY_API_KEY}`,
      },
      method: 'DELETE',
    });
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

export default async function handler(req, res) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) return res.status(401).send({ message: 'Not authorized' });

    const { id: userid, role } = token;

    if (role !== 'admin') {
      return res.status(401).send({ message: 'Not authorized' });
    }

    const { uid } = req.query;
    const validation = {};

    if (!uid) {
      validation.uid = 'Field Required';
    }

    //EVALUATE IF VALIDATION IS NOT EMPTY
    if (Object.keys(validation).length > 0) {
      return res.status(500).send({
        message: 'Record could not be processed',
        validation,
      });
    }

    const response = await deleteRecord(uid);

    if (!response)
      return res
        .status(500)
        .send({ message: 'Record could not be processed ' });

    res.status(200).json({ response });
  } catch (error) {
    console.error('Error getting token or session:', error);
  }
}
