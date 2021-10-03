// Ref: https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI ?? '';
const options: any = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

if (!process.env.MONGODB_URI) {
  throw new Error('db: MONGODB_URI was not exported!');
}

const clientObject = new MongoClient(uri, options);
const clientPromise = clientObject.connect();

export const findOne = async (
  collection: string,
  filter: any,
  fields?: any
): Promise<any | undefined> => {
  return new Promise(async (resolve) => {
    const client = await clientPromise;
    client
      .db()
      .collection(collection)
      .findOne(filter, fields ?? {}, (err, record) => {
        if (err) throw new Error(`db:findOne: Failed for ${collection}!`);
        resolve(record ?? undefined);
      });
  });
};

export const find = async (
  collection: string,
  filter: any,
  fields: any,
  offset?: number,
  limit?: number,
  sort?: any
): Promise<any[]> => {
  return new Promise(async (resolve) => {
    const client = await clientPromise;
    client
      .db()
      .collection(collection)
      .find(filter, fields)
      .skip(offset ?? 0)
      .limit(limit ?? 999999)
      .sort(sort ?? { updatedAt: -1 })
      .toArray((err, records) => {
        if (err) throw new Error(`db:find: Failed for ${collection}!`);
        resolve(records ?? []);
      });
  });
};

export const updateMany = async (
  collection: string,
  id: string,
  properties: any
): Promise<void> => {
  return new Promise(async (resolve) => {
    const client = await clientPromise;
    client
      .db()
      .collection(collection)
      .updateMany({ id }, { $set: properties }, { upsert: true }, (err) => {
        if (err) throw new Error(`db:updateMany: Failed for ${collection}!`);
        resolve();
      });
  });
};

export const deleteMany = async (
  collection: string,
  ids: string[]
): Promise<void> => {
  return new Promise(async (resolve) => {
    const client = await clientPromise;
    client
      .db()
      .collection(collection)
      .deleteMany({ email: { $in: ids } }, (err) => {
        if (err) throw new Error(`db:deleteMany: Failed for ${collection}!`);
        return resolve();
      });
  });
};