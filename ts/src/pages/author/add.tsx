import { Input, Radio } from 'antd'
import { useRouter } from 'next/router'
import { ajax } from 'utils/fetch'
import { Form, FormItem, SubmitButton, TextArea } from 'components/form'
import { PageHeader } from 'components/page-header'
import Head from 'next/head'

export default function AuthorAddPage() {
  const { push } = useRouter()
  const addHandler = async (value: any) => {
    await ajax('/api/author', {
      method: 'POST',
      body: value,
    })

    await push('/author')
  }

  return (
    <>
      <Head>
        <title>添加作者</title>
      </Head>
      <PageHeader title={'添加作者'} />
      <Form
        initialValues={{
          name: '张三',
          description: '张三是狗',
          avatar: '000',
          gender: '男',
        }}
        onFinish={addHandler}
      >
        <FormItem label={'名字'} name={'name'} required>
          <Input />
        </FormItem>

        <FormItem label={'头像'} name={'avatar'} required>
          <Input />
        </FormItem>

        <FormItem label={'性别'} name={'gender'} required>
          <Radio.Group>
            <Radio value={'男'}>男</Radio>
            <Radio value={'女'}>女</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem label={'简介'} name={'description'} required>
          <TextArea />
        </FormItem>

        <FormItem wrapperCol={{ offset: 4 }}>
          <SubmitButton>添加</SubmitButton>
        </FormItem>
      </Form>
    </>
  )
}
