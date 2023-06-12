//
// 最佳置换算法：每次选择淘汰的页面将是以后永不使用，或者在最长时间内不再被访问的页面，这样可以保证最低的缺页率
//
// 需要知道未来的页面请求序列
//

import { HeapPlus } from '../HeapPlus.ts'
import { RequestType, ResponseType, compare } from '../utils.ts'
import { parentPort } from 'worker_threads'

parentPort?.on('message', <T>(req: RequestType<T>) => {
  const res: ResponseType<T>['res'] = []

  const startTime = Date.now()

  // index Map 记录每一页在未来请求序列中的下标
  const indexMap = new Map<T, number[]>()
  req.pages.forEach((page, i) => {
    const indices = indexMap.get(page)
    if (indices !== undefined) {
      indices.push(i)
    } else {
      indexMap.set(page, [i])
    }
  })

  // 每个页面的第一次出现的位置永远不用用到, 所以第一个位置`另作他用
  indexMap.forEach((indices) => {
    indices[0] = 1
    indices.push(Infinity) // Infinity 代表以后不会再有该页面出现了
  })

  if (req.capacity > 0) {
    // 大根堆, 堆顶的是当前内存中 将是以后永不使用，或者在最长时间内不再被访问的页面
    const heapPlus = new HeapPlus<
      { page: T; lessRight: number; time: number },
      T
    >(
      (node) => node.page,
      (n1, n2) => {
        const cmp = compare(n1.lessRight, n2.lessRight)
        return cmp === 0 ? compare(n2.time, n1.time) : cmp
      }
    )

    let time = 0 // 模拟页面访问时间

    for (let i = 0; i < req.pages.length; ++i) {
      let swap: T | undefined
      let flag = false

      const page = req.pages[i]
      const indices = indexMap.get(page)!
      const lessRight = indices[indices[0]++]

      const index = heapPlus.indexOf(page)
      if (index === undefined) {
        swap = undefined
        flag = true

        if (heapPlus.length >= req.capacity) {
          // 需要换出页面 --- 将堆顶元素换出,
          // O(log(Capacity))
          swap = heapPlus.remove(0).page
        }

        // 寻找最近的
        heapPlus.add({ page, lessRight, time })
      } else {
        // 存在该页面, 就更新该页面的下一次出现的位置
        heapPlus.replace({ page, lessRight, time }, index)
      }

      ++time
      res.push({
        request: page,
        pages: [...heapPlus['_elements'].map((elem) => elem.page)],
        swap,
        flag,
      })
    }
  }

  const endTime = Date.now()

  parentPort?.postMessage({
    name: 'OPT 算法',
    req,
    res,
    ms: endTime - startTime,
  })
})
