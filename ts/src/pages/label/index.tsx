import { Table } from 'components/table'
import { PageHeader } from 'components/page-header'
import Head from 'next/head'

export default function AuthorListPage() {
  const dataHandler = (labels: any) => {
    if (labels === undefined) return
    console.log(labels)
    return labels.map((label: any) => ({
      key: label.id,
      name: label.name,
    }))
  }

  return (
    <>
      <Head>
        <title>标签列表</title>
      </Head>
      <PageHeader
        buttons={[{ url: '/label/add', title: '添加标签' }]}
        title={'标签列表'}
      />
      <Table
        endpoint={'label'}
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
        ]}
      />
    </>
  )
}
