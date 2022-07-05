import { commonGetListFn, getAuthorAndLabelFromBook } from 'utils/api'

export default commonGetListFn('select * from book', async (data) => ({
  data: await getAuthorAndLabelFromBook(data),
  msg: '获取所有图书信息列表成功',
}))
