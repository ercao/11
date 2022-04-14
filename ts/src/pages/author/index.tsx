// eslint-disable-next-line react/display-name
import { Table } from 'components/table'
import { PageHeader } from 'components/page-header'
import { StateTag } from 'components/tag'
import Head from 'next/head'

export default function AuthorListPage() {
  const dataHandler = (authors: any) => {
    if (authors === undefined) return
    console.log(authors)
    return authors.map((author: any) => ({
      key: author.id,
      name: author.name,
      gender: author.gender,
      state: author.state,
    }))
  }

  return (
    <>
      <Head>
        <title>作者列表</title>
      </Head>
      <PageHeader
        buttons={[{ url: '/author/add', title: '添加作者' }]}
        title={'作者列表'}
      />
      <Table
        endpoint={'author'}
        dataHandler={dataHandler}
        columns={[
          {
            title: '编号',
            dataIndex: 'key',
            key: 'key',
          },
          {
            title: '名字',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
          },
          {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: (value: 0 | 1) => <StateTag state={value} />,
          },
        ]}
      />
    </>
  )
}
