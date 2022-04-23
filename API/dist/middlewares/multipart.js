"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multipartMiddleware = void 0;
var multipart = require("connect-multiparty");
exports.multipartMiddleware = multipart({
    uploadDir: './upload'
});
//# sourceMappingURL=multipart.js.map