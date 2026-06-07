import multer from 'multer';

const storage = multer.memoryStorage(); // Store files in memory

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only JPG, JPEG, and PNG files are allowed'), false);
        }
        cb(null, true);
    }
});

export default upload;
