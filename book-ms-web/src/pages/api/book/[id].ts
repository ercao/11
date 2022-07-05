import { common1Fn } from 'utils/api'

export default common1Fn(
  'book',
  {
    sql: {
      sql: `
          select * from (
              select  b.uuid as uuid, b.name as name, b.pictures as pictures, b.publish as publish, b.authors as authors, b.state as state,  b.description as description, json_arrayagg(JSON_OBJECT('id', l.id, 'name', l.name, 'color', l.color)) as labels
              from (
                  select b.publish, b.uuid, b.name, b.pictures, b.description,b.state,  json_arrayagg(JSON_OBJECT('id', a.id, 'name', a.name))  as authors, b.labels
                  from book b
                      left join author a on json_contains(b.authors, a.id)
                  where uuid=:id
              )as b
              inner join label l on json_contains(b.labels, l.id)) as b
          where b.uuid=:id;
        `,
    },
    title: '获取图书信息',
    dataHandler: async (book: any) => {
      return {
        ...book,
        pictures: JSON.parse(book.pictures),
      }
    },
  },
  {
    sql: {
      sql: 'update book set name=:name, pictures=json_array(:pictures), description=:description,  authors=json_array(:authors),  labels=json_array(:labels),  publish=:publish  where uuid=:id;',
    },
    title: '修改',
  },
  {
    sql: {
      sql: 'delete from book where uuid=:id;',
    },
    title: '删除',
  }
)
