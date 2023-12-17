import multer from "multer"
import { v4 as uuidv4 } from "uuid"
import { extname, resolve, dirname } from 'path'

const multerConfig = { 
  storage: multer.diskStorage({ 
    destination: resolve(__dirname, '..', '..', 'uploads'),
    filename: (request, file, callback) => {
      return callback(null, uuidv4() + extname(file.originalname))
    }
  })
};

export default multerConfig;