import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";
import { Request } from "express";
import s3 from "../config/aws";
import path from "path";

const bucketName = process.env.S3_BUCKET!;

const upload = multer({
  storage: multerS3({
    s3,
    bucket: bucketName,
    contentType: multerS3.AUTO_CONTENT_TYPE, // ✅ Automatically sets correct Content-Type
    metadata: (
      _req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, metadata?: any) => void
    ) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (
      _req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, key?: any) => void
    ) => {
      console.log(file.originalname);
      const folderFromReq = (_req.body.folder || _req.query.folder || "car_audio_expert_uploads").toString(); // default to 'uploads'
      const safeFolder = folderFromReq.replace(/[^a-zA-Z0-9-_]/g, ""); // sanitize folder name

      const safeFileName = path.basename(file.originalname).replace(/\s+/g, "-"); // Replace spaces with hyphens

      const fileName = `${safeFolder}/${Date.now()}_${safeFileName}`;
      console.log("fileName",fileName);
      
      cb(null, fileName);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
      "video/mp4"
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, WEBP, PDF, and MP4 are allowed."));
    }
  }
  
});

export default upload;


// import multer from "multer";
// import path from "path";

// // Store file temporarily on disk
// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, "/tmp"); // Use tmp directory (adjust if needed)
//   },
//   filename: (_req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
//   const allowedMimeTypes = [
//     "image/jpeg",
//     "image/png",
//     "image/webp",
//     "application/pdf",
//     "video/mp4"
//   ];

//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type. Only JPG, PNG, WEBP, PDF, and MP4 are allowed."));
//   }
// };

// const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
//   fileFilter,
// });

// export default upload;
