"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstadoDocumento = void 0;
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var Documento_1 = require("./Documento");
var Adjuntos_1 = require("./Adjuntos");
var Estudiante_1 = require("./Estudiante");
var Estado_1 = require("./Estado");
var Imagenes_1 = require("./Imagenes");
var EstadoDocumento = /** @class */ (function () {
    function EstadoDocumento() {
    }
    __decorate([
        typeorm_1.PrimaryColumn({ type: "varchar", length: 35 }),
        typeorm_1.OneToMany(function () { return Adjuntos_1.Adjuntos; }, function (Adj) { return Adj.id_est_doc; }, {
            nullable: false
        }),
        typeorm_1.OneToMany(function () { return Estado_1.Estado; }, function (Estado) { return Estado.id_est_doc; }, {
            nullable: false
        }),
        typeorm_1.OneToMany(function () { return Imagenes_1.Imagenes; }, function (Img) { return Img.id_est_doc; }, {
            nullable: false
        }),
        class_validator_1.MaxLength(35),
        __metadata("design:type", Estado_1.Estado)
    ], EstadoDocumento.prototype, "id_est_doc", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return Documento_1.Documento; }, function (Documento) { return Documento.cod_doc; }, {
            nullable: false
        }),
        typeorm_1.JoinColumn({ name: "cod_doc", referencedColumnName: 'cod_doc' }),
        __metadata("design:type", Documento_1.Documento)
    ], EstadoDocumento.prototype, "cod_doc", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return Estudiante_1.Estudiante; }, function (Estudiante) { return Estudiante.cod_est; }, {
            nullable: false
        }),
        typeorm_1.JoinColumn({ name: "cod_est" }),
        __metadata("design:type", Estudiante_1.Estudiante)
    ], EstadoDocumento.prototype, "cod_est", void 0);
    EstadoDocumento = __decorate([
        typeorm_1.Entity()
    ], EstadoDocumento);
    return EstadoDocumento;
}());
exports.EstadoDocumento = EstadoDocumento;
//# sourceMappingURL=EstadoDocumento.js.map