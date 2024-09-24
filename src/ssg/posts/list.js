import { getRecords } from '@/vidashy-sdk/dist/backend';

async function listRecords(page = 1, pageSize = 20, search = '') {
  const params = {
    page,
    pageSize,
    filter: {},
  };
  if (search) {
    params.filter = {
      and: [
        {
          or: [
            {
              title: { regex: `.*${search}.*`, optionsRegex: 'i' },
            },
            { description: { regex: `.*${search}.*`, optionsRegex: 'i' } },
          ],
        },
      ],
    };
  }
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

async function getRecord(url) {
  const params = {
    filter: { Url: url },
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

async function getPosts(page = 1, pageSize = 20, search = '') {
  let resp = await listRecords(page, pageSize, search);

  if (!resp || !resp.records || resp.records.length === 0) return false;

  //REMOVE SENSIBLE DATA OF RECORDS
  resp.records.map((_record) => {
    delete _record._id;
    delete _record.updatedAt;
    _record.Photos.map((photo) => {
      delete photo.private_url;
      delete photo.key;
    });
  });

  return { ...resp };
}

async function getPost(slug) {
  let resp = await getRecord(`/servicios-y-casos/${slug}`);

  if (!resp || !resp.records || resp.records.length === 0) return false;

  //REMOVE SENSIBLE DATA OF RECORDS
  resp.records.map((_record) => {
    delete _record._id;
    delete _record.updatedAt;
    _record.Photos.map((photo) => {
      delete photo.private_url;
      delete photo.key;
    });
  });

  return resp.records;
}

export { getPosts, getPost };
