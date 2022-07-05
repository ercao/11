import { Table as AntTable, TableProps } from 'antd'
import useSWR from 'swr'
import { PaginationType } from 'types'
import { useRouter } from 'next/router'
import qs from 'qs'
import { getFetcher } from 'utils/fetch'
import styled from '@emotion/styled'
import { More } from './more'

/**
 * 表格
 */
type ListProps<T> = TableProps<T> & {
  endpoint: string
  dataHandler: (data: T) => any
}

function UnStyleTable<T>({
  endpoint,
  dataHandler,
  columns,
  ...props
}: ListProps<T>) {
  const { push, query } = useRouter()
  const { data } = useSWR(`/api/${endpoint}?${qs.stringify(query)}`, getFetcher)
  const pagination: PaginationType<T> = data

  return (
    <>
      <AntTable
        pagination={{
          position: ['bottomCenter'],
          current: pagination?.page,
          pageSize: pagination?.size,
          // hideOnSinglePage: true,
          total: pagination?.total,
          onChange: async (page, size) => {
            await push({ query: { ...query, page, size } })
          },
        }}
        loading={!data}
        style={{ width: '100%' }}
        scroll={{ x: true }}
        dataSource={dataHandler(pagination?.data)}
        // @ts-ignore
        columns={columns?.concat([
          {
            title: '更多',
            render: (record) => <More id={record.key} endpoint={endpoint} />,
          },
        ])}
        {...props}
      />
    </>
  )
}

export const Table = styled(UnStyleTable)`
  user-select: none;
`
