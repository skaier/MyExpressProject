import { Request, Response } from 'express';
import { singleUpload, multipleUpload } from '../middlewares/fileUpload';
import UserModel from '../models/user.model';
import path from 'path';
import fs from 'fs';

export class UploadController {
  /**
   * 上传单个文件
   */
  static async uploadSingle(req: Request, res: Response): Promise<Response> {
    try {
      await new Promise<void>((resolve, reject) => {
        singleUpload(req, res, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // 返回上传结果
      return res.status(200).json({
        message: 'File uploaded successfully',
        file: {
          originalName: req.file.originalname,
          fileName: req.file.filename,
          size: req.file.size,
          path: `/uploads/${req.file.filename}`
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Upload failed' });
    }
  }

  /**
   * 上传多个文件
   */
  static async uploadMultiple(req: Request, res: Response): Promise<Response> {
    try {
      await new Promise<void>((resolve, reject) => {
        multipleUpload(req, res, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const files = (req.files as Express.Multer.File[]).map(file => ({
        originalName: file.originalname,
        fileName: file.filename,
        size: file.size,
        path: `/uploads/${file.filename}`
      }));

      return res.status(200).json({
        message: 'Files uploaded successfully',
        files: files
      });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Upload failed' });
    }
  }

  /**
   * 删除上传的文件
   */
  static async deleteFile(req: Request, res: Response): Promise<Response> {
    try {
      const { filename } = req.params;
      const filePath = path.join(__dirname, '../uploads', filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }

      fs.unlinkSync(filePath);
      return res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Delete failed' });
    }
  }

  /**
   * 上传用户头像
   */
  static async uploadAvatar(req: Request, res: Response): Promise<Response> {
    try {
      await new Promise<void>((resolve, reject) => {
        singleUpload(req, res, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // 验证用户ID
      if (!req.user?.id) {
        fs.unlinkSync(req.file.path);
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Only JPEG, PNG and GIF images are allowed' });
      }

      // 验证文件大小 (最大2MB)
      if (req.file.size > 2 * 1024 * 1024) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'File size exceeds 2MB limit' });
      }

      // 生成唯一文件名
      const ext = path.extname(req.file.originalname);
      const newFilename = `avatar_${req.user.id}${ext}`;
      const newPath = path.join(__dirname, '../uploads/avatars', newFilename);

      // 创建avatars目录(如果不存在)
      fs.mkdirSync(path.dirname(newPath), { recursive: true });

      // 移动文件到avatars目录
      fs.renameSync(req.file.path, newPath);

      // 更新用户头像URL
      const avatarUrl = `/uploads/avatars/${newFilename}`;
      await UserModel.update(req.user.id, { avatar: avatarUrl });

      return res.status(200).json({
        message: 'Avatar uploaded successfully',
        file: {
          originalName: req.file.originalname,
          fileName: newFilename,
          size: req.file.size,
          path: avatarUrl
        }
      });
    } catch (error) {
      // 清理上传的文件(如果出错)
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error('Avatar upload error:', error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Avatar upload failed'
      });
    }
  }
}