"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MaterialContextMixin_1 = __importDefault(require("../../mixins/MaterialContextMixin"));
const JSONSchemaDataProvider_1 = __importDefault(require("../base/JSONSchemaDataProvider"));
class MixinsHubbardContextProvider extends JSONSchemaDataProvider_1.default {
    constructor(contextItem, externalContext) {
        super(contextItem, externalContext);
        this.initMaterialContextMixin(externalContext);
    }
}
(0, MaterialContextMixin_1.default)(MixinsHubbardContextProvider.prototype);
class HubbardContextProvider extends MixinsHubbardContextProvider {
    constructor(contextItem, externalContext) {
        var _a, _b;
        super(contextItem, externalContext);
        this.domain = "important";
        this.entityName = "unit";
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
        this.uniqueElementsWithLabels = [
            ...new Set((this.material.getBasis().elements || []).map((element) => String(element.value))),
        ];
        this.firstElement =
            ((_a = this.uniqueElementsWithLabels) === null || _a === void 0 ? void 0 : _a.length) > 0 ? this.uniqueElementsWithLabels[0] : "";
        this.secondSpecies =
            ((_b = this.uniqueElementsWithLabels) === null || _b === void 0 ? void 0 : _b.length) > 1
                ? this.uniqueElementsWithLabels[1]
                : this.firstElement;
    }
}
exports.default = HubbardContextProvider;
