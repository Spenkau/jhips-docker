export default interface ITask {
  id: number
  title: string
  content: string
  category_id: number
  priority_id: number
  status: number
  parent_id: number | null
  started_at: string
  finished_at: string
  children: ITask[]
  tag_ids: number[]
}

export interface ICategory {
  id: number
  name: string
  slug: string
  parent_id: number
}

export interface ITag {
  id: number,
  name: string,
  slug: string
}
