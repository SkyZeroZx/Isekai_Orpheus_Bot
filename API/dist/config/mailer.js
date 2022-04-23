"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
var nodemailer = require("nodemailer");
exports.transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "nodetestui@gmail.com",
        pass: "boxykxbxxutrqitw"
    },
});
exports.transporter.verify().then(function () {
    console.log('Ready for sending emails');
});
//# sourceMappingURL=mailer.js.map