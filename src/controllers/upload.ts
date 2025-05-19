import { Request, Response } from "express";
import { SUCCESS_RESPONSE, SERVER_ERROR_RESPONSE } from "../helper/apiResponse";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";

import s34 from "../config/aws";

export const uploadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const files = req.files as Express.MulterS3.File[]; // adjust based on your multer type
    if (!files || files.length === 0) {
      res.status(400).json({ message: "No files uploaded." });
      return;
    }

    const uploaded = files.map((file) => ({
      key: file.key,
      location: file.location, // optional
    }));
    // console.log(uploaded)
    res.status(200).json({
      message: "Files uploaded successfully.",
      data: uploaded,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};


const s3 = new S3Client({ region: process.env.AWS_REGION });

export const bdeleteFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { file_url } = req.body;

    // Convert the URL to extract only the object key
    const url = new URL(file_url);
    let key = decodeURIComponent(url.pathname.substring(1)); // Removes leading '/'

    key = key.replace(/\+/g, " ");

    console.log("Extracted Key:", key);

    const params = {
      Bucket: process.env.S3_BUCKET!,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    const result = await s3.send(command);

    console.log("result", result);
    console.log(`File deleted: ${key}`);
    res.status(200).json({ message: "File deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete file." });
  }
};

export const deleteFiles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { file_urls } = req.body; // Expecting an array of file URLs

    const objectsToDelete = file_urls.map((file_url: string) => {
      let key;
      if (file_url.includes("http")) {
        const url = new URL(file_url);
        key = decodeURIComponent(url.pathname.substring(1)); // Removes leading '/'
        key = key.replace(/\+/g, " ");
      }

      return { Key: file_url.includes("http") ? key : file_url };
    });

    console.log("Extracted Keys:", objectsToDelete);

    const params = {
      Bucket: process.env.S3_BUCKET!,
      Delete: {
        Objects: objectsToDelete,
      },
    };

    const command = new DeleteObjectsCommand(params);
    const result = await s3.send(command);

    console.log("Delete result:", result);
    res.status(200).json({ message: "Files deleted successfully.", result });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete files." });
  }
};
