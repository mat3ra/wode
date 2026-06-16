import { Application } from "@mat3ra/ade";
import { type DefaultableInMemoryEntity, type NamedInMemoryEntity, InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import { type HashedEntity } from "@mat3ra/code/dist/js/entity/mixins/HashedEntityMixin";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { JobSchema, SubworkflowSchema } from "@mat3ra/esse/dist/js/types";
import { type ComputedEntityMixin } from "@mat3ra/ide/dist/js/compute";
import type { Material } from "@mat3ra/made";
import { Model, ModelFactory } from "@mat3ra/mode";
import type { MetaPropertyHolder } from "@mat3ra/prode";
import type { MaterialExternalContext } from "./context/mixins/MaterialContextMixin";
import type { MaterialsExternalContext } from "./context/mixins/MaterialsContextMixin";
import type { MaterialsSetExternalContext } from "./context/mixins/MaterialsSetContextMixin";
import type { JobExternalContext, WorkflowExternalContext } from "./context/providers/by_application/espresso/QEPWXInputDataManager";
import { type SubworkflowSchemaMixin } from "./generated/SubworkflowSchemaMixin";
import { SubworkflowUnit } from "./units";
import type { AnySubworkflowUnit } from "./units/factory";
type ConvergenceConfig = {
    parameter: "N_k" | "N_k_nonuniform";
    parameterInitial: number | [number, number, number];
    parameterIncrement: number;
    result: string;
    resultInitial: number;
    condition: string;
    operator: string;
    tolerance: number;
    maxOccurrences: number;
    externalContext: SubworkflowExternalContext;
};
interface Subworkflow extends DefaultableInMemoryEntity, NamedInMemoryEntity, SubworkflowSchemaMixin, HashedEntity, Omit<ComputedEntityMixin, "compute"> {
}
type SubworkflowExternalContext = MaterialExternalContext & MaterialsExternalContext & MaterialsSetExternalContext & WorkflowExternalContext & JobExternalContext;
declare class Subworkflow extends InMemoryEntity implements SubworkflowSchema {
    private ModelFactory;
    private applicationInstance;
    unitsInstances: AnySubworkflowUnit[];
    modelInstance: Model;
    properties: string[];
    repetition: number;
    static createDefault: () => Subworkflow;
    toJSON: () => SubworkflowSchema & AnyObject;
    _json: SubworkflowSchema & AnyObject;
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    constructor(config: SubworkflowSchema, _ModelFactory?: typeof ModelFactory);
    static get defaultConfig(): {
        _id: any;
        name: string;
        application: import("@mat3ra/esse/dist/js/types").ApplicationSchema;
        model: {
            functional: "pbe";
            method: {
                readonly type: "pseudopotential";
                readonly subtype: "us";
            };
            type: "dft";
            subtype: "gga";
        };
        properties: never[];
        units: never[];
    };
    setRepetition(repetition: number): void;
    getAsUnit(): SubworkflowUnit;
    setApplication(application: Application): void;
    setModel(model: Model): void;
    private buildExternalContext;
    render(context: SubworkflowExternalContext): void;
    /**
     * TODO: reuse workflow function instead
     */
    addUnit(unit: AnySubworkflowUnit, index?: number): void;
    private setUnits;
    removeUnit(flowchartId: string): void;
    getUnit(flowchartId: string): AnySubworkflowUnit | undefined;
    unitIndex(flowchartId: string): number;
    replaceUnit(index: number, unit: AnySubworkflowUnit): void;
    setIsDraft(bool: boolean): void;
    get methodData(): {
        [k: string]: unknown;
        searchText?: string;
    } | undefined;
    /**
     * @summary
     * Returns object for hashing of the workflow. Meaningful fields are units, app and model.
     * units must be sorted topologically before hashing (already sorted).
     */
    getHashObject(): {
        application: string;
        model: string;
        units: string;
    };
    findUnitById(id: string): {
        _id?: string;
        slug?: string;
        systemName?: string;
        schemaVersion?: string;
        name: string;
        isDefault?: boolean;
        preProcessors: {
            name: string;
            [k: string]: unknown;
        }[];
        postProcessors: {
            name: string;
            [k: string]: unknown;
        }[];
        monitors: {
            name: string;
            [k: string]: unknown;
        }[];
        results: {
            name: string;
            [k: string]: unknown;
        }[];
        tags?: string[];
        status?: "idle" | "active" | "warning" | "error" | "finished";
        statusTrack?: {
            trackedAt: number;
            status: string;
            repetition?: number;
        }[];
        isDraft?: boolean;
        type: "io";
        head?: boolean;
        flowchartId: string;
        next?: string;
        enableRender?: boolean;
        subtype: "input" | "output" | "dataFrame";
        source: "api" | "object_storage";
        input: ({
            type: "api";
            endpoint: string;
            endpoint_options: {};
            name?: string;
        } | {
            type: "object_storage";
            objectData: {
                CONTAINER?: string;
                NAME?: string;
                PROVIDER?: string;
                REGION?: string;
                SIZE?: number;
                TIMESTAMP?: string;
            };
            overwrite?: boolean;
            pathname?: string;
            basename?: string;
            filetype?: string;
        })[];
    } | {
        _id?: string;
        slug?: string;
        systemName?: string;
        schemaVersion?: string;
        name: string;
        isDefault?: boolean;
        preProcessors: {
            name: string;
            [k: string]: unknown;
        }[];
        postProcessors: {
            name: string;
            [k: string]: unknown;
        }[];
        monitors: {
            name: string;
            [k: string]: unknown;
        }[];
        results: {
            name: string;
            [k: string]: unknown;
        }[];
        tags?: string[];
        status?: "idle" | "active" | "warning" | "error" | "finished";
        statusTrack?: {
            trackedAt: number;
            status: string;
            repetition?: number;
        }[];
        isDraft?: boolean;
        type: "condition";
        head?: boolean;
        flowchartId: string;
        next?: string;
        enableRender?: boolean;
        input: {
            scope: string;
            name: string;
        }[];
        statement: string;
        then: string;
        else: string;
        maxOccurrences: number;
        throwException?: boolean;
    } | {
        _id?: string;
        slug?: string;
        systemName?: string;
        schemaVersion?: string;
        name: string;
        isDefault?: boolean;
        preProcessors: {
            name: string;
            [k: string]: unknown;
        }[];
        postProcessors: {
            name: string;
            [k: string]: unknown;
        }[];
        monitors: {
            name: string;
            [k: string]: unknown;
        }[];
        results: {
            name: string;
            [k: string]: unknown;
        }[];
        tags?: string[];
        status?: "idle" | "active" | "warning" | "error" | "finished";
        statusTrack?: {
            trackedAt: number;
            status: string;
            repetition?: number;
        }[];
        isDraft?: boolean;
        type: "assertion";
        head?: boolean;
        flowchartId: string;
        next?: string;
        enableRender?: boolean;
        statement: string;
        errorMessage?: string;
    } | {
        _id?: string;
        slug?: string;
        systemName?: string;
        schemaVersion?: string;
        name: string;
        isDefault?: boolean;
        preProcessors: {
            name: string;
            [k: string]: unknown;
        }[];
        postProcessors: {
            name: string;
            [k: string]: unknown;
        }[];
        monitors: {
            name: string;
            [k: string]: unknown;
        }[];
        results: {
            name: string;
            [k: string]: unknown;
        }[];
        tags?: string[];
        status?: "idle" | "active" | "warning" | "error" | "finished";
        statusTrack?: {
            trackedAt: number;
            status: string;
            repetition?: number;
        }[];
        isDraft?: boolean;
        type: "execution";
        head?: boolean;
        flowchartId: string;
        next?: string;
        enableRender?: boolean;
        application: {
            _id?: string;
            slug?: string;
            systemName?: string;
            schemaVersion?: string;
            name: string;
            isDefault?: boolean;
            shortName: string;
            summary: string;
            version: string;
            build: string;
            isDefaultVersion?: boolean;
            hasAdvancedComputeOptions?: boolean;
            isLicensed?: boolean;
            isUsingMaterial?: boolean;
            runConfig?: {
                commandTemplate: string;
                outFileName: string;
            };
        };
        executable: {
            _id?: string;
            slug?: string;
            systemName?: string;
            schemaVersion?: string;
            name: string;
            isDefault?: boolean;
            applicationName: string;
            applicationVersion: string;
            hasAdvancedComputeOptions?: boolean;
        };
        flavor: {
            _id?: string;
            slug?: string;
            systemName?: string;
            schemaVersion?: string;
            name: string;
            isDefault?: boolean;
            preProcessors: {
                name: string;
                [k: string]: unknown;
            }[];
            postProcessors: {
                name: string;
                [k: string]: unknown;
            }[];
            monitors: {
                name: string;
                [k: string]: unknown;
            }[];
            results: {
                name: string;
                [k: string]: unknown;
            }[];
            executableName: string;
            applicationName: string;
            applicationVersion: string;
            input: {
                templateId?: string;
                templateName?: string;
                name: string;
            }[];
        };
        input: {
            template: {
                _id?: string;
                slug?: string;
                systemName?: string;
                schemaVersion?: string;
                name: string;
                executableName: string;
                applicationName: string;
                applicationVersion: string;
                contextProviders: {
                    name: import("@mat3ra/esse/dist/js/types").ContextProviderNameEnum;
                }[];
                content: string;
            };
            rendered?: string;
            isManuallyChanged: boolean;
        }[];
        context: ({
            name: "input";
            data: {
                contextProviderName: "nwchem-total-energy";
                CHARGE: number;
                MULT: number;
                BASIS: string;
                NAT: number;
                NTYP: number;
                ATOMIC_POSITIONS: string;
                ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS: string;
                ATOMIC_SPECIES: string;
                FUNCTIONAL: string;
                CARTESIAN: boolean;
            } | {
                IBRAV: number;
                RESTART_MODE: "from_scratch" | "restart";
                ATOMIC_SPECIES: {
                    X: string;
                    Mass_X: number;
                    PseudoPot_X: string;
                }[];
                ATOMIC_SPECIES_WITH_LABELS: {
                    X: string;
                    Mass_X: number;
                    PseudoPot_X: string;
                }[];
                NAT: number;
                NTYP: number;
                NTYP_WITH_LABELS: number;
                ATOMIC_POSITIONS?: {
                    X?: string;
                    x: number;
                    y: number;
                    z: number;
                    "if_pos(1)"?: number;
                    "if_pos(2)"?: number;
                    "if_pos(3)"?: number;
                }[];
                ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS?: string;
                CELL_PARAMETERS: {
                    v1?: [number, number, number];
                    v2?: [number, number, number];
                    v3?: [number, number, number];
                };
                FIRST_IMAGE: {
                    X?: string;
                    x: number;
                    y: number;
                    z: number;
                    "if_pos(1)"?: number;
                    "if_pos(2)"?: number;
                    "if_pos(3)"?: number;
                }[];
                LAST_IMAGE: {
                    X?: string;
                    x: number;
                    y: number;
                    z: number;
                    "if_pos(1)"?: number;
                    "if_pos(2)"?: number;
                    "if_pos(3)"?: number;
                }[];
                INTERMEDIATE_IMAGES: {
                    X?: string;
                    x: number;
                    y: number;
                    z: number;
                    "if_pos(1)"?: number;
                    "if_pos(2)"?: number;
                    "if_pos(3)"?: number;
                }[][];
                contextProviderName: "qe-neb";
            } | {
                IBRAV: number;
                RESTART_MODE: "from_scratch" | "restart";
                ATOMIC_SPECIES: {
                    X: string;
                    Mass_X: number;
                    PseudoPot_X: string;
                }[];
                ATOMIC_SPECIES_WITH_LABELS: {
                    X: string;
                    Mass_X: number;
                    PseudoPot_X: string;
                }[];
                NAT: number;
                NTYP: number;
                NTYP_WITH_LABELS: number;
                ATOMIC_POSITIONS: {
                    X?: string;
                    x: number;
                    y: number;
                    z: number;
                    "if_pos(1)"?: number;
                    "if_pos(2)"?: number;
                    "if_pos(3)"?: number;
                }[];
                ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS: string;
                CELL_PARAMETERS: {
                    v1?: [number, number, number];
                    v2?: [number, number, number];
                    v3?: [number, number, number];
                };
                contextProviderName: "qe-pwx";
            } | {
                POSCAR: string;
                POSCAR_WITH_CONSTRAINTS: string;
                contextProviderName: "vasp";
            } | {
                FIRST_IMAGE: string;
                LAST_IMAGE: string;
                INTERMEDIATE_IMAGES: string[];
                contextProviderName: "vasp-neb";
            };
            extraData: {
                materialHash?: string;
            };
            isEdited: boolean;
        } | {
            name: "cutoffs";
            data: {
                wavefunction?: number;
                density?: number;
            };
            isEdited: boolean;
            extraData: {};
        } | {
            name: "kgrid" | "qgrid" | "igrid";
            data: {
                dimensions: [number, number, number] | [string, string, string];
                shifts?: [number, number, number];
                reciprocalVectorRatios?: [number, number, number];
                gridMetricType: "KPPRA" | "spacing";
                gridMetricValue: number;
                preferGridMetric?: boolean;
            };
            extraData: {
                materialHash?: string;
            };
            isEdited: boolean;
        } | {
            name: "qpath" | "ipath" | "kpath" | "explicitKPath" | "explicitKPath2PIBA";
            data: [{
                point: string;
                steps: number;
            }, ...{
                point: string;
                steps: number;
            }[]];
            extraData: {
                materialHash?: string;
            };
            isEdited: boolean;
        } | {
            name: "hubbard_j";
            data: [{
                paramType?: "U" | "J" | "B" | "E2" | "E3";
                atomicSpecies?: string;
                atomicOrbital?: string;
                value?: number;
            }, ...{
                paramType?: "U" | "J" | "B" | "E2" | "E3";
                atomicSpecies?: string;
                atomicOrbital?: string;
                value?: number;
            }[]];
            isEdited: boolean;
            extraData: {};
        } | {
            name: "hubbard_u";
            data: {
                atomicSpecies?: string;
                atomicOrbital?: string;
                hubbardUValue?: number;
            }[];
            extraData: {
                materialHash?: string;
            };
            isEdited: boolean;
        } | {
            name: "hubbard_v";
            data: [{
                atomicSpecies?: string;
                siteIndex?: number;
                atomicOrbital?: string;
                atomicSpecies2?: string;
                siteIndex2?: number;
                atomicOrbital2?: string;
                hubbardVValue?: number;
            }, ...{
                atomicSpecies?: string;
                siteIndex?: number;
                atomicOrbital?: string;
                atomicSpecies2?: string;
                siteIndex2?: number;
                atomicOrbital2?: string;
                hubbardVValue?: number;
            }[]];
            isEdited: boolean;
            extraData: {};
        } | {
            name: "hubbard_legacy";
            data: [{
                atomicSpecies?: string;
                atomicSpeciesIndex?: number;
                hubbardUValue?: number;
            }, ...{
                atomicSpecies?: string;
                atomicSpeciesIndex?: number;
                hubbardUValue?: number;
            }[]];
            isEdited: boolean;
            extraData: {};
        } | {
            name: "neb";
            data: {
                nImages?: number;
            };
            isEdited: boolean;
            extraData: {};
        } | {
            name: "boundaryConditions";
            data: {
                type?: "pbc" | "bc1" | "bc2" | "bc3";
                offset?: number;
                electricField?: number;
                targetFermiEnergy?: number;
            };
            extraData: {
                materialHash?: string;
            };
            isEdited: boolean;
        } | {
            name: "mlSettings";
            data: {
                target_column_name?: string;
                problem_category?: "regression" | "classification" | "clustering";
            };
            isEdited: boolean;
            extraData: {};
        } | {
            name: "mlTrainTestSplit";
            data: {
                fraction_held_as_test_set?: number;
            };
            isEdited: boolean;
            extraData: {};
        } | {
            name: "dynamics";
            data: {
                numberOfSteps?: number;
                timeStep?: number;
                electronMass?: number;
                temperature?: number;
            };
            isEdited: boolean;
            extraData: {};
        } | {
            name: "collinearMagnetization";
            data: {
                startingMagnetization: {
                    atomicSpecies: string;
                    value: number;
                    index: number;
                }[];
                isTotalMagnetization: boolean;
                totalMagnetization: number;
            };
            extraData: {
                materialHash?: string;
            };
            isEdited: boolean;
        } | {
            name: "nonCollinearMagnetization";
            data: {
                isExistingChargeDensity?: boolean;
                isStartingMagnetization?: boolean;
                startingMagnetization?: {
                    index?: number;
                    atomicSpecies?: string;
                    value?: number;
                }[];
                isArbitrarySpinAngle?: boolean;
                isArbitrarySpinDirection?: boolean;
                lforcet?: boolean;
                spinAngles?: {
                    index?: number;
                    atomicSpecies?: string;
                    angle1?: number;
                    angle2?: number;
                }[];
                isConstrainedMagnetization?: boolean;
                constrainedMagnetization?: {
                    constrainType?: "none" | "total" | "atomic" | "total direction" | "atomic direction";
                    lambda?: number;
                };
                isFixedMagnetization?: boolean;
                fixedMagnetization?: {
                    x?: number;
                    y?: number;
                    z?: number;
                };
            };
            extraData: {
                materialHash?: string;
            };
            isEdited: boolean;
        })[];
    } | {
        _id?: string;
        slug?: string;
        systemName?: string;
        schemaVersion?: string;
        name: string;
        isDefault?: boolean;
        preProcessors: {
            name: string;
            [k: string]: unknown;
        }[];
        postProcessors: {
            name: string;
            [k: string]: unknown;
        }[];
        monitors: {
            name: string;
            [k: string]: unknown;
        }[];
        results: {
            name: string;
            [k: string]: unknown;
        }[];
        tags?: string[];
        status?: "idle" | "active" | "warning" | "error" | "finished";
        statusTrack?: {
            trackedAt: number;
            status: string;
            repetition?: number;
        }[];
        isDraft?: boolean;
        type: "assignment";
        head?: boolean;
        flowchartId: string;
        next?: string;
        enableRender?: boolean;
        scope?: string;
        input?: {
            scope: string;
            name: string;
        }[];
        operand: string;
        value: string | boolean | number;
    } | {
        _id?: string;
        slug?: string;
        systemName?: string;
        schemaVersion?: string;
        name: string;
        isDefault?: boolean;
        preProcessors: {
            name: string;
            [k: string]: unknown;
        }[];
        postProcessors: {
            name: string;
            [k: string]: unknown;
        }[];
        monitors: {
            name: string;
            [k: string]: unknown;
        }[];
        results: {
            name: string;
            [k: string]: unknown;
        }[];
        tags?: string[];
        status?: "idle" | "active" | "warning" | "error" | "finished";
        statusTrack?: {
            trackedAt: number;
            status: string;
            repetition?: number;
        }[];
        isDraft?: boolean;
        type: "error";
        head?: boolean;
        flowchartId: string;
        next?: string;
        enableRender?: boolean;
        reason: string;
    } | undefined;
    findUnitKeyById(id: string): string;
    private findUnitWithTag;
    get hasConvergence(): boolean;
    get convergenceParam(): string | undefined;
    get convergenceResult(): string | undefined;
    convergenceSeries(scopeTrack: JobSchema["scopeTrack"]): {
        x: number;
        param: any;
        y: any;
    }[];
    updateMethodData(materials: Material[], metaProperties: MetaPropertyHolder[]): void;
    addConvergence({ parameter, parameterInitial, parameterIncrement, result, resultInitial, condition, operator, tolerance, maxOccurrences, externalContext, }: ConvergenceConfig): void;
}
export default Subworkflow;
