import { Input } from 'antd'
import { Form, FormItem, SubmitButton } from 'components/form'
import { useRouter } from 'next/router'
import { ajax } from 'utils/fetch'
import { PageHeader } from 'components/page-header'
import Head from 'next/head'
import { random } from 'nanoid'

export default function LabelAddPage() {
  const COLORS = ['#FFFAF0', '#FFE4E1', '#696969', '#DC143C']
  const { push } = useRouter()
  const addHandler = async (values: any) => {
    await ajax('/api/label', {
      method: 'POST',
      body: { ...values, color: COLORS.at(random(1)[0] % COLORS.length) },
    })

    await push('/label')
  }

  return (
    <>
      <Head>
        <title>添加标签</title>
      </Head>
      <PageHeader title={'添加标签'} />
      <Form onFinish={addHandler}>
        <FormItem label={'名称'} name={'name'}>
          <Input />
        </FormItem>

        <FormItem wrapperCol={{ offset: 4 }}>
          <SubmitButton>添加</SubmitButton>
        </FormItem>
      </Form>
    </>
  )
}
