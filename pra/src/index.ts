import { Worker } from 'node:worker_threads'
import { ResponseType, genArray } from './utils.ts'
import { randomInt } from 'crypto'

import { Listr } from 'listr2'
import { inspect } from 'node:util'
import {
  INTERRUPT_HANDLE_TIME,
  MEMORY_ACCESS_TIME,
  QUICK_TABLE_ACCESS_TIME,
  QUICK_TABLE_SIZE,
} from './config.ts'
import {
  createDB,
  getAllRequests,
  getOneRequest,
  getResponsesByRequestId,
  insertForRequest,
  insertForResponse,
} from './db.ts'
import { program, Option } from 'commander'
import { range, times } from 'moderndash'
import { Table } from 'console-table-printer'

const db = createDB('pra.db')

function runTask(
  min: number,
  max: number,
  maxLength: number,
  capacity: number
) {
  // 随机生成
  const pages = genArray(min, max, maxLength)

  // const pages = times(() => randomInt(min, max + 1), maxLength + 1)
  // const pages = [8, 1, 2, 3, 1, 4, 1, 5, 3, 4, 1, 4, 3, 2, 3, 1, 2, 8, 1, 2]
  // const capacity = 3

  // 插入一条记录
  const requestId = insertForRequest(db, {
    pages,
    capacity,
    memory_access_time: MEMORY_ACCESS_TIME,
    interrupt_handle_time: INTERRUPT_HANDLE_TIME,
    quick_table_access_time: QUICK_TABLE_ACCESS_TIME,
    quick_table_size: QUICK_TABLE_SIZE,
  }) as number

  // console.log('请求页面序列: ', `[${pages.join(',')}]`)
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

  const algoritm = [
    { name: '先进先出', file: 'FIFO' },
    { name: 'LRU', file: 'LRU' },
    { name: 'OPT', file: 'OPT' },
    { name: 'LFU', file: 'LFU' },
  ]

  const tasks = new Listr(
    algoritm.map(({ name, file }) => ({
      task: async (_, task) =>
        new Promise((resolve, reject) => {
          task.title = `正在执行${name}页面置换算法`
          const worker = new Worker(`./src/workers/${file}.ts`, {
            execArgv: ['--loader', 'ts-node/esm', '--no-warnings'],
            name: `${name} thread`,
          })
          worker.on('online', () => {})

          worker.on(
            'message',
            <T>({ name, hasQTTime, nonQTTime, res, ms }: ResponseType<T>) => {
              // 插入一条记录
              insertForResponse(db, {
                name,
                request_id: requestId,
                with_quick: hasQTTime,
                without_quick: nonQTTime,
              })

              // console.log('')

              // console.log(name)

              if (res.length > 0) {
                console.log(
                  '缺页率: ',
                  inspect(
                    Number.parseFloat(
                      (
                        res.reduce(
                          (prev, cur) => prev + (cur.swap ? 1 : 0),
                          0
                        ) / res.length
                      ).toFixed(2)
                    )
                  )
                )

                console.log('有快表模式访问时间: ', hasQTTime)
                console.log('无快表模式访问时间: ', nonQTTime)

                //   console.table(
                //     res.map((line) => ({
                //       请求页: line.request,
                //       ...line.pages,
                //       是否缺页: line.swap !== undefined,
                //     }))
                //   )
              }
              console.log()

              resolve(true)
              task.title = `${name}页面置换算法, 运行${ms}ms`
              worker.terminate()
            }
          )

          worker.postMessage({ pages, capacity })
        }),
    })),
    {
      concurrent: true,
    }
  )

  tasks.run()
}

// console.table(db.pragma('table_info(request)'))
// console.table(db.pragma('table_info(response)'))

/** 查看所有历史记录 */
function history() {
  const requests = getAllRequests<number>(db)

  console.table(requests)
}

/**
 * 查看历史详情
 * @param id 历史记录编号
 */
function historyDetail(id: number) {
  const request = getOneRequest<number>(db, id)
  if (request === undefined) {
    console.error('该历史记录不存在')
    return
  }
  const responses = getResponsesByRequestId<number>(db, id)

  console.log(request)
  console.table(responses)
}

program
  .command('run')
  .description('运行页面置换算法')
  .option('--min <min>', '页面编号最小值', '0')
  .option('--max <max>', '页面标号最大值', '10')
  .option('--max-length <maxLength>', '请求页面序列的最大长度', '10')
  .option('--capacity <capacity>', '内存中页面的容量', '3')
  .action((opts) => {
    const { min, max, maxLength, capacity } = opts
    runTask(
      parseInt(min),
      parseInt(max),
      parseInt(maxLength),
      parseInt(capacity)
    )
  })

program
  .command('history')
  .description('历史记录')
  .option('--id <id>', '历史记录编号')
  .action((opts) => {
    if (opts.id === undefined) {
      history()
    } else {
      historyDetail(parseInt(opts.id))
    }
  })

program.parse()
