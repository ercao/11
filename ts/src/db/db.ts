import { createConnection, QueryOptions } from 'mariadb'
import logger from 'pino'

type SqlFunction = (sql: QueryOptions, values?: any) => any

const dbHost = process.env.DB_HOST as string
const dbPort = parseInt(process.env.DB_PORT as string)
const dbUser = process.env.DB_USER as string
const dbPassword = process.env.DB_PASSWORD as string
const db = process.env.DB_DATABASE as string

/**
 * 获取连接并执行相应的Sql语句
 * @param sql
 * @param values
 */
const getConnection: SqlFunction = async (sql, values) => {
  try {
    const conn = await createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: db,
    })
    logger().info('数据库连接成功')
    const result = await conn.query(
      {
        namedPlaceholders: true,
        bigIntAsNumber: true,
        ...sql,
      },
      values
    )
    await conn.end()
    return result
  } catch (e) {
    logger().error(e)
  }
}

/**
 * 获取表记录数
 * @param table
 */
export const total = async (table: string) => {
  const total = await query({
    bigIntAsNumber: true,
    sql: `select count(1) as total from ${table}`,
  })

  return total.length > 0 ? total[0].total : -1
}

/**
 * 查询类 Sql
 * @param sql
 * @param value
 */
export const query: SqlFunction = async (sql, value) => {
  const result = await getConnection(sql, value)

  return result?.filter(() => true)
}

/**
 * 获取单条数据
 * @param sql
 * @param value
 */
export const queryOne: SqlFunction = async (sql, value) => {
  const result = await query(sql, value)
  return result.length > 0 ? result[0] : null
}

/**
 * 分页查询
 * @param sql
 * @param table
 * @param p
 * @param s
 * @param values
 */
export const queryPage = async (
  sql: string,
  { table, page: p, size: s, ...values }: Record<string, any>
) => {
  const size = parseInt(s)
  const page = parseInt(p)
  const begin = (page - 1) * size

  const data = await query(
    {
      namedPlaceholders: true,
      sql,
    },
    { ...values, begin, size }
  )

  return { total: await total(table), page, size, data }
}

/**
 * 操纵类Sql
 * @param sql
 * @param values
 */
export const manipulate: SqlFunction = async (sql, values) => {
  const result = await getConnection(sql, values)
  console.log(result)
  return result.affectedRows
}
