export class Hooks {
  constructor() {
    this.handlers = []
  }
  add(handler) {
    this.handlers.push(handler)
  }
  remove(handler) {
    const hid = this.handlers.find(item => item === handler)
    if (hid >= 0)
      this.handlers.splice(hid, 1)
  }
  execute(...args) {
    for(const handler of this.handlers) {
      handler(...args)
    }
  }
}
