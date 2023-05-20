import { Worker } from 'node:worker_threads'
import { ResponseType, genArray } from './utils.ts'
import { randomInt } from 'crypto'
import { inspect } from 'node:util'
import {
  INTERRUPT_HANDLE_TIME,
  MEMORY_ACCESS_TIME,
  QUICK_TABLE_ACCESS_TIME,
  QUICK_TABLE_SIZE,
} from './config.ts'

const workers = [
  //
  'FIFO',
  'LRU',
  'OPT',
  'LFU',
].map(
  (name) =>
    new Worker(`./src/workers/${name}.ts`, {
      execArgv: ['--loader', 'ts-node/esm', '--no-warnings'],
      name: `${name} thread`,
    })
)

for (const worker of workers) {
  worker.on('online', () => {})

  // 处理
  worker.on(
    'message',
    <T>({ name, hasQTTime, nonQTTime, res }: ResponseType<T>) => {
      console.log('')

      console.log(name)

      if (res.length > 0) {
        console.log(
          '缺页率: ',
          inspect(
            Number.parseFloat(
              (
                res.reduce((prev, cur) => prev + (cur.swap ? 1 : 0), 0) /
                res.length
              ).toFixed(2)
            )
          )
        )

        console.log('有快表模式访问时间: ', hasQTTime)
        console.log('无快表模式访问时间: ', nonQTTime)

        console.table(
          res.map((line) => ({
            请求页: line.request,
            ...line.pages,
            是否缺页: line.swap !== undefined,
          }))
        )
      }
      console.log()
      worker.terminate()
    }
  )
}

// 随机生成
const [min, max, maxLength] = [0, 8, 20]
const pages = genArray(min, max, maxLength)
const capacity = randomInt(0, pages.length + 1)

// const pages = [8, 1, 2, 3, 1, 4, 1, 5, 3, 4, 1, 4, 3, 2, 3, 1, 2, 8, 1, 2]
// const capacity = 3

console.log(
  '请求页面序列: ',
  inspect(pages, {
    colors: true,
    breakLength: Infinity,
    maxArrayLength: Infinity,
  })
)
console.log(
  '驻留内存页面个数:',
  inspect(capacity),
  '内存存取时间:',
  inspect(MEMORY_ACCESS_TIME),
  '驻留快表页面个数:',
  inspect(QUICK_TABLE_SIZE),
  '快表存取时间:',
  inspect(QUICK_TABLE_ACCESS_TIME),
  '缺页中断时间:',
  inspect(INTERRUPT_HANDLE_TIME)
)

console.log()

for (const worker of workers) {
  worker.postMessage({ pages, capacity })
}
