import {PRODUCTS_PHOTOS_SERVER_DIR, USERS_PHOTOS_SERVER_DIR} from "./Constants"
import { genFilename } from "./Funcs"
let multer = require('multer'), 
    uuidv4 = require('uuid/v4')

const MULTER_ERROR = multer.MulterError

const fileUploader = {}

const maxFileSize = 1024 * 1024 * 20//size in bytes

const product_storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, PRODUCTS_PHOTOS_SERVER_DIR)
  },
  filename: function (req, file, cb) {
    const name =  genFilename(file.mimetype)
    cb(null, name )
  }
})

const user_storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, USERS_PHOTOS_SERVER_DIR)
  },
  filename: function (req, file, cb) {
    const name =  genFilename(file.mimetype)
    cb(null, name )
  }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
}


const singleProductUpload = file_name => {
    return multer({ storage: product_storage, limits: {fileSize: maxFileSize}, fileFilter: fileFilter }).single(file_name)
}
const multipleProductUpload = file_name => {
    return multer({ storage: product_storage, limits: {fileSize: maxFileSize}, fileFilter: fileFilter }).array(file_name)
}
const singleUserUpload = file_name => {
    return multer({ storage: user_storage, limits: {fileSize: maxFileSize}, fileFilter: fileFilter }).single(file_name)
}
const multipleUserUpload = file_name => {
    return multer({ storage: user_storage, limits: {fileSize: maxFileSize}, fileFilter: fileFilter }).array(file_name)
}

fileUploader.singleProductUpload = singleProductUpload
fileUploader.multipleProductUpload = multipleProductUpload
fileUploader.singleUserUpload = singleUserUpload
fileUploader.multipleUserUpload = multipleUserUpload
fileUploader.MULTER_ERROR = MULTER_ERROR
module.exports = fileUploader