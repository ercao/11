import { common2Fn } from 'utils/api'

export default common2Fn(
  'author',
  {
    sql: {
      sql: 'select * from author limit :begin,:size',
    },
    title: '获取分页数据',
  },
  {
    sql: {
      sql: 'insert into author(name, avatar, gender, description) value (:name, :avatar,:gender, :description);',
    },
    title: '添加',
  }
)
