import { FC } from 'react'
import { Button, Dropdown, Menu, Modal } from 'antd'
import Link from 'next/link'
import { ajax } from 'utils/fetch'
import styled from '@emotion/styled'
import { useSWRConfig } from 'swr'
import { useRouter } from 'next/router'
import qs from 'qs'

type MoreProps = {
  id: string
  endpoint: string
}

const UnStyledMore: FC<MoreProps> = ({ endpoint, id, ...props }) => {
  const { query } = useRouter()
  const { mutate } = useSWRConfig()
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key={'detail'}>
            <Link href={`/${endpoint}/${id}`} passHref>
              <Button type={'text'}>详情</Button>
            </Link>
          </Menu.Item>
          <Menu.Item key={'edit'}>
            <Link href={`/${endpoint}/edit/${id}`} passHref>
              <Button type={'text'}>编辑</Button>
            </Link>
          </Menu.Item>
          <Menu.Item key={'delete'}>
            <Button
              type={'text'}
              onClick={() => {
                Modal.confirm({
                  title: '确定要删除嘛？',
                  onOk: async () => {
                    await ajax(`/api/${endpoint}/${id}`, {
                      method: 'DELETE',
                    })

                    return await mutate(
                      `/api/${endpoint}?${qs.stringify(query)}`
                    )
                  },
                })
              }}
            >
              删除
            </Button>
          </Menu.Item>
        </Menu>
      }
      {...props}
    >
      <span>...</span>
    </Dropdown>
  )
}

export const More = styled(UnStyledMore)``
