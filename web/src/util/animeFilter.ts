import { pipe, range, map, append, prepend } from "ramda"

import { FilterSelectItem } from "../components/common/FilterSelect"

import { enumToKeyValuePairs } from "./enum"

const allOption = {
  text: "All",
  value: null
}

export const generateFilterSelectItemsFromRange = (
  from: number,
  to: number,
  withoutAll?: boolean
) => {
  const items = pipe(
    () => range(from, to),
    map<number, FilterSelectItem>(year => ({
      text: year.toString(),
      value: year
    }))
  )()
  if (withoutAll) return items
  return append(allOption, items)
}

export const generateFilterSelectItemsUntilYear = (
  year: number,
  withoutAll?: boolean
) => generateFilterSelectItemsFromRange(2002, year + 1, withoutAll)

export const enumToFilterSelectItems = (inum: any, withoutAll?: boolean) => {
  const items = enumToKeyValuePairs(inum).map(pair => ({
    text: pair.key,
    value: pair.value
  }))
  if (withoutAll) return items
  return prepend<FilterSelectItem>(allOption, items)
}
