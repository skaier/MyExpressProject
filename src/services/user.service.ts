import userModel from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import bcrypt from 'bcryptjs';
import { formatDateTime } from '../utils/date.util'; 
import {
  UserDTO,
  UserCreateDTO,
  UserUpdateDTO,
  UserPaginationListDTO,
  User,
  UserQueryParams,
} from '../interfaces/user.interface';

class UserService {
  private _toUserDTO(user: User): UserDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      created_at: formatDateTime(user.created_at),
      updated_at: formatDateTime(user.updated_at),
    };
  }

  async createUser(userData: UserCreateDTO): Promise<UserDTO> {
    // Check if email already exists
    const existingUser = await userModel.getByEmail(userData.email);
    if (existingUser) {
      throw ApiError.conflict('Email already exists');
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    // Create user
    const user = await userModel.create({
      ...userData,
      password: hashedPassword,
    });
    return this._toUserDTO(user);
  }

  async getUserById(id: number): Promise<UserDTO> {
    const user = await userModel.getById(id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return this._toUserDTO(user);
  }

  async updateUser(id: number, userData: UserUpdateDTO): Promise<UserDTO> {
    const updates: UserUpdateDTO = {}; 
    if (userData.name) updates.name = userData.name;
    if (userData.email) {
      // Check if email is already used by another user
      const existingUser = await userModel.getByEmail(userData.email);
      if (existingUser && existingUser.id !== id) {
        throw ApiError.conflict('Email already exists');
      }
      updates.email = userData.email;
    }
    if (userData.password) {
      updates.password = await bcrypt.hash(userData.password, 10);
    }
    if (userData.avatar) {
      updates.avatar = userData.avatar;
    }

    if (Object.keys(updates).length === 0) {
      throw ApiError.badRequest('No valid fields to update');
    }

    const user = await userModel.update(id, updates);
    return this._toUserDTO(user);
  }

  async deleteUser(id: number): Promise<void> {
    await userModel.delete(id);
  }

  async validateUserCredentials(email: string, password: string): Promise<UserDTO> {
    const user = await userModel.getByEmail(email);
    if (!user) {
      throw ApiError.unauthorized('用户名或密码错误');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw ApiError.unauthorized('用户名或密码错误');
    }

    return this._toUserDTO(user);
  }

  async getUsersWithPagination(params: UserQueryParams): Promise<UserPaginationListDTO> {
    const result = await userModel.getWithPagination(params);
    return {
      ...result,
      list: result.list.map((user) => this._toUserDTO(user)),
    };
  }
}

export default new UserService();