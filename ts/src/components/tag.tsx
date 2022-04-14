import { Tag as AntTag, TagProps as AntTagProps } from 'antd'
import { FC } from 'react'
import styled from '@emotion/styled'
import Link from 'next/link'

type StateTagProps = AntTagProps & {
  state: 0 | 1
}

const UnStyledStateTag: FC<StateTagProps> = ({ state, children, ...props }) => {
  return <AntTag {...props}>{state ? '正常' : '禁用'}</AntTag>
}

export const StateTag = styled(UnStyledStateTag)((props) => ({
  color: props.state ? 'green' : 'red',
}))

type AuthorTagProps = AntTagProps & {
  authors: { id: string; name: string }[]
}
const UnStyledAuthorsTag: FC<AuthorTagProps> = ({
  authors,
  children,

  ...props
}) => {
  return (
    <>
      {authors?.map((author) => (
        <Link key={author.id} href={`/author/${author.id}`} passHref>
          <AntTag {...props}>{author.name}</AntTag>
        </Link>
      ))}
    </>
  )
}
export const AuthorsTag = styled(UnStyledAuthorsTag)``

type LabelTagProps = AntTagProps & {
  labels: { id: string; name: string; color: string }[]
}
const UnStyleLabelsTag: FC<LabelTagProps> = ({
  labels,
  children,
  ...props
}) => {
  return (
    <>
      {labels?.map((label) => (
        <Link key={label.id} href={`/label/${label.id}`} passHref>
          <AntTag color={label.color} {...props}>
            {label.name}
          </AntTag>
        </Link>
      ))}
    </>
  )
}
export const LabelsTag = styled(UnStyleLabelsTag)()
