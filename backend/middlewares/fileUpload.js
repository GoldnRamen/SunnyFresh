const multer = require("multer");


const file_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,  "uploads")
    },
    filename: (req, file, cb) => {
        const file_name = Date.now() + "_" + file.originalname;
        cb(null, file_name)
    }

})

const file_type = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/webp" || file.mimetype == "image/svg+xml") {
        cb(null, true);
    } else {
        cb(null, false);
        console.log("File Type Not Supported");
        throw Error("File Type Not Supported")
    }
}

const upload = multer({storage: file_storage, fileFilter: file_type})

module.exports = { upload };