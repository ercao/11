import { message } from 'antd'
import { ResultType } from 'types/api'

const fetcher = (method: string) => {
  return async <T>(...arg: any): Promise<any> => {
    const result: ResultType<T> = await (await fetch(arg, { method })).json()
    if (!result.data) {
      // message.error(result.msg)
      return Promise.reject(new Error(result.msg))
    }

    return Promise.resolve(result.data)
  }
}

export const postFetcher = fetcher('POST')
export const getFetcher = fetcher('GET')
export const putFetcher = fetcher('PUT')
export const deleteFetcher = fetcher('DELETE')

type AjaxConfig = Omit<RequestInit, 'body'> & {
  body?: Record<string, any>
}
/**
 * 添加 删除 修改
 * @param endpoint
 * @param extraConfig
 */
// eslint-disable-next-line no-undef
export const ajax = async (
  endpoint: string,
  { body, callback, ...config }: AjaxConfig & { callback?: () => void }
) => {
  console.log(body, config, endpoint)
  // eslint-disable-next-line no-undef
  const defaultConfig: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    body: JSON.stringify(body),
    ...config,
  }

  const res = await fetch(endpoint, defaultConfig)
  const result: ResultType<any> = await res.json()
  console.log(result)
  if (result.code === 200) {
    message.success(result.msg)
  } else {
    message.error(result.msg)
  }
}
