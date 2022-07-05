import { Select as AntSelect, SelectProps as AntSelectProps, Spin } from 'antd'
import { FC } from 'react'

type ItemType = { id: any; title: string }

type SelectType = AntSelectProps & {
  items: ItemType[]
}

export const Select: FC<SelectType> = ({ items, ...props }) => {
  const selectedItemsSet = new Set(props.value)

  if (!items) return <Spin spinning />

  return (
    <AntSelect optionLabelProp={'label'} mode="multiple" showSearch {...props}>
      {items.map((item: any) => (
        <AntSelect.Option
          key={item.id}
          label={item.name}
          value={item.id}
          hidden={selectedItemsSet.has(item.id)}
        >
          {item.id} - {item.name}
        </AntSelect.Option>
      ))}
    </AntSelect>
  )
}
