import { Formidable } from 'formidable';
import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';
import { getToken } from 'next-auth/jwt';
import { sanitize, generateUUID } from '@/utils/utils';

export const config = {
  api: {
    bodyParser: false,
  },
};

function getSlug(texto) {
  // Convertir a minúsculas
  let url = texto.toLowerCase();

  // Quitar acentos y otros caracteres especiales
  url = url
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, ''); // \w representa letras, números y guiones bajos

  // Reemplazar espacios y otros caracteres no alfanuméricos por guiones
  url = url.replace(/\s+/g, '-');

  // Eliminar guiones repetidos
  url = url.replace(/-+/g, '-');

  // Eliminar guiones al principio y al final
  url = url.substr(0, 1) === '-' ? url.substr(1, url.length) : url;
  url = url.substr(-1) === '-' ? url.substr(0, url.length - 1) : url;
  return url.trim('');
}

async function createRecord(fields, files) {
  const formData = new FormData();

  formData.append('Title', sanitize(fields.title[0]));
  formData.append('Description', sanitize(fields.description[0]));
  formData.append('Date', sanitize(fields.date[0]));
  formData.append('Photos', `Photo|${fields.count_photos[0]}`);
  formData.append(
    'Url',
    sanitize(`/servicios-y-casos/${getSlug(fields.title[0])}`)
  );

  const count_photos = Number.parseInt(fields.count_photos[0]);

  for (var i = 0; i < count_photos; i++) {
    formData.append(
      `Photo-${i + 1}`,
      fs.createReadStream(files[`Photo-${i + 1}`][0].filepath)
    );
    formData.append(
      `Photo-${i + 1}-name`,
      files[`Photo-${i + 1}`][0].originalFilename
    );
    formData.append(
      `Photo-${i + 1}-mimetype`,
      files[`Photo-${i + 1}`][0].mimetype
    );
    formData.append(`Photo-${i + 1}-id`, generateUUID(6));
  }

  try {
    const url = `${process.env.VIDASHY_URL}${process.env.VIDASHY_ORGANIZATION}/${process.env.VIDASHY_DATABASE}/posts`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.VIDASHY_API_KEY}`,
      },
      method: 'POST',
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
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) return res.status(401).send({ message: 'Not authorized' });

    const { id: userid, role } = token;

    if (role !== 'admin') {
      return res.status(401).send({ message: 'Not authorized' });
    }

    const form = new Formidable();
    const [formFields, files] = await form.parse(req);

    const validation = {};

    const fields = formFields || {};

    if (!fields.title || !fields.title[0] || fields.title[0] === '') {
      validation.title = 'Field Required';
    }
    if (
      !fields.description ||
      !fields.description[0] ||
      fields.description[0] === ''
    ) {
      validation.description = 'Field Required';
    }
    if (!fields.date || !fields.date[0] || fields.date[0] === '') {
      validation.date = 'Field Required';
    }

    if (
      !fields.count_photos ||
      !fields.count_photos[0] ||
      fields.count_photos[0] === '0'
    ) {
      validation.Photos = 'Field Required';
    }

    //EVALUATE IF VALIDATION IS NOT EMPTY
    if (Object.keys(validation).length > 0) {
      return res.status(500).send({
        message: 'Record could not be processed',
        validation,
      });
    }

    const response = await createRecord(fields, files);

    if (!response)
      return res
        .status(500)
        .send({ message: 'Record could not be processed ' });

    res.status(200).json({ response });
  } catch (error) {
    console.error('Error getting token or session:', error);
  }
}
