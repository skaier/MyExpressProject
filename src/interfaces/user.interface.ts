import { PaginationParams, PaginationResult } from './common.interface';

export interface User {
  avatar?: string | null;
  id: number;
  name: string;
  email: string;
  password?: string;
  role?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type UserPaginationListDTO = PaginationResult<UserDTO>;
export interface UserCreateDTO {
  name: string;
  email: string;
  password: string;
  avatar?: string | null;
}

export interface UserUpdateDTO {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string | null;
}

export type UserQueryConditions = {
  name?: string;
  email?: string;
  role?: string;
};

export type UserQueryParams = PaginationParams<UserQueryConditions>;