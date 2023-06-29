import KV from '../db/models/kv'
import {encrypt, decrypt} from '../utils/crypto'

export async function getAll() {
   const kvs = await KV.find().lean()
   for (const kv of kvs) {
      if (kv.isSecret) {
         // @ts-ignore
         kv.encrypted = kv.value
         kv.value = decrypt(kv.value, process.env.KV_SECRET)
      }
   }
   return kvs;
}

export async function get(k) {
   const doc = await KV.findOne({key: k}).lean()
   return doc || {_id: undefined, key: k, value: undefined}
}

export async function getValue(k) {
   const kvDoc = await KV.findOne({key: k});
   if (!kvDoc) return undefined
   return kvDoc.isSecret ? decrypt(kvDoc.value, process.env.KV_SECRET) : kvDoc.value;
}

export async function set(k, v, isSecret) {
   return KV.updateOne({key: k}, {value: isSecret ? encrypt(v, process.env.KV_SECRET) : v, isSecret}, {upsert: true})
}

export async function remove(k) {
   return KV.deleteOne({key: k})
}
