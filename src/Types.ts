// ...

export type DispatchActionType = {
  type: string,
  payload?: any
};

export interface ListItemInterface {
  title?: string
  link?: string
  date?: string
  name?: string
  mode?: number
  currentIndex?: number
}

type metaItemType = {
  dataIndex: string
};

type ListItemMetasType = {
  title: metaItemType,
  link: metaItemType
};

export type ListItemType = {
  id: number,
  index?: number,
  name: string,
  type: string,
  metas: ListItemMetasType,
  api?: string,
  locked: boolean,
  visible: boolean,
  isSearchHidden: boolean,
};

// App
export interface AppState {
  value: string,
  data: Array<any>,
  result: Array<any>,
  mode: number
}

// SearchResult部分
export interface SearchResultProps {
  // value: string,
  arr: Array<any>,
  // originData: Array<any>,
  tagH?: number,
  // mode: number,
  payload?: any,
  handleEnterKey?: any,
  dispatch?: any,
}

export interface SearchResultState {
  targetIndex: number,
  current?: number
}

export type UseFormAddProps = {
  api: string,
  fieldsStruct: any
}

export type UseFormEditProps = {
  api: string,
  fieldsStruct: any
}