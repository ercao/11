export type CompareFunc<T> = (a1: T, a2: T) => -1 | 0 | 1

const compare: CompareFunc<number> = (a, b) => {
  if (a < b) {
    return -1
  } else if (a > b) {
    return 1
  } else {
    return 0
  }
}
export {
  compare,
}


