export interface ITask {
  id: number
  title: string
  content: string
  category_id: number
  priority_id: number
  status: number
  started_at: string
  finished_at: string
  children: ITask[]
  tag_ids: number[]
}

export class Task implements ITask {
  constructor(
    public id: number,
    public title: string,
    public content: string,
    public category_id: number,
    public priority_id: number,
    public status: number,
    public started_at: string,
    public finished_at: string,
    public children: ITask[],
    public tag_ids: number[]
  ) {}
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
