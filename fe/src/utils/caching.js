
class LocalStorageCache {
  constructor(name) {
    this.name = name;
    this.bucket = [];
  }

  _preloadBucket() {
    this.bucket = JSON.parse(localStorage.getItem(this.name))
  }

  _saveBucket() {
    localStorage.setItem(this.name, JSON.stringify(this.bucket))
  }

  get(id) {
    this._preloadBucket()
    return this.bucket[id]
  }

  push(docs) {
    this._preloadBucket()
    for(const doc of docs) {
      this.bucket[doc._id] = doc
    }
    this._saveBucket()
  }

  filter(filter) {
    this._preloadBucket()
    return Object.values(this.bucket).filter(filter)
  }
}

export default {
  users: new LocalStorageCache('user'),
}

