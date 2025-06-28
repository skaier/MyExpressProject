import userModel from '../models/user.model';
import ApiError from '../utils/ApiError';
import bcrypt from 'bcryptjs';

interface CreateUserInput {
  username: string;
  email: string;
  password: string;
}

interface UpdateUserInput {
  username?: string;
  email?: string;
  password?: string;
}

class UserService {
  async createUser(userData: CreateUserInput): Promise<any> {
    // Check if email already exists
    const existingUser = await userModel.getByEmail(userData.email);
    if (existingUser) {
      throw new ApiError(400, 'Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create user
    const user = await userModel.create({
      ...userData,
      password: hashedPassword
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    };
  }

  async getUserById(id: number): Promise<any> {
    const user = await userModel.getById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async updateUser(id: number, userData: UpdateUserInput): Promise<any> {
    const updates: Partial<UpdateUserInput> = {};
    
    if (userData.username) updates.username = userData.username;
    if (userData.email) updates.email = userData.email;
    if (userData.password) {
      updates.password = await bcrypt.hash(userData.password, 10);
    }

    if (Object.keys(updates).length === 0) {
      throw new ApiError(400, 'No valid fields to update');
    }

    const user = await userModel.update(id, updates);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      updatedAt: user.updatedAt
    };
  }

  async deleteUser(id: number): Promise<void> {
    await userModel.delete(id);
  }

  async validateUserCredentials(email: string, password: string): Promise<any> {
    const user = await userModel.getByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new ApiError(401, 'Invalid credentials');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email
    };
  }

  async getAllUsers(): Promise<any[]> {
    const users = await userModel.getAll();
    return users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
  }
}

export default new UserService();