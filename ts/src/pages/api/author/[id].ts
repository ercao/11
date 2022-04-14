import { common1Fn } from 'utils/api'

export default common1Fn(
  'author',
  {
    sql: {
      sql: `select * from author where id=:id;`,
    },
    title: '获取作者信息',
  },
  {
    sql: {
      sql: 'update author set name=:name, avatar=:avatar, gender=:gender, description=:description where id=:id;',
    },
    title: '修改',
  },
  {
    sql: {
      sql: 'delete from author where id=:id and (select count(*) from book where json_contains(authors, :id))<=0;',
    },
    title: '删除',
  }
)
