import { DatePicker, Input } from 'antd'
import useSWR from 'swr'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { ajax, getFetcher } from 'utils/fetch'
import { Form, FormItem, SubmitButton, TextArea } from 'components/form'
import { PageHeader } from 'components/page-header'
import { Select } from 'components/select'
import Head from 'next/head'

export default function BookAddPage() {
  const { push } = useRouter()
  const { data: authors } = useSWR('/api/authors', getFetcher)
  const { data: labels } = useSWR('/api/labels', getFetcher)
  const addHandler = async (values: any) => {
    await ajax('/api/book', {
      method: 'POST',
      body: {
        ...values,
        pictures: [],
        publish: dayjs(values.publish).format('YYYY-MM-DD'),
      },
    })
    await push('/book')
  }

  return (
    <>
      <Head>
        <title>添加图书</title>
      </Head>
      <PageHeader title={'添加图书'} />
      <Form onFinish={addHandler}>
        <FormItem name={'name'} label={'书名'}>
          <Input placeholder={'请输入书名'} />
        </FormItem>
        <FormItem label={'作者'} name={'authors'}>
          <Select items={authors} placeholder={'请选择作者'} />
        </FormItem>
        <FormItem label={'标签'} name={'labels'}>
          <Select items={labels} placeholder={'请选择标签'} />
        </FormItem>
        <FormItem label={'出版日期'} name={'publish'}>
          <DatePicker allowClear={false} placeholder={'请输入出版日期'} />
        </FormItem>
        <FormItem label={'描述'} name={'description'}>
          <TextArea />
        </FormItem>

        <FormItem wrapperCol={{ offset: 4 }}>
          <SubmitButton>添加</SubmitButton>
        </FormItem>
      </Form>
    </>
  )
}
