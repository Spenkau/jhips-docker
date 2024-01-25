import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { ICategory } from 'app/entities/category/category.model';
import { ITag } from 'app/entities/tag/tag.model';

export interface ITask {
  id: number;
  title?: string | null;
  content?: string | null;
  priorityId?: number | null;
  statusId?: number | null;
  // categoryId?: number | null;
  startedAt?: dayjs.Dayjs | null;
  finishedAt?: dayjs.Dayjs | null;
  owner?: Pick<IUser, 'id'> | null;
  category?: ICategory | null;
  tags?: ITag[] | null;
}

export type NewTask = Omit<ITask, 'id'> & { id: null };
