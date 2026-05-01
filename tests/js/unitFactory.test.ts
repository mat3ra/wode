import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import esseSchemas from "@mat3ra/esse/dist/js/schemas.json";
import type { ExecutionUnitSchema } from "@mat3ra/esse/dist/js/types";
import { ApplicationRegistry } from "@mat3ra/standata";
import StandataDriver from "@mat3ra/standata/dist/js/StandataDriver";
import { expect } from "chai";
import type { JSONSchema7 } from "json-schema";

import {
    AssertionUnit,
    AssignmentUnit,
    ConditionUnit,
    ExecutionUnit,
    IOUnit,
    UnitFactory,
} from "../../src/js";
import { UnitType } from "../../src/js/enums";

describe("UnitFactory.createDefaultSubworkflowUnit", () => {
    let defaultApplication: ExecutionUnitSchema["application"];

    before(() => {
        // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
        JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
    });

    beforeEach(() => {
        ApplicationRegistry.setDriver(new StandataDriver());
        const app = new ApplicationRegistry().getDefaultApplication();
        if (!app) {
            throw new Error("ApplicationRegistry.getDefaultApplication() returned no application");
        }
        defaultApplication = app;
    });

    it('creates an ExecutionUnit when type is "execution" and application is provided', () => {
        const unit = UnitFactory.createDefaultSubworkflowUnit("execution", defaultApplication);

        expect(unit).to.be.instanceOf(ExecutionUnit);
        if (!(unit instanceof ExecutionUnit)) {
            throw new Error("expected ExecutionUnit");
        }
        expect(unit.type).to.equal(UnitType.execution);
        expect(unit.application).to.deep.equal(defaultApplication);
    });

    it('throws when type is "execution" and application is undefined', () => {
        expect(() => {
            // Deliberately violates overloads to assert runtime guard for buggy callers.
            // @ts-expect-error application is required when type is execution
            UnitFactory.createDefaultSubworkflowUnit("execution", undefined);
        }).to.throw(
            Error,
            "UnitFactory.createDefaultSubworkflowUnit: application is required when type is execution",
        );
    });

    it('creates an AssignmentUnit when type is "assignment"', () => {
        const unit = UnitFactory.createDefaultSubworkflowUnit("assignment");

        expect(unit).to.be.instanceOf(AssignmentUnit);
        expect(unit.type).to.equal(UnitType.assignment);
    });

    it('creates a ConditionUnit when type is "condition"', () => {
        const unit = UnitFactory.createDefaultSubworkflowUnit("condition");

        expect(unit).to.be.instanceOf(ConditionUnit);
        expect(unit.type).to.equal(UnitType.condition);
    });

    it('creates an IOUnit when type is "io"', () => {
        const unit = UnitFactory.createDefaultSubworkflowUnit("io");

        expect(unit).to.be.instanceOf(IOUnit);
        expect(unit.type).to.equal(UnitType.io);
    });

    it('creates an AssertionUnit when type is "assertion"', () => {
        const unit = UnitFactory.createDefaultSubworkflowUnit("assertion");

        expect(unit).to.be.instanceOf(AssertionUnit);
        expect(unit.type).to.equal(UnitType.assertion);
    });
});
