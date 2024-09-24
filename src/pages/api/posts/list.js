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

export default async function handler(req, res) {
  try {
    const { page, pageSize, status, search } = req.query;

    let records = await listRecords(page, pageSize, status, search);

    if (!records || !records.records || records.records.length === 0)
      return res
        .status(404)
        .send({ data: records, message: 'Records Not found' });

    //REMOVE SENSIBLE DATA OF RECORDS
    records.records.map((_record) => {
      delete _record._id;
      delete _record.updatedAt;
      _record.Photos.map((photo) => {
        delete photo.private_url;
        delete photo.key;
      });
    });

    res.status(200).json({ data: records });
  } catch (error) {
    console.error('Error getting token or session:', error);
  }
}
