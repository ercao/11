import { Table } from 'components/table'
import dayjs from 'dayjs'
import { PageHeader } from 'components/page-header'
import { AuthorsTag, LabelsTag, StateTag } from 'components/tag'
import Head from 'next/head'

export default function BookListPage() {
  const dataHandler = (data: any) => {
    if (data === undefined) return

    const authors = new Map(
      data.authors.map((author: any) => [author.id, author.name])
    )
    const labels = new Map(
      data.labels.map((label: any) => [
        label.id,
        { name: label.name, color: label.color },
      ])
    )

    console.log(labels)
    return data.books.map((book: any) => ({
      key: book.uuid,
      name: book.name,
      publish: book.publish,
      state: book.state,
      authors: book.authors.map((author: any) => ({
        id: author,
        name: authors.get(author),
      })),
      labels: book.labels.map((label: any) => ({
        id: label,
        name: (labels.get(label) as any).name,
        color: (labels.get(label) as any).color,
      })),
    }))
  }

  return (
    <>
      <Head>
        <title>图书列表</title>
      </Head>
      <PageHeader
        buttons={[{ url: '/book/add', title: '添加图书' }]}
        title={'图书列表'}
      />
      <Table
        endpoint={'book'}
        dataHandler={dataHandler}
        columns={[
          {
            title: '编号',
            dataIndex: 'key',
            key: 'key',
          },
          {
            title: '书名',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '作者',
            dataIndex: 'authors',
            key: 'authors',
            render: (authors) => <AuthorsTag authors={authors} />,
          },
          {
            title: '标签',
            dataIndex: 'labels',
            key: 'labels',
            render: (labels) => <LabelsTag labels={labels} />,
          },
          {
            title: '出版日期',
            dataIndex: 'publish',
            key: 'publish',
            render: (date) => dayjs(date).format('YYYY-MM-DD'),
          },
          {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: (state) => <StateTag state={state} />,
          },
        ]}
      />
    </>
  )
}
