import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import esseSchemas from "@mat3ra/esse/dist/js/schemas.json";
import type { ApplicationSchema, ExecutionUnitInputItemSchema } from "@mat3ra/esse/dist/js/types";
import { ApplicationRegistry } from "@mat3ra/standata";
import StandataDriver from "@mat3ra/standata/dist/js/StandataDriver";
import { expect } from "chai";
import type { JSONSchema7 } from "json-schema";

import { ExecutionUnit } from "../../src/js";

const inputNames = (unit: ExecutionUnit) => unit.input.map((item) => item.template.name);

describe("ExecutionUnit added input files", () => {
    let pythonApplication: ApplicationSchema;

    before(() => {
        JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
    });

    beforeEach(() => {
        ApplicationRegistry.setDriver(new StandataDriver());
        pythonApplication = new ApplicationRegistry().findApplication({ name: "python" });
    });

    const addedInputItem = (unit: ExecutionUnit): ExecutionUnitInputItemSchema => ({
        template: {
            name: "new_file.txt",
            content: "",
            contextProviders: [],
            applicationName: unit.application.name,
            applicationVersion: "*",
            executableName: unit.executable.name,
        },
        isManuallyChanged: true,
    });

    it("keeps an added input file when reconstructed from saved JSON", () => {
        const unit = new ExecutionUnit({ application: pythonApplication });
        unit.input = [...unit.input, addedInputItem(unit)];

        const names = inputNames(new ExecutionUnit(unit.toJSON()));
        expect(names).to.deep.equal(["script.py", "requirements.txt", "new_file.txt"]);
    });

    it("keeps a renamed driver file alongside an added one", () => {
        const unit = new ExecutionUnit({ application: pythonApplication });
        unit.input = unit.input.map((item, index) =>
            index === 0 ? { ...item, template: { ...item.template, name: "my_script.py" } } : item,
        );
        unit.input = [...unit.input, addedInputItem(unit)];

        const names = inputNames(new ExecutionUnit(unit.toJSON()));
        expect(names).to.deep.equal(["my_script.py", "requirements.txt", "new_file.txt"]);
    });

    it("drops an added input file the unit's application version no longer satisfies", () => {
        const registry = new ApplicationRegistry();
        const unit = new ExecutionUnit({
            application: registry.findApplication({ name: "espresso", version: "7.5" }),
        });
        const driverNames = inputNames(unit);
        const addedItem = addedInputItem(unit);
        unit.input = [
            ...unit.input,
            { ...addedItem, template: { ...addedItem.template, applicationVersion: "7.5" } },
        ];

        unit.setApplication({
            application: registry.findApplication({ name: "espresso", version: "6.3" }),
        });

        expect(inputNames(unit)).to.deep.equal(driverNames);
    });
});
