import { commonGetListFn } from 'utils/api'

export default commonGetListFn('select * from label', async (data) => ({
  data,
  msg: '获取所有标签信息列表成功',
}))
