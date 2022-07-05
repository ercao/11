import { QueryOptions } from 'mariadb'

export declare type PageQueryType = {
  page: string
  size: string
}

export declare type PaginationType<T> = any & {
  page: number
  size: number
  total: number
  data: T
}
export type CURDFunctionProps = {
  sql: QueryOptions
  title: string
  dataHandler?: (data: any) => Promise<any>
  valuesHandler?: (data: any) => Promise<any>
}
