import {MongoClient, Db, Collection} from 'mongodb';

let client: MongoClient, db: Db;

export function getColl<TSchema = any>(name: string) : Collection<TSchema> {
   return db.collection<TSchema>(name)
}

async function connect() {
   try {
      const parts = process.env.DATABASE_URL.split('/')
      const dbName = parts.length > 3 ? parts[3].split('?')[0] : 'test';
      console.log(`[mongodb] Connecting to database ${dbName}`)
      client = new MongoClient(process.env.DATABASE_URL);
      db = client.db(dbName);
      console.log('[mongodb] Connected to server!')
   } catch (error) {
      console.error('[mongodb] Failed to connect. Reason:', error)
      process.exit(1)
   }
}

export default async function mongodb() {
   console.log('[plugin] mongodb')
   await connect()
}
