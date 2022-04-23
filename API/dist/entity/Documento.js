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
exports.Documento = void 0;
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var EstadoDocumento_1 = require("./EstadoDocumento");
var Documento = /** @class */ (function () {
    function Documento() {
    }
    __decorate([
        typeorm_1.PrimaryColumn({ type: "int", width: 35 }),
        typeorm_1.OneToMany(function () { return EstadoDocumento_1.EstadoDocumento; }, function (EstadoDocumento) { return EstadoDocumento.cod_doc; }),
        __metadata("design:type", EstadoDocumento_1.EstadoDocumento)
    ], Documento.prototype, "cod_doc", void 0);
    __decorate([
        typeorm_1.Column("varchar", { length: 100 }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.MaxLength(100),
        __metadata("design:type", String)
    ], Documento.prototype, "nombre", void 0);
    Documento = __decorate([
        typeorm_1.Entity()
    ], Documento);
    return Documento;
}());
exports.Documento = Documento;
//# sourceMappingURL=Documento.js.map