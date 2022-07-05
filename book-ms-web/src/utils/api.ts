import { manipulate, query, queryOne, queryPage } from 'db/db'
import { ResultType } from 'types/api'
import { NextApiRequest, NextApiResponse } from 'next'
import { CURDFunctionProps } from 'types'

/**
 * 异步返回自身
 * @param data
 */
export const id = async (data: any) => data

/**
 * 通用陆游转发函数
 * @param forward
 */
export const commonRouterFn =
  (forward: (method: string, body: any, query: any) => Promise<any>) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const resBody = forward(
      req.method?.toLocaleUpperCase() as string,
      req.body,
      req.query
    )

    resBody
      .then((body) => {
        res.status(200).json(resultSuccess(body))
      })
      .catch((e: Error) => {
        console.log(e)
        res.status(500).json(resultFailure({ ...e, code: 500 }))
      })
  }

/**
 * 通用获取列表路由
 * @param sql
 * @param callback
 */
export const commonGetListFn =
  <T>(sql: string, callback: (data: T) => Promise<ResultType<T>>) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method?.toLocaleUpperCase()
    if (method === 'GET') {
      const data = await query({ sql })

      res.status(200).json(resultSuccess(await callback(data)))
    } else {
      res.status(403).end(resultFailure({ msg: '禁止访问' }))
    }
  }

export const common1Fn = (
  endpoint: string,
  oneFnProps: CURDFunctionProps,
  updateFnProps: CURDFunctionProps,
  removeFnProps: CURDFunctionProps
) => {
  const one = async (
    { sql, title, dataHandler = id, valuesHandler = id }: CURDFunctionProps,
    values?: any
  ) => {
    const data = await queryOne(sql, await valuesHandler(values))

    return trueOrFalse(
      data,
      {
        data: await dataHandler(data),
        msg: `${title}成功`,
      },
      {
        msg: `${title}失败`,
      }
    )
  }

  const manipulateFn = async (
    { sql, title, valuesHandler = id }: CURDFunctionProps,
    values?: any
  ) => {
    const effectRows = await manipulate(sql, await valuesHandler(values))
    return trueOrFalseForManipulate(effectRows, title)
  }

  return commonRouterFn((method, body, query) => {
    switch (method) {
      case 'GET':
        return one(oneFnProps, { id: query.id })
      case 'PUT':
        return manipulateFn(updateFnProps, { ...body, id: query.id })
      case 'DELETE':
        return manipulateFn(removeFnProps, { id: query.id })
      default:
        return Promise.reject(new Error('禁止访问'))
    }
  })
}

export const common2Fn = (
  endpoint: string,
  pageFnProps: CURDFunctionProps,
  addFnProps: CURDFunctionProps
) => {
  const page = async (
    { sql, title, dataHandler = id, valuesHandler = id }: CURDFunctionProps,
    values?: any
  ) => {
    const data = await queryPage(sql.sql, await valuesHandler(values))
    return trueOrFalse(
      true,
      {
        data: await dataHandler(data),
        msg: `${title}成功`,
      },
      {}
    )
  }

  const add = async (
    { sql, title, valuesHandler = id }: CURDFunctionProps,
    values?: any
  ) => {
    return trueOrFalseForManipulate(
      await manipulate(sql, await valuesHandler(values)),
      title
    )
  }

  return commonRouterFn((method, body, query) => {
    switch (method) {
      case 'GET':
        return page(pageFnProps, {
          table: endpoint,
          page: '1',
          size: '5',
          ...query,
        })
      case 'POST':
        return add(addFnProps, { ...body })
      default:
        return Promise.reject(new Error('禁止访问'))
    }
  })
}

export async function getAuthorAndLabelFromBook(books: any) {
  books = books.map((book: any) => ({
    ...book,
    pictures: JSON.parse(book.pictures),
    authors: JSON.parse(book.authors),
    labels: JSON.parse(book.labels),
  }))

  const authorIds = Array.from(
    new Set(books.map((book: any) => book.authors).flat())
  )
  const authors = await query(
    {
      sql: `select id, name from author where json_contains(:ids, id)`,
    },
    { ids: '['.concat(authorIds.toLocaleString(), ']') }
  )

  const labIds = Array.from(
    new Set(books.map((book: any) => book.labels).flat())
  )
  const labels = await query(
    {
      namedPlaceholders: true,
      sql: `select id, name, color from label where json_contains(:ids, id);`,
    },
    { ids: '['.concat(labIds.toLocaleString(), ']') }
  )

  return { books, authors, labels }
}

/**
 * 操作成功
 * @param data
 * @param msg
 * @param code
 */
export const resultSuccess = <T>({
  data,
  msg = 'ok',
  code = 200,
}: ResultType<T>): ResultType<T> => {
  return { msg, code, data }
}

/**
 * 操作失败
 * @param msg
 * @param code
 */
export const resultFailure = ({
  msg,
  code = 500,
}: ResultType<undefined>): ResultType<undefined> => {
  return { msg, code }
}

export const trueOrFalse = (bool: boolean, a: any, b: any) =>
  bool ? Promise.resolve(a) : Promise.reject(b)

export const trueOrFalseForManipulate = (effectRows: number, title: string) =>
  trueOrFalse(effectRows > 0, { msg: `${title}成功` }, { msg: `${title}失败` })
