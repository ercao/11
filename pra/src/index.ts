import { Worker } from 'node:worker_threads'
import { ResponseType, genArray } from './utils.ts'
import { randomInt } from 'crypto'
import { inspect } from 'node:util'

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
  worker.on('message', <T>({ name, req, res }: ResponseType<T>) => {
    console.log(name)
    console.log(
      '请求页面序列: ',
      inspect(req.pages, {
        colors: true,
        breakLength: Infinity,
        maxArrayLength: Infinity,
      })
    )
    console.log('最大容量: ', inspect(req.capacity))
    if (res.length > 0) {
      console.table(
        res.map((line) => ({
          请求页: line.request,
          ...line.pages,
          是否缺页: line.flag,
        }))
      )

      console.log()
    }

    worker.terminate()
  })
}

// 随机生成
const [min, max, maxLength] = [0, 8, 20]
const pages = genArray(min, max, maxLength)
const capacity = randomInt(0, pages.length + 1)

// const pages = [8, 1, 2, 3, 1, 4, 1, 5, 3, 4, 1, 4, 3, 2, 3, 1, 2, 8, 1, 2]
// const capacity = 3

for (const worker of workers) {
  worker.postMessage({ pages, capacity })
}
