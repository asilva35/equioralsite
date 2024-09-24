import { Formidable } from 'formidable';
import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';
import { getToken } from 'next-auth/jwt';
import md5 from 'md5';
import utils from '@/utils/utils';
import axios from 'axios';
const { v4: uuidv4 } = require('uuid');

export const config = {
  api: {
    bodyParser: false,
  },
};

async function createRecord(record) {
  const api_url = `${process.env.VIDASHY_URL}${process.env.VIDASHY_ORGANIZATION}/${process.env.VIDASHY_DATABASE}/media`;

  try {
    const new_record = utils.sanitizeOBJ({
      ...record,
      id: uuidv4(),
    });

    const response = await axios({
      method: 'post',
      url: api_url,
      headers: {
        Authorization: `Bearer ${process.env.VIDASHY_API_KEY}`,
      },
      data: new_record,
    });
    return response.data ? new_record : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function handler(req, res) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) return res.status(401).send({ message: 'Not authorized' });

  const { id: userid, role } = token;

  if (role !== 'admin') {
    return res.status(401).send({ message: 'Not authorized' });
  }

  const { fieldsForm, files } = await new Promise((resolve, reject) => {
    const form = new Formidable();
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      resolve({ fields, files });
    });
  });

  const formData = new FormData();

  console.log(files);
  return;

  formData.append('file', fs.createReadStream(files.file[0].filepath));
  formData.append('name', files.file[0].originalFilename);
  formData.append('mimetype', files.file[0].mimetype);
  formData.append('title', 'Custom Title');

  try {
    const url = `${process.env.VIDASHY_URL}media/${process.env.VIDASHY_ORGANIZATION}/${process.env.VIDASHY_DATABASE}/posts?id=dd`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.VIDASHY_API_KEY}`,
      },
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();

      const record = {
        url: data.URL,
        key: data.Key,
      };

      res.status(200).json({
        success: true,
        record,
      });
    } else {
      const message = await response.text();
      res.status(500).json({
        success: false,
        message,
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Code Error 0025',
    });
  }
}
