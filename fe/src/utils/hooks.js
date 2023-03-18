export default function makeHook() {
  const ehMap = {}
  return {
    on(event, handler) {
      if (typeof handler !== 'function') {
        throw new Error('Invalid handler')
      }
      if (!ehMap[event]) {
        ehMap[event] = []
      }
      ehMap[event].push(handler)
    },
    off(event, handler) {
      if (!ehMap || !ehMap[event]) {
        return
      }
      if (!handler) {
        ehMap[event] = []
      } else {
        ehMap[event] = ehMap[event].filter(h => h !== handler)
      }
    },
    trigger(event, ...data) {
      const ehs = ehMap[event]
      if (!ehs) {
        return
      }
      for (const eh of ehs) {
        const rs = eh(...data)
        const isPromise = rs && typeof rs.then === 'function';
        if (isPromise)
          rs.then().catch(console.error)
      }
    }
  }
}
