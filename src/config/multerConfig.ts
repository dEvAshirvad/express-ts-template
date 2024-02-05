import fs from 'fs';
import path from 'path';
import multer, { Multer } from 'multer';
import { Request } from 'express';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const fileStorage = multer.diskStorage({
  destination: (
    request: Request,
    file: Express.Multer.File,
    callback: DestinationCallback,
  ): void => {
    const uploadDirectory = path.join(__dirname, '..', '..', 'uploads');

    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }

    callback(null, uploadDirectory);
  },

  filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
    callback(null, file.originalname);
  },
});

// Initialize multer with defined storage
export const upload: Multer = multer({ storage: fileStorage });
