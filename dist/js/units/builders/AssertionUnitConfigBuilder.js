"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertionUnitConfigBuilder = void 0;
const enums_1 = require("../../enums");
const UnitConfigBuilder_1 = require("./UnitConfigBuilder");
class AssertionUnitConfigBuilder extends UnitConfigBuilder_1.UnitConfigBuilder {
    constructor(name, statement, errorMessage) {
        super({ name, type: enums_1.UNIT_TYPES.assertion });
        this._statement = statement;
        this._errorMessage = errorMessage;
    }
    statement(str) {
        this._statement = str;
        return this;
    }
    errorMessage(str) {
        this._errorMessage = str;
        return this;
    }
    build() {
        return {
            ...super.build(),
            statement: this._statement,
            errorMessage: this._errorMessage,
        };
    }
}
exports.AssertionUnitConfigBuilder = AssertionUnitConfigBuilder;
