// ...
export interface ListItemInterface {
  title?: string
  link?: string
  date?: string
  name?: string
  mode?: number
}

// App
export interface AppState {
  value: string,
  data: Array<any>,
  result: Array<any>,
  mode: number
}

// SearchResult部分
export interface SearchResultProps {
  value: string,
  arr: Array<any>,
  originData: Array<any>,
  mode: number,
  handleEnterKey?: any
}

export interface SearchResultState {
  targetIndex: number,
  current?: number
}
