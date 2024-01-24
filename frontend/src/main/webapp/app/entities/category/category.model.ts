import { IUser } from 'app/entities/user/user.model';

export interface ICategory {
  id: number;
  name?: string | null;
  owner?: Pick<IUser, 'id'> | null;
}

export type NewCategory = Omit<ICategory, 'id'> & { id: null };
