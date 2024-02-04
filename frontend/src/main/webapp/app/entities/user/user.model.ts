export interface IUser {
  id: number;
  login?: string;
}

export interface IPrivateUser {
  id: number,
  login?: string,
  email?: string,
  firstName?: string,
  lastName?: string,
  imageUrl?: string,
  createdBy?: string,
  createdAt?: string
}

export class User implements IUser {
  constructor(
    public id: number,
    public login: string,
  ) {}
}

export function getUserIdentifier(user: IUser): number {
  return user.id;
}
