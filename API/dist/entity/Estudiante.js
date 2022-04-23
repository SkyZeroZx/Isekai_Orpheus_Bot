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
exports.Estudiante = void 0;
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var EstadoDocumento_1 = require("./EstadoDocumento");
var Estudiante = /** @class */ (function () {
    function Estudiante() {
    }
    __decorate([
        typeorm_1.PrimaryColumn({ type: "varchar", length: 35 }),
        typeorm_1.OneToMany(function () { return EstadoDocumento_1.EstadoDocumento; }, function (EstadoDocumento) { return EstadoDocumento.cod_est; }),
        __metadata("design:type", EstadoDocumento_1.EstadoDocumento)
    ], Estudiante.prototype, "cod_est", void 0);
    __decorate([
        typeorm_1.Column("varchar", { length: 80 }),
        class_validator_1.IsNotEmpty(),
        __metadata("design:type", EstadoDocumento_1.EstadoDocumento)
    ], Estudiante.prototype, "nombre", void 0);
    __decorate([
        typeorm_1.Column("varchar", { length: 120 }),
        class_validator_1.MaxLength(120),
        class_validator_1.IsNotEmpty(),
        __metadata("design:type", EstadoDocumento_1.EstadoDocumento)
    ], Estudiante.prototype, "apellido", void 0);
    __decorate([
        typeorm_1.Column("varchar", { length: 9 }),
        class_validator_1.MaxLength(9),
        __metadata("design:type", EstadoDocumento_1.EstadoDocumento)
    ], Estudiante.prototype, "telefono", void 0);
    __decorate([
        typeorm_1.Column("varchar", { length: 2 }),
        class_validator_1.MaxLength(2),
        __metadata("design:type", EstadoDocumento_1.EstadoDocumento)
    ], Estudiante.prototype, "dig_dni", void 0);
    __decorate([
        typeorm_1.Column("varchar", { length: 8 }),
        __metadata("design:type", EstadoDocumento_1.EstadoDocumento)
    ], Estudiante.prototype, "dni", void 0);
    __decorate([
        typeorm_1.Column(),
        class_validator_1.MinLength(6),
        class_validator_1.IsEmail(),
        class_validator_1.IsNotEmpty(),
        __metadata("design:type", String)
    ], Estudiante.prototype, "email", void 0);
    Estudiante = __decorate([
        typeorm_1.Entity()
    ], Estudiante);
    return Estudiante;
}());
exports.Estudiante = Estudiante;
//# sourceMappingURL=Estudiante.js.map