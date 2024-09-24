import { getRecords } from '@/vidashy-sdk/dist/backend';
import { Formidable } from 'formidable';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { sanitize } from '@/utils/utils';

async function getRecord(_uid) {
  const params = {
    filter: { _uid },
  };

  return await getRecords({
    backend_url: process.env.VIDASHY_URL,
    organization: process.env.VIDASHY_ORGANIZATION,
    database: process.env.VIDASHY_DATABASE,
    object: 'posts',
    api_key: process.env.VIDASHY_API_KEY,
    v: '1.1',
    params,
  });
}

async function addLike(_uid) {
  const records = await getRecord(_uid);
  if (!records || !records.records || records.records.length === 0)
    return false;

  const record = records.records[0];
  const likes = Number.parseInt(record.Likes || 0);
  const formData = new FormData();

  formData.append('_uid', _uid);
  formData.append('Likes', sanitize(likes + 1));

  try {
    const url = `${process.env.VIDASHY_URL}${process.env.VIDASHY_ORGANIZATION}/${process.env.VIDASHY_DATABASE}/posts`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.VIDASHY_API_KEY}`,
      },
      method: 'PATCH',
      body: formData,
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
    const { _uid } = req.query;

    let response = await addLike(_uid);

    if (!response)
      return res
        .status(404)
        .send({ data: records, message: 'Records Not found' });

    res.status(200).json({ response });
  } catch (error) {
    console.error('Error getting token or session:', error);
  }
}
