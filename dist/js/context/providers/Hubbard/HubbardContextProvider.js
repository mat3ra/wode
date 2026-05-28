"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MaterialContextMixin_1 = __importDefault(require("../../mixins/MaterialContextMixin"));
const JSONSchemaDataProvider_1 = __importDefault(require("../base/JSONSchemaDataProvider"));
class HubbardContextProvider extends JSONSchemaDataProvider_1.default {
    constructor(contextItem, externalContext) {
        var _a, _b, _c;
        super(contextItem, externalContext);
        this.domain = "important";
        this.orbitalList = [
            "2p",
            "3s",
            "3p",
            "3d",
            "4s",
            "4p",
            "4d",
            "4f",
            "5s",
            "5p",
            "5d",
            "5f",
            "6s",
            "6p",
            "6d",
            "7s",
            "7p",
            "7d",
        ];
        this.initMaterialContextMixin(externalContext);
        this.uniqueElementsWithLabels = [
            ...new Set(((_a = this.material.Basis) === null || _a === void 0 ? void 0 : _a.elementsWithLabelsArray) || []),
        ];
        this.firstElement =
            ((_b = this.uniqueElementsWithLabels) === null || _b === void 0 ? void 0 : _b.length) > 0 ? this.uniqueElementsWithLabels[0] : "";
        this.secondSpecies =
            ((_c = this.uniqueElementsWithLabels) === null || _c === void 0 ? void 0 : _c.length) > 1
                ? this.uniqueElementsWithLabels[1]
                : this.firstElement;
    }
}
exports.default = HubbardContextProvider;
(0, MaterialContextMixin_1.default)(HubbardContextProvider.prototype);
