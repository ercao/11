import { commonGetListFn } from 'utils/api'

export default commonGetListFn('select * from author', async (data) => ({
  data,
  msg: '获取所有作者信息列表成功',
}))
