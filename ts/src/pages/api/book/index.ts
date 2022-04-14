import { common2Fn, getAuthorAndLabelFromBook } from 'utils/api'
import { randomUUID } from 'crypto'

export default common2Fn(
  'book',
  {
    sql: {
      sql: 'select * from book limit :begin,:size',
    },
    title: '获取分页数据',
    dataHandler: async (page) => {
      return {
        ...page,
        data: await getAuthorAndLabelFromBook(page.data),
      }
    },
  },
  {
    sql: {
      sql: 'insert into book(uuid, name, pictures, description, authors, labels, publish) value (:id, :name, json_array(:pictures), :description, json_array(:authors), json_array(:labels), :publish);',
    },
    title: '添加',
    valuesHandler: async (values) => ({ ...values, id: randomUUID() }),
  }
)
