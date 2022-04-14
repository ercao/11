import {
  Button,
  Divider,
  PageHeader as AntPageHeader,
  PageHeaderProps as AntPageHeaderProps,
} from 'antd'
import { useRouter } from 'next/router'
import { FC } from 'react'
import styled from '@emotion/styled'

type PageHeaderProps = AntPageHeaderProps & {
  buttons?: [{ url: string; title: string }]
}

const UnStyledPageHeader: FC<PageHeaderProps> = ({ buttons, ...props }) => {
  const router = useRouter()
  return (
    <>
      <AntPageHeader
        extra={buttons?.map((button) => (
          <Button
            key={button.url}
            type={'primary'}
            onClick={() => router.push(button.url)}
          >
            {button.title}
          </Button>
        ))}
        {...props}
      />
      <Divider />
    </>
  )
}

export const PageHeader = styled(UnStyledPageHeader)`
  padding: 10px 0;
`
