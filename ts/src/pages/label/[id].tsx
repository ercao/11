import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Card, Spin } from 'antd'
import { getFetcher } from 'utils/fetch'
import { PageHeader } from 'components/page-header'
import { Text } from 'components/form'
import Head from 'next/head'

export default function LabelDetailPage() {
  const {
    query: { id },
  } = useRouter()
  const { data: label } = useSWR(id ? `/api/label/${id}` : null, getFetcher)

  if (!label) return <Spin spinning />

  return (
    <>
      <Head>
        <title>标签详情</title>
      </Head>
      <PageHeader title={'标签详情'} />
      <Card style={{ width: '50rem' }}>
        <Text>编号：{label?.id}</Text>
        <Text>名称：{label?.name}</Text>
        <Text style={{ display: 'flex', alignItems: 'center' }}>
          颜色：
          <span
            style={{
              display: 'inline-block',
              borderRadius: '25%',
              height: '1rem',
              width: '1rem',
              backgroundColor: `${label?.color}`,
            }}
          />
        </Text>
      </Card>
    </>
  )
}
