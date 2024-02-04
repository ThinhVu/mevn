export function generateRandomCode(length: number) {
  let output = '';
  for (let i = 0; i < length; ++i) {
    const useNumber = randomBoolean()
    if (useNumber) {
      output += String.fromCharCode(randomNumberInRange(48, 57))
    } else {
      output += String.fromCharCode(randomNumberInRange(65, 90))
    }
  }
  return output;
}

export function randomBoolean() {
  return Math.floor(Math.random() * 5) % 2 == 0
}

export function randomNumberInRange(lower: number, upper: number) {
  return lower + Math.floor(Math.random() * (upper - lower))
}

export function getRandomSubarray(arr: Array<any>, size: number) {
  const shuffled = arr.slice(0); // Create a copy of the original array
  let i = arr.length;
  while (i--) {
    const rand = Math.floor((i + 1) * Math.random()); // Generate a random index
    [shuffled[i], shuffled[rand]] = [shuffled[rand], shuffled[i]]; // Swap elements
  }
  return shuffled.slice(0, size); // Get the first 'size' elements
}

export function randomPick(arr: Array<any>) {
  return arr[Math.floor(Math.random() * arr.length)]
}