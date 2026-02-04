import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Disable Next.js body parsing
export const config = {
    api: {
        bodyParser: false,
    },
};

// Configure Cloudinary (if keys are present)
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Ensure upload dir exists for local fallback
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
        keepExtensions: true,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        filter: ({ mimetype }) => !!mimetype && (mimetype.includes('image') || mimetype.includes('octet-stream')), // Relaxed filter
        uploadDir: uploadDir, // Always save locally first to avoid temp issues
    });

    try {
        const [fields, files] = await form.parse(req);
        const file = Array.isArray(files.file) ? files.file[0] : files.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (isCloudinaryConfigured) {
            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(file.filepath, {
                folder: 'borneo-trip',
            });
            // Optional: Delete local file after cloud upload
            try { fs.unlinkSync(file.filepath); } catch (e) { }

            return res.status(200).json({ url: result.secure_url });
        } else {
            // Return local path
            // formidable V3+ might use newFilename
            const fileName = file.newFilename || path.basename(file.filepath);
            return res.status(200).json({ url: `/uploads/${fileName}` });
        }

    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: 'Something went wrong during upload' });
    }
}
