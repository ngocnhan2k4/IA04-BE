export interface IUser {
  id: string;
  email: string;
  password: string;
  name?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}
