import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Card, Divider, Skeleton, Spin, Typography } from 'antd'
import { getFetcher } from 'utils/fetch'
import { PageHeader } from 'components/page-header'
import { Text } from 'components/form'
import { StateTag } from 'components/tag'
import Head from 'next/head'
import { css } from '@emotion/react'

export default function AuthorDetailPage() {
  const {
    query: { id },
  } = useRouter()
  const { data: author } = useSWR(id ? `/api/author/${id}` : null, getFetcher)

  if (!author) return <Spin spinning />

  return (
    <>
      <Head>
        <title>作者详情</title>
      </Head>
      <PageHeader title={'作者详情'} />
      <Card
        css={css`
          width: 50rem;
        `}
      >
        <Skeleton loading={!author} active>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Card style={{ border: 'none' }}>
              <Text>编号：{author?.id}</Text>
              <Text>名字：{author?.name}</Text>
              <Text>性别：{author?.gender}</Text>
              <Text>
                状态：
                <StateTag state={author?.state} />
              </Text>
            </Card>
          </div>
          <Divider />
          <Typography style={{ textIndent: '2rem' }}>
            {author?.description}
          </Typography>
        </Skeleton>
      </Card>
    </>
  )
}
