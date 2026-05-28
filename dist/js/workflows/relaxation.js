"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelaxationLogicMixin = void 0;
const standata_1 = require("@mat3ra/standata");
const RelaxationLogicMixin = (superclass) => class extends superclass {
    get relaxationSubworkflow() {
        var _a, _b;
        const appName = (_b = (_a = this.subworkflows[0]) === null || _a === void 0 ? void 0 : _a.application) === null || _b === void 0 ? void 0 : _b.name;
        if (!appName)
            return undefined;
        const subworkflowStandata = new standata_1.SubworkflowStandata();
        const relaxationSubworkflow = subworkflowStandata.getRelaxationSubworkflowByApplication(appName);
        if (!relaxationSubworkflow)
            return undefined;
        return new this._Subworkflow(relaxationSubworkflow);
    }
    isRelaxationSubworkflow(subworkflow) {
        const { relaxationSubworkflow } = this;
        return ((relaxationSubworkflow === null || relaxationSubworkflow === void 0 ? void 0 : relaxationSubworkflow.systemName) !== undefined &&
            relaxationSubworkflow.systemName === subworkflow.systemName);
    }
    get hasRelaxation() {
        return this.subworkflows.some((subworkflow) => this.isRelaxationSubworkflow(subworkflow));
    }
    toggleRelaxation() {
        if (this.hasRelaxation) {
            const relaxSubworkflow = this.subworkflows.find((sw) => this.isRelaxationSubworkflow(sw));
            this.removeSubworkflow(relaxSubworkflow.id);
        }
        else {
            const vcRelax = this.relaxationSubworkflow;
            if (vcRelax) {
                this.addSubworkflow(vcRelax, true);
            }
        }
    }
};
exports.RelaxationLogicMixin = RelaxationLogicMixin;
