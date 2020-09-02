// ...
export interface ListItemInterface {
  title?: string
  link?: string
  date?: string
  name?: string
  mode?: number
  currentIndex?: number
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
  // originData: Array<any>,
  tagH: number,
  mode: number,
  handleEnterKey?: any
}

export interface SearchResultState {
  targetIndex: number,
  current?: number
}
