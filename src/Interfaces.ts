// ...
export interface ListItemInterface {
  date: string,
  title: string,
  link: string
}

// SearchResult部分
export interface SearchResultProps {
  value: string,
  arr: Array<any>,
  originData: any
}

export interface SearchResultState {
  targetIndex: number,
  current?: number
}
