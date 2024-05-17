import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
// import bcrypt from "bcrypt";

// export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, `${__dirname}/public/image`)
    },
    filename: (request, file, callback ) => {
        callback(null, `${Date.now()}-${file.originalname}`)
    }
})

export const uploader = multer({
    storage
})

export default __dirname