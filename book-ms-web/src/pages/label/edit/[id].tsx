import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Input, Spin } from 'antd'
import { ajax, getFetcher } from 'utils/fetch'
import { Form, FormItem, SubmitButton } from 'components/form'
import { PageHeader } from 'components/page-header'
import Head from 'next/head'

export default function LabelEditPage() {
  const {
    query: { id },
  } = useRouter()
  const { data: label } = useSWR(id ? `/api/label/${id}` : null, getFetcher)
  if (!label) return <Spin spinning />

  const editHandler = async (value: any) => {
    console.log(label)
    console.log(value)
    await ajax(`/api/label/${id}`, {
      method: 'PUT',
      body: value,
    })
  }

  return (
    <>
      <Head>
        <title>编辑标签</title>
      </Head>
      <PageHeader title={'编辑标签'} />
      <Form initialValues={label} onFinish={editHandler}>
        <FormItem label={'编号'} name={'id'} required={false}>
          <Input readOnly />
        </FormItem>
        <FormItem label={'名字'} name={'name'}>
          <Input />
        </FormItem>

        <FormItem wrapperCol={{ offset: 4 }}>
          <SubmitButton>修改</SubmitButton>
        </FormItem>
      </Form>
    </>
  )
}
