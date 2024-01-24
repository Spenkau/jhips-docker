import dayjs from 'dayjs/esm';
import { ITask } from 'app/entities/task/task.model';
import { IUser } from 'app/entities/user/user.model';

export interface IComment {
  id: number;
  content?: string | null;
  createdAt?: dayjs.Dayjs | null;
  task?: ITask | null;
  owner?: Pick<IUser, 'id'> | null;
}

export type NewComment = Omit<IComment, 'id'> & { id: null };
