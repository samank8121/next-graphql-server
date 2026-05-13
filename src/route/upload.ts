import { Router } from "express";
import Busboy from "busboy";
import fs from "fs";
import path from "path";
import { File } from "../entities/File";
import { auth } from "../middlewares/auth";

export const uploadRouter = Router();

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

uploadRouter.post("/", (req, res) => {
  console.log("Received upload request");
  const token = req.headers.authorization
    ? auth(req.headers.authorization)
    : null;
  console.log("Auth token:", token);
  if (!token?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const busboy = Busboy({ headers: req.headers });

  let uploadPromise: Promise<any> | null = null;

  busboy.on("file", (_fieldname, file, info) => {
    const { filename, mimeType } = info;
    console.log("Uploading file:", filename, "with MIME type:", mimeType);

    const uniqueFilename = `${Date.now()}-${filename}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);

    let size = 0;

    uploadPromise = new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath);

      file.on("data", (data) => {
        size += data.length;
      });

      file
        .pipe(writeStream)
        .on("finish", async () => {
          const fileEntity = File.create({
            filename: uniqueFilename,
            originalName: filename,
            mimetype: mimeType,
            size,
            path: filePath,
            user: { id: token.userId },
          });

          await fileEntity.save();

          resolve({
            id: fileEntity.id,
            url: `/uploads/${uniqueFilename}`,
            filename: uniqueFilename,
          });
        })
        .on("error", reject);
    });
  });

  busboy.on("finish", async () => {
    try {
      const result = await uploadPromise;
      res.json(result);
    } catch {
      res.status(500).json({ message: "Upload failed" });
    }
  });

  req.pipe(busboy);
});
