import useSWR from 'swr'
import { Card, Divider, Image, Skeleton, Spin, Typography } from 'antd'
import { useRouter } from 'next/router'
import { getFetcher } from 'utils/fetch'
import { PageHeader } from 'components/page-header'
import { FC, useState } from 'react'
import { AuthorsTag, LabelsTag, StateTag } from 'components/tag'
import { Text } from 'components/form'
import Head from 'next/head'
import dayjs from 'dayjs'

type PictureProps = {
  images: string[]
}

const Pictures: FC<PictureProps> = ({ images }) => {
  const [visible, setVisible] = useState(false)
  if (!images) return <Spin spinning />
  const urls =
    images.length > 0
      ? images
      : [
          'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
        ]
  return (
    <>
      <Head>
        <title>图书详情</title>
      </Head>
      <Image
        preview={{ visible: false }}
        width={200}
        height={300}
        src={urls[0]}
        placeholder={true}
        onClick={() => setVisible(true)}
        alt={'图片'}
      />
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}
        >
          {urls?.map((url, index) => (
            <Image key={index} alt={'图片'} src={url} />
          ))}
        </Image.PreviewGroup>
      </div>
    </>
  )
}

export default function BookDetailPage() {
  const {
    query: { id },
  } = useRouter()
  const { data: book } = useSWR(id ? `/api/book/${id}` : null, getFetcher)

  return (
    <>
      <PageHeader title={'图书详情'} />
      <Card style={{ width: '50rem' }}>
        <Skeleton loading={!book} active>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Pictures images={book?.pictures} />
            <div>
              <Card style={{ border: 'none' }}>
                <Text>编号：{book?.uuid}</Text>
                <Text>书名：{book?.name}</Text>
                <Text>
                  作者：
                  <AuthorsTag authors={book?.authors} />
                </Text>
                <Text>
                  标签：
                  <LabelsTag labels={book?.labels} />
                </Text>
                <Text>出版：{dayjs(book?.publish).format('YYYY-MM-DD')}</Text>
                <Text>
                  状态：
                  <StateTag state={book?.state} />
                </Text>
              </Card>
            </div>
          </div>
          <Divider />
          <Typography style={{ textIndent: '2rem' }}>
            {book?.description}
          </Typography>
        </Skeleton>
      </Card>
    </>
  )
}
