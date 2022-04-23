"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("./auth");
var tramite_1 = require("./tramite");
var user_1 = require("./user");
var routes = express_1.Router();
routes.use('/auth', auth_1.default);
routes.use('/users', user_1.default);
routes.use('/tramite', tramite_1.default);
exports.default = routes;
//# sourceMappingURL=index.js.map