import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { singleUpload } from '../middlewares/fileUpload';
import authenticate from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /api/upload/single:
 *   post:
 *     summary: Upload a single file
 *     tags: [File Upload]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded or invalid file type
 *       500:
 *         description: Server error
 */
router.post('/single', async (req, res) => {
  await UploadController.uploadSingle(req, res);
});

/**
 * @swagger
 * /api/upload/multiple:
 *   post:
 *     summary: Upload multiple files
 *     tags: [File Upload]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: files
 *         type: array
 *         items:
 *           type: file
 *         description: The files to upload
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *       400:
 *         description: No files uploaded or invalid file types
 *       500:
 *         description: Server error
 */
router.post('/multiple', async (req, res) => {
  await UploadController.uploadMultiple(req, res);
});

/**
 * @swagger
 * /api/upload/{filename}:
 *   delete:
 *     summary: Delete an uploaded file
 *     tags: [File Upload]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         type: string
 *         description: Name of the file to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
router.delete('/:filename', async (req, res) => {
  await UploadController.deleteFile(req, res);
});

/**
 * @swagger
 * /api/upload/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: avatar
 *         type: file
 *         description: The avatar image to upload (JPEG/PNG/GIF, max 2MB)
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 file:
 *                   type: object
 *                   properties:
 *                     originalName:
 *                       type: string
 *                     fileName:
 *                       type: string
 *                     size:
 *                       type: number
 *                     path:
 *                       type: string
 *       400:
 *         description: No file uploaded, invalid file type or size exceeded
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/avatar', authenticate, singleUpload, async (req, res) => {
  await UploadController.uploadAvatar(req, res);
});

export default router;