import { randomInt } from 'crypto'
import { times } from 'moderndash'
import { Strategy } from './Strategy.ts'
import { QuickTable } from './quickTable.ts'
import {
  INTERRUPT_HANDLE_TIME,
  MEMORY_ACCESS_TIME,
  QUICK_TABLE_ACCESS_TIME,
} from './config.ts'

export type RequestType<T> = { pages: T[]; capacity: number }
export type ResponseType<T> = {
  name: string
  req: RequestType<T>
  hasQTTime: number
  nonQTTime: number
  res: { request: T; pages: T[]; swap?: T; flag: boolean }[]
  ms: number
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

/**
 * 运行
 * @returns [有快表总时间, 无快表总时间]
 */
function run<T>(
  pageReplacement: Strategy<T>,
  quickTable: QuickTable<T>,
  req: RequestType<T> // 快表
): Pick<ResponseType<T>, 'res' | 'hasQTTime' | 'nonQTTime' | 'ms'> {
  const res: ResponseType<T>['res'] = []
  let hasQTTime: number = 0
  let nonQTTime: number = 0

  const startTime = Date.now()

  if (req.capacity > 0) {
    // 快表
    for (const page of req.pages) {
      const quickTableContainFlag = quickTable.contain(page)

      // console.log(quickTable['_strategy'].toArray(), hasQTTime, nonQTTime)
      if (quickTableContainFlag) {
        hasQTTime += QUICK_TABLE_ACCESS_TIME + MEMORY_ACCESS_TIME
      } else {
        hasQTTime += MEMORY_ACCESS_TIME << 1
      }
      nonQTTime += MEMORY_ACCESS_TIME << 1

      const { swap, flag } = pageReplacement.put(page)
      if (flag) {
        quickTable.push(page)
        if (!quickTableContainFlag) {
          hasQTTime += MEMORY_ACCESS_TIME + INTERRUPT_HANDLE_TIME
        }
        nonQTTime += MEMORY_ACCESS_TIME + INTERRUPT_HANDLE_TIME
      }

      res.push({
        request: page,
        pages: pageReplacement.toArray(),
        flag,
        swap,
      })
    }
  }

  const endTime = Date.now()
  return { hasQTTime, nonQTTime, res, ms: endTime - startTime }
}

export { genArray, compare, run }
