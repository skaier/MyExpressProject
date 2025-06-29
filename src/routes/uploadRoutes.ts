import { Router } from 'express';
import { UploadController } from '../controllers/uploadController';

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

export default router;