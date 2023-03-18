export async function copyToClipboard(content) {
  await navigator.clipboard.writeText(content)
}

export function removeCarry(v) { return v.replace('\r', '') }

export function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
