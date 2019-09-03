export type KeyValuePair<T> = {
  key: string
  value: T
}
export function enumToKeyValuePairs<T>(inum: T): KeyValuePair<T>[] {
  return Object.keys(inum)
    .filter(key => isNaN(key as any))
    .map(key => ({ key, value: (inum as any)[key] }))
}
