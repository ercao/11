import { randomInt } from 'crypto'
import { times } from 'moderndash'

export type RequestType<T> = { pages: T[]; capacity: number }
export type ResponseType<T> = {
  name: string
  req: RequestType<T>
  res: { request: T; pages: T[]; flag: boolean }[]
}

export type GenArray = (min: number, max: number, maxLength: number) => number[]

const genArray: GenArray = (min, max, maxLength) => {
  return times(() => randomInt(min, max + 1), randomInt(0, maxLength + 1))
}

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

export { genArray, compare }
