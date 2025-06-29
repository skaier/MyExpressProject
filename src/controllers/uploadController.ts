import { Request, Response } from 'express';
import { singleUpload, multipleUpload } from '../middlewares/fileUpload';
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
}