import multipart = require('connect-multiparty');  
export const multipartMiddleware = multipart({  
    uploadDir: './upload'
});