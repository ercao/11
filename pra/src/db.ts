import sqlite3, { Database } from 'better-sqlite3'
import { RequestType } from './utils.ts'
import { ResponseType } from './utils.ts'

export const REQUEST_TABLE_NAME = 'request'
export const RESPONSE_TABLE_NAME = 'response'

export type RequestRowType<T> = {
  id?: number //
  pages: RequestType<T>['pages'] // 请求页面序列
  capacity: number // 页面容量
  memory_access_time: number // 内存访问时间
  interrupt_handle_time: number // 中断处理时间
  quick_table_access_time: number // 块表访问时间
  quick_table_size: number // 块表大小
  create_time?: Date // 开始时间
}
export type ResponseRowType<T> = {
  id?: number // id
  name: string // 算法名字
  request_id: number // 请求编号
  with_quick: number // 有快表运行时间
  without_quick: number // 无快表运行时间
  create_time?: Date // 创建时间
}

/**
 * 获取数据库
 * @param filename 数据库文件名字默认在内存中
 * @returns
 */
export function createDB(filename: string = ':memory:') {
  const db = sqlite3(filename, {})

  db.prepare(
    `
      create table if not exists ${REQUEST_TABLE_NAME} (
        id INTEGER PRIMARY KEY ASC,                         -- id
        pages TEXT,                                         -- 请求页面
        capacity INTEGER,                                   -- 内存容量
        memory_access_time INTEGER,                         -- 内存访问时间
        interrupt_handle_time INTEGER,                      -- 中断处理时间
        quick_table_access_time INTEGER,                    -- 块表访问时间
        quick_table_size INTEGER,                           -- 块表容量
        create_time TEXT not null default CURRENT_TIMESTAMP -- 创建时间
      )
      `
  ).run()

  db.prepare(
    `
      create table if not exists ${RESPONSE_TABLE_NAME} (
        id INTEGER PRIMARY KEY ASC,                         -- id
        name TEXT,                                          -- 算法名字
        request_id INTEGER,                                 -- 请求编号
        with_quick INTEGER,                                 -- 有快表运行时间
        without_quick INTEGER,                              -- 无快表运行时间
        create_time TEXT not null default CURRENT_TIMESTAMP, -- 创建时间
        FOREIGN KEY(request_id) REFERENCES request(id)
      )
    `
  ).run()

  return db
}

export function closeDB(db: Database) {
  db.close()
}

export function insertForRequest<T>(db: Database, record: RequestRowType<T>) {
  const res = db
    .prepare(
      `
      insert into ${REQUEST_TABLE_NAME}(pages,capacity,memory_access_time,interrupt_handle_time,quick_table_access_time,quick_table_size)
      values (@pages,@capacity,@memory_access_time,@interrupt_handle_time,@quick_table_access_time,@quick_table_size)
    `
    )
    .run({ ...record, pages: JSON.stringify(record.pages) })

  if (res.changes < 1) {
    throw new Error('insertRequestRecord faild')
  }

  return res.lastInsertRowid
}

/**
 * 会并发,开启事务
 * @param db
 * @param record
 * @returns
 */
export function insertForResponse<T>(db: Database, record: ResponseRowType<T>) {
  const transaction = db.transaction(() => {
    const res = db
      .prepare(
        `
        insert into ${RESPONSE_TABLE_NAME}(name,request_id,with_quick,without_quick)
        values (@name,@request_id,@with_quick,@without_quick)
      `
      )
      .run(record)

    if (res.changes < 1) {
      throw new Error('insertForResponse faild')
    }

    return res.lastInsertRowid
  })
  return transaction()
}

export function getAllRequests<T>(db: Database): RequestType<T>[] {
  const records = db
    .prepare(`select * from ${REQUEST_TABLE_NAME}`)
    .all() as any[]

  return records.map((record) => ({
    ...record,
    pages: JSON.parse(record.pages),
  }))
}

export function getOneRequest<T>(
  db: Database,
  id: number
): RequestType<T> | undefined {
  const record = db
    .prepare(`select * from ${REQUEST_TABLE_NAME} where id=?`)
    .get(id) as any

  if (!record) {
    return undefined
  }

  return {
    ...record,
    pages: JSON.parse(record.pages),
  }
}

export function getResponsesByRequestId<T>(
  db: Database,
  requestId: number
): ResponseRowType<T>[] {
  const records = db
    .prepare(`select * from ${RESPONSE_TABLE_NAME} where request_id=?`)
    .all(requestId) as any[]

  return records
}
