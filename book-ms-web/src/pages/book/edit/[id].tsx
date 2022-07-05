import { DatePicker, Input, Spin } from 'antd'
import useSWR from 'swr'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import moment from 'moment'
import { ajax, getFetcher } from 'utils/fetch'
import { Form, FormItem, SubmitButton, TextArea } from 'components/form'
import { Select } from 'components/select'
import { PageHeader } from 'components/page-header'
import Head from 'next/head'

export default function BookEditPage() {
  const {
    query: { id },
  } = useRouter()
  const { data: authors } = useSWR('/api/authors', getFetcher)
  const { data: labels } = useSWR('/api/labels', getFetcher)
  const { data: book } = useSWR(id ? `/api/book/${id}` : null, getFetcher)
  if (!book || !authors || !labels) return <Spin spinning />

  const editHandler = async (values: any) => {
    await ajax(`/api/book/${id}`, {
      method: 'PUT',
      body: {
        ...values,
        pictures: book.pictures,
        publish: dayjs(values.publish).format('YYYY-MM-DD'),
      },
    })
  }

  return (
    <>
      <Head>
        <title>编辑图书</title>
      </Head>
      <PageHeader title={'编辑图书'} />
      <Form
        onFinish={editHandler}
        initialValues={{
          ...book,
          authors: book.authors.map((author: any) => author.id),
          labels: book.labels.map((label: any) => label.id),
          publish: moment(book.publish),
        }}
      >
        <FormItem name={'uuid'} label={'编号'} required={false}>
          <Input readOnly />
        </FormItem>
        <FormItem name={'name'} label={'书名'}>
          <Input />
        </FormItem>
        <FormItem label={'作者'} name={'authors'}>
          <Select items={authors} placeholder={'请选择作者'} />
        </FormItem>
        <FormItem label={'标签'} name={'labels'}>
          <Select placeholder="请选择标签" items={labels} />
        </FormItem>
        <FormItem label={'出版日期'} name={'publish'}>
          <DatePicker allowClear={false} />
        </FormItem>
        <FormItem label={'描述'} name={'description'}>
          <TextArea />
        </FormItem>
        <FormItem wrapperCol={{ offset: 4 }}>
          <SubmitButton>修改</SubmitButton>
        </FormItem>
      </Form>
    </>
  )
}
