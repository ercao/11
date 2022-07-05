import { useRouter } from 'next/router'
import { Input, Spin } from 'antd'
import useSWR from 'swr'
import { ajax, getFetcher } from 'utils/fetch'
import { Form, FormItem, Radios, SubmitButton, TextArea } from 'components/form'
import { PageHeader } from 'components/page-header'
import Head from 'next/head'

export default function AuthorEditPage() {
  const {
    push,
    query: { id },
  } = useRouter()
  const { data: author } = useSWR(id ? `/api/author/${id}` : null, getFetcher)

  if (!author) return <Spin spinning />

  const editHandler = async (value: any) => {
    console.log(author)
    console.log(value)
    await ajax(`/api/author/${id}`, {
      method: 'PUT',
      body: { ...value, avatar: author.avatar },
    })

    await push('/author')
  }

  return (
    <>
      <Head>
        <title>编辑作者</title>
      </Head>
      <PageHeader title={'编辑作者'} />
      <Form initialValues={author} onFinish={editHandler}>
        <FormItem label={'编号'} name={'id'} required={false}>
          <Input readOnly />
        </FormItem>
        <FormItem label={'名字'} name={'name'}>
          <Input />
        </FormItem>

        <FormItem label={'性别'} name={'gender'}>
          <Radios
            radios={[
              { value: '男', title: '男' },
              { value: '女', title: '女' },
              { value: '未知', title: '未知' },
            ]}
          />
        </FormItem>
        <FormItem label={'简介'} name={'description'}>
          <TextArea />
        </FormItem>

        <FormItem wrapperCol={{ offset: 4 }}>
          <SubmitButton>修改</SubmitButton>
        </FormItem>
      </Form>
    </>
  )
}
