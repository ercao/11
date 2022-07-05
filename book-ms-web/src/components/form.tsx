import styled from '@emotion/styled'
import {
  Button,
  ButtonProps,
  Form as AntForm,
  FormProps as AntFormProps,
  Input,
  Radio as AntRadio,
  RadioGroupProps,
  Typography,
} from 'antd'
import { FC } from 'react'
import { FormItemProps } from 'antd/lib/form/FormItem'
import { TextAreaProps } from 'antd/es/input'

type FormProps = AntFormProps & {}

const UnStyledForm: FC<FormProps> = ({ ...props }) => {
  return <AntForm labelCol={{ span: 4 }} labelAlign={'right'} {...props} />
}

export const Form = styled(UnStyledForm)`
  width: 35rem;
`

type FormItemType = FormItemProps

const UnStyledFormItem: FC<FormItemType> = ({ ...props }) => {
  return <AntForm.Item required {...props} />
}

export const FormItem = styled(UnStyledFormItem)``

type RadiosType = RadioGroupProps & {
  radios: { value: any; title: string }[]
}
export const Radios: FC<RadiosType> = ({ radios, children, ...props }) => {
  return (
    <AntRadio.Group {...props}>
      {radios.map((radio) => (
        <AntRadio value={radio.value} key={radio.value}>
          {radio.title}
        </AntRadio>
      ))}
    </AntRadio.Group>
  )
}

const UnStyleSubmitButton: FC<ButtonProps> = ({ ...props }) => {
  return <Button htmlType={'submit'} {...props} />
}

export const SubmitButton = styled(UnStyleSubmitButton)``

export const TextArea: FC<TextAreaProps> = ({ ...props }) => {
  return (
    <Input.TextArea maxLength={200} style={{ height: '10rem' }} {...props} />
  )
}
export const Text = styled(Typography)`
  font-weight: bold;
  padding: 0.5rem 0;
`
