import { common2Fn } from 'utils/api'

export default common2Fn(
  'label',
  {
    sql: {
      sql: 'select * from label limit :begin,:size',
    },
    title: '获取分页数据',
  },
  {
    sql: { sql: 'insert into label(name, color) value (:name, :color);' },
    title: '添加',
  }
)
