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
exports.Estado = void 0;
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var EstadoDocumento_1 = require("./EstadoDocumento");
var Estado = /** @class */ (function () {
    function Estado() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Estado.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        typeorm_1.CreateDateColumn(),
        __metadata("design:type", Date)
    ], Estado.prototype, "fecha", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return EstadoDocumento_1.EstadoDocumento; }, function (Est) { return Est.id_est_doc; }, {
            nullable: false,
        }),
        typeorm_1.JoinColumn({ name: "id_est_doc", referencedColumnName: "id_est_doc" }),
        __metadata("design:type", EstadoDocumento_1.EstadoDocumento)
    ], Estado.prototype, "id_est_doc", void 0);
    __decorate([
        typeorm_1.Column("varchar", { length: 50 }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.MaxLength(50),
        __metadata("design:type", String)
    ], Estado.prototype, "estado", void 0);
    __decorate([
        typeorm_1.Column("text"),
        class_validator_1.IsNotEmpty(),
        __metadata("design:type", String)
    ], Estado.prototype, "observaciones", void 0);
    Estado = __decorate([
        typeorm_1.Entity()
    ], Estado);
    return Estado;
}());
exports.Estado = Estado;
//# sourceMappingURL=Estado.js.map