import { common1Fn } from 'utils/api'

export default common1Fn(
  'label',
  {
    sql: {
      sql: 'select * from label where id=:id',
    },
    title: '获取标签信息',
  },
  {
    sql: {
      sql: 'update label set name=:name where id=:id;',
    },
    title: '修改',
  },
  {
    sql: {
      sql: 'delete from label where id=:id and (select count(*) from book where json_contains(labels, :id))<=0',
    },
    title: '删除',
  }
)
