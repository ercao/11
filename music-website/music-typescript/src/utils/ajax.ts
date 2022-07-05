import qs from 'qs'
import { ResultType } from 'src/types/entity'

export const apiBaseUrl = 'http://192.168.122.1:8080/api'

// eslint-disable-next-line no-undef
interface Config extends RequestInit {
  token?: string
  data?: object | string | number
}

export const ajax = async <T>(endpoint: string, { data, headers, token, ...customConfig }: Config = {}) => {
  const config = {
    method: 'GET',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': data ? 'application/json' : '',
      ...headers,
    },
    ...customConfig,
  }

  if (config.method.toUpperCase() === 'GET') {
    endpoint += `?${qs.stringify(data)}`
  } else {
    config.body = JSON.stringify(data || {})
  }

  // axios 和 fetch 的表现不一样，axios可以直接在返回状态不为2xx的时候抛出异常
  return window.fetch(`${apiBaseUrl}/${endpoint}`, config).then(async (response) => {
    const result = await response.json()
    if (response.ok) {
      return result as ResultType<T>
    } else {
      return Promise.reject(result)
    }
  })
}
