import { storageDirectory } from '@src/utils/storage-path.utils.js'
import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import slugify from 'slugify'

fs.mkdirSync(storageDirectory, { recursive: true })

const storage = multer.diskStorage({
    destination: storageDirectory,

    filename: (_req, file, cb) => {
        const filename = slugify.default(path.parse(file.originalname).name, { lower: true })

        cb(null, `${filename}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

// Middleware to handle errors
function handleUploadError(err: Error, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.sendStatus(413)
        }
        return res.sendStatus(500)
    } else if (err) {
        // An unknown error occurred
        return res.sendStatus(500)
    }

    // No error occurred, proceed to next middleware or route
    return res.status(200)
}

const upload = multer({
    storage,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20mb
    }
}).array('form_files', 10)

export default function fileUploadMiddleware(req: Request, res: Response, next: NextFunction) {
    upload(req, res, (err) => {
        if (!err) return next()

        handleUploadError(err, req, res, next)
    })
}
