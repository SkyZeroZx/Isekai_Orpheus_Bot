"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TramiteController = void 0;
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var EstadoDocumento_1 = require("../entity/EstadoDocumento");
var Estado_1 = require("../entity/Estado");
var Documento_1 = require("../entity/Documento");
var Estudiante_1 = require("../entity/Estudiante");
var Imagenes_1 = require("../entity/Imagenes");
var Adjuntos_1 = require("../entity/Adjuntos");
var Certificados_1 = require("../entity/Certificados");
var mailer_1 = require("./../config/mailer");
var fs = require("fs");
var TramiteController = /** @class */ (function () {
    function TramiteController() {
    }
    TramiteController.getAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var tramiteRepository, tramite, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tramiteRepository = typeorm_1.getRepository(EstadoDocumento_1.EstadoDocumento);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, typeorm_1.getManager()
                            .createQueryBuilder(EstadoDocumento_1.EstadoDocumento, "est")
                            .select("est.id_est_doc", "id_est_doc")
                            .addSelect("e.estado", "estado")
                            .addSelect("e.fecha", "fecha_doc")
                            .addSelect("d.nombre", "nombre")
                            .addSelect("ed.cod_est", "cod_est")
                            .addSelect("ed.nombre", "estudiante")
                            .addSelect("ed.apellido", "apellidos")
                            .innerJoin(Estado_1.Estado, "e", "est.id_est_doc = e.id_est_doc")
                            .innerJoin(Documento_1.Documento, "d", "d.cod_doc = est.cod_doc")
                            .innerJoin(Estudiante_1.Estudiante, "ed", "ed.cod_est = est.cod_est")
                            .leftJoin(Estado_1.Estado, "w", "e.id_est_doc = w.id_est_doc AND e.fecha < w.fecha")
                            .where("w.id_est_doc is null")
                            .getRawMany()];
                case 2:
                    tramite = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    res.status(404).json({ message: "Something goes wrong! tramite" });
                    return [3 /*break*/, 4];
                case 4:
                    res.send(tramite);
                    return [2 /*return*/];
            }
        });
    }); };
    TramiteController.getById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var detalle, id, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, typeorm_1.getManager()
                            .createQueryBuilder(EstadoDocumento_1.EstadoDocumento, "est")
                            .select("est.id_est_doc", "id_est_doc")
                            .addSelect("e.fecha", "fecha")
                            .addSelect("e.estado", "estado")
                            .addSelect("e.observaciones", "observaciones")
                            .innerJoin(Estado_1.Estado, "e", "est.id_est_doc = e.id_est_doc")
                            .where("est.ID_EST_DOC = :id", { id: id })
                            .orderBy("E.FECHA", "DESC")
                            .getRawMany()];
                case 2:
                    detalle = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    res.status(404).json({ message: "Something goes wrong! detalle" });
                    return [3 /*break*/, 4];
                case 4:
                    res.send(detalle);
                    return [2 /*return*/];
            }
        });
    }); };
    TramiteController.getByImg = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var imagen, id, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, typeorm_1.getManager()
                            .createQueryBuilder(Imagenes_1.Imagenes, "i")
                            .select("i.id_est_doc", "ID_EST_DOC")
                            .addSelect("i.fecha", "FECHA")
                            .addSelect("i.url", "URL")
                            .where("i.ID_EST_DOC = :id", { id: id })
                            .getRawMany()];
                case 2:
                    imagen = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_3 = _a.sent();
                    res.status(404).json({ message: "Something goes wrong! imagen" });
                    return [3 /*break*/, 4];
                case 4:
                    res.send(imagen);
                    return [2 /*return*/];
            }
        });
    }); };
    TramiteController.getByAdj = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var adjunto, id, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, typeorm_1.getManager()
                            .createQueryBuilder(Adjuntos_1.Adjuntos, "a")
                            .select("a.id_est_doc", "ID_EST_DOC")
                            .addSelect("a.fecha", "FECHA")
                            .addSelect("a.url", "URL")
                            .where("a.ID_EST_DOC = :id", { id: id })
                            .getRawMany()];
                case 2:
                    adjunto = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_4 = _a.sent();
                    res.status(404).json({ message: "Something goes wrong! adjunto" });
                    return [3 /*break*/, 4];
                case 4:
                    res.send(adjunto);
                    return [2 /*return*/];
            }
        });
    }); };
    TramiteController.getByCer = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var adjunto, id, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, typeorm_1.getManager()
                            .createQueryBuilder(Certificados_1.Certificados, "c")
                            .select("c.id_est_doc", "id_est_doc")
                            .addSelect("c.fecha", "fecha")
                            .addSelect("c.url", "url")
                            .where("c.ID_EST_DOC = :id", { id: id })
                            .getRawMany()];
                case 2:
                    adjunto = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_5 = _a.sent();
                    res.status(404).json({ message: "Something goes wrong! Certificados" });
                    return [3 /*break*/, 4];
                case 4:
                    res.send(adjunto);
                    return [2 /*return*/];
            }
        });
    }); };
    TramiteController.insertTramite = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, id_est_doc, observaciones, estado, estadoDetalle, validationOpt, errors, estadoRepository, estudiante, e_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, id_est_doc = _a.id_est_doc, observaciones = _a.observaciones, estado = _a.estado;
                    estadoDetalle = new Estado_1.Estado();
                    estadoDetalle.id_est_doc = id_est_doc;
                    estadoDetalle.observaciones = observaciones;
                    estadoDetalle.estado = estado;
                    validationOpt = { validationError: { target: false, value: false } };
                    return [4 /*yield*/, class_validator_1.validate(estadoDetalle, validationOpt)];
                case 1:
                    errors = _b.sent();
                    if (errors.length > 0) {
                        return [2 /*return*/, res.status(400).json(errors)];
                    }
                    estadoRepository = typeorm_1.getRepository(Estado_1.Estado);
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 6, , 7]);
                    return [4 /*yield*/, estadoRepository.save(estadoDetalle)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, typeorm_1.getManager()
                            .createQueryBuilder(Estudiante_1.Estudiante, "e")
                            .select("e.email", "email")
                            .innerJoin(EstadoDocumento_1.EstadoDocumento, "est", "est.cod_est = e.cod_est")
                            .where("est.id_est_doc = :id", { id: id_est_doc })
                            .getRawOne()];
                case 4:
                    estudiante = _b.sent();
                    return [4 /*yield*/, mailer_1.transporter.sendMail({
                            from: "Universidad <institucional@gmail.com>",
                            to: estudiante.email,
                            subject: "Actualizacion Estado Tramite N°" + id_est_doc,
                            html: "<img src='https://fiis.unac.edu.pe/images/logo-fiis.png'></img>" +
                                "<p>Por medio del presente cumplimos con informar que su tramite con N° " +
                                id_est_doc +
                                " se actualizado con estado: <b>" +
                                estado.toLowerCase() +
                                "</b>" +
                                " para mas detalles puede verificar su tramite en " +
                                " URL" +
                                "</p>",
                        })];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_6 = _b.sent();
                    return [2 /*return*/, res
                            .status(409)
                            .json({ message: "Ocurrio un error al registrar estado" })];
                case 7:
                    // All Ok
                    res.status(201).json({ message: "Nuevo Estado Tramite Ingresado" });
                    return [2 /*return*/];
            }
        });
    }); };
    TramiteController.editTramite = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var tramite, _a, id_est_doc, observaciones, estado, fecha, estadoRepository, e_7, validationOpt, errors, e_8;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, id_est_doc = _a.id_est_doc, observaciones = _a.observaciones, estado = _a.estado, fecha = _a.fecha;
                    estadoRepository = typeorm_1.getRepository(Estado_1.Estado);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, estadoRepository.findOneOrFail({
                            id_est_doc: id_est_doc,
                            fecha: fecha,
                        })];
                case 2:
                    tramite = _b.sent();
                    tramite.observaciones = observaciones;
                    tramite.estado = estado;
                    return [3 /*break*/, 4];
                case 3:
                    e_7 = _b.sent();
                    console.log(e_7);
                    return [2 /*return*/, res.status(404).json({ message: "Tramite not found" })];
                case 4:
                    validationOpt = { validationError: { target: false, value: false } };
                    return [4 /*yield*/, class_validator_1.validate(tramite, validationOpt)];
                case 5:
                    errors = _b.sent();
                    if (errors.length > 0) {
                        return [2 /*return*/, res.status(400).json(errors)];
                    }
                    _b.label = 6;
                case 6:
                    _b.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, estadoRepository.save(tramite)];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 8:
                    e_8 = _b.sent();
                    return [2 /*return*/, res.status(404).json({ message: "Error al editar tramite" })];
                case 9:
                    res.status(201).json({ message: "Tramite update" });
                    return [2 /*return*/];
            }
        });
    }); };
    TramiteController.deleteTramite = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, id_est_doc, fecha, tramite, estadoRepository, e_9, e_10;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, id_est_doc = _a.id_est_doc, fecha = _a.fecha;
                    estadoRepository = typeorm_1.getRepository(Estado_1.Estado);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, estadoRepository.findOneOrFail({
                            id_est_doc: id_est_doc,
                            fecha: fecha,
                        })];
                case 2:
                    tramite = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_9 = _b.sent();
                    return [2 /*return*/, res.status(404).json({ message: "Tramite not found" })];
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, estadoRepository.delete({ id_est_doc: id_est_doc, fecha: fecha })];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_10 = _b.sent();
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Hubo un error al eliminar el tramite" })];
                case 7:
                    res.status(201).json({ message: "Tramite deleted" });
                    return [2 /*return*/];
            }
        });
    }); };
    TramiteController.insertCer = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, id_est_doc, url, certificado, validationOpt, errors, certificadoRepository, estudiante, e_11;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, id_est_doc = _a.id_est_doc, url = _a.url;
                    certificado = new Certificados_1.Certificados();
                    certificado.url = url;
                    certificado.id_est_doc = id_est_doc;
                    validationOpt = { validationError: { target: false, value: false } };
                    return [4 /*yield*/, class_validator_1.validate(certificado, validationOpt)];
                case 1:
                    errors = _b.sent();
                    if (errors.length > 0) {
                        return [2 /*return*/, res.status(400).json(errors)];
                    }
                    certificadoRepository = typeorm_1.getRepository(Certificados_1.Certificados);
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 6, , 7]);
                    return [4 /*yield*/, certificadoRepository.save(certificado)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, typeorm_1.getManager()
                            .createQueryBuilder(Estudiante_1.Estudiante, "e")
                            .select("e.email", "email")
                            .innerJoin(EstadoDocumento_1.EstadoDocumento, "est", "est.cod_est = e.cod_est")
                            .where("est.id_est_doc = :id", { id: id_est_doc })
                            .getRawOne()];
                case 4:
                    estudiante = _b.sent();
                    return [4 /*yield*/, mailer_1.transporter.sendMail({
                            from: "Universidad <institucional@gmail.com>",
                            to: estudiante.email,
                            subject: "Actualizacion Estado Tramite N°" + id_est_doc,
                            html: "<img src='https://fiis.unac.edu.pe/images/logo-fiis.png'></img>" +
                                "<p>Por medio del presente cumplimos con informar que su tramite con N° " +
                                id_est_doc +
                                " se actualizado con estado: <b>finalizado</b></p><br>" +
                                "<p>Puede descargar su certificado en el apartado certificado en la busqueda de tramite  URL</p>",
                        })];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_11 = _b.sent();
                    return [2 /*return*/, res
                            .status(409)
                            .json({ message: "Error al registrar certificado" })];
                case 7:
                    // All Ok
                    res
                        .status(200)
                        .json({ message: "Se registro existosamente el certificado" });
                    return [2 /*return*/];
            }
        });
    }); };
    TramiteController.deleteCer = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var certificado, _a, id_est_doc, fecha, certificadoRepository, e_12, e_13;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, id_est_doc = _a.id_est_doc, fecha = _a.fecha;
                    certificadoRepository = typeorm_1.getRepository(Certificados_1.Certificados);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, certificadoRepository.findOneOrFail({
                            id_est_doc: id_est_doc,
                            fecha: fecha,
                        })];
                case 2:
                    certificado = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_12 = _b.sent();
                    return [2 /*return*/, res.status(404).json({ message: "Certicado not found" })];
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, certificadoRepository.delete({
                            id_est_doc: id_est_doc,
                            fecha: fecha,
                        })];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_13 = _b.sent();
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Sucedio un error al eliminar certificado" })];
                case 7:
                    res.status(201).json({ message: "Certicado deleted" });
                    return [2 /*return*/];
            }
        });
    }); };
    TramiteController.updateCer = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, archivo, certificado, validationOpt, errors, certificadoRepository, estudiante, e_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    archivo = req["files"]["uploads"];
                    console.log(archivo);
                    console.log(archivo[0].path);
                    fs.rename(archivo[0].path, "upload/" + id + ".pdf", function () {
                        console.log("\nFile Renamed!\n");
                    });
                    certificado = new Certificados_1.Certificados();
                    certificado.url = "C:/Users/User/Desktop/Isekai_Orpheus_Bot/Isekai_Orpheus_Bot/API/upload/" + id + ".pdf";
                    certificado.id_est_doc = id;
                    validationOpt = { validationError: { target: false, value: false } };
                    return [4 /*yield*/, class_validator_1.validate(certificado, validationOpt)];
                case 1:
                    errors = _a.sent();
                    if (errors.length > 0) {
                        return [2 /*return*/, res.status(400).json(errors)];
                    }
                    certificadoRepository = typeorm_1.getRepository(Certificados_1.Certificados);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    //Insert a Certificate
                    return [4 /*yield*/, certificadoRepository.save(certificado)];
                case 3:
                    //Insert a Certificate
                    _a.sent();
                    return [4 /*yield*/, typeorm_1.getManager()
                            .createQueryBuilder(Estudiante_1.Estudiante, "e")
                            .select("e.email", "email")
                            .innerJoin(EstadoDocumento_1.EstadoDocumento, "est", "est.cod_est = e.cod_est")
                            .where("est.id_est_doc = :id", { id: id })
                            .getRawOne()];
                case 4:
                    //Get a email
                    estudiante = _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_14 = _a.sent();
                    return [2 /*return*/, res
                            .status(409)
                            .json({ message: "Error al registrar certificado" })];
                case 6:
                    res.status(201).json({ message: "Certicado subido exitosamente" });
                    return [2 /*return*/];
            }
        });
    }); };
    TramiteController.getDocument = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            id = req.params.id;
            console.log('El ID params es ' + id);
            console.log(__dirname);
            return [2 /*return*/];
        });
    }); };
    return TramiteController;
}());
exports.TramiteController = TramiteController;
exports.default = TramiteController;
//# sourceMappingURL=TramiteController.js.map