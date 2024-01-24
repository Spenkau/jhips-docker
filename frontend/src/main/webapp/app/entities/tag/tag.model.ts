import { IUser } from 'app/entities/user/user.model';
import { ITask } from 'app/entities/task/task.model';

export interface ITag {
  id: number;
  name?: string | null;
  owner?: Pick<IUser, 'id'> | null;
  tasks?: ITask[] | null;
}

export type NewTag = Omit<ITag, 'id'> & { id: null };
