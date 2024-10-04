export interface IBook {
  author_name: string[]
  first_publish_year: number
  format: string[]
  title: string
}
export interface IBookFetchData {
  docs: IBook[]
  numFound: number
}
