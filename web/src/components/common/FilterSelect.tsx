import React from "react"
import { Row, Typography, Select } from "antd"

import "./FilterSelect.scss"

export type FilterSelectItem = {
  text: string
  value: any
}
export type FilterSelectProps = {
  label: string
  items: FilterSelectItem[]
  defaultValue?: any
  disabled?: boolean
  onChange?: (option: any) => void
}
const FilterSelect: React.FC<FilterSelectProps> = props => (
  <div>
    <Row type="flex" justify="start">
      <Typography.Text className="filter-select_select-label">
        {props.label}
      </Typography.Text>
    </Row>
    <Row>
      <Select
        key={props.items.length}
        disabled={props.disabled}
        onSelect={(option: any) => props.onChange && props.onChange(option)}
        defaultValue={
          props.defaultValue || (props.items[0] && props.items[0].value)
        }
        dropdownMatchSelectWidth={false}
        className="filter-select_select">
        {props.items.map((item, i) => (
          <Select.Option key={i} value={item.value}>
            <Typography.Text>{item.text}</Typography.Text>
          </Select.Option>
        ))}
      </Select>
    </Row>
  </div>
)
export default FilterSelect
