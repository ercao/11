export declare type BookType = {
  uuid: string
  name: string
  pictures: [string]
  description: string
  authors: { id: number; name: string }
  labels: { id: number; name: string }
  publish: string
  state: string
}

export declare type BooksType = {
  books: {
    uuid: string
    name: string
    pictures: [string]
    description: string
    authors: [number]
    labels: [number]
    publish: string
    state: string
  }[]
  authors: { id: number; name: string }[]
  labels: { id: number; name: string }[]
}

export declare type AuthorType = {
  id: string
  name: string
  avatar: string
  gender: string
  description: string
  state: string
}

export declare type AuthorsType = [AuthorType]

export declare type LabelType = {
  id: string
  name: string
  state: string
}

export declare type LabelsType = [LabelType]
