export class Workflow extends BaseWorkflow {
    static getDefaultComputeConfig: any;
    static jsonSchema: {
        $id: string;
        $schema: string;
        title: string;
        type: string;
        required: string[];
        properties: {
            workflows: {
                description: string;
                type: string;
                items: {
                    type: string;
                };
            };
            _id: {
                description: string;
                type: string;
            };
            slug: {
                description: string;
                type: string;
            };
            systemName: {
                type: string;
            };
            schemaVersion: {
                description: string;
                type: string;
                default: string;
            };
            name: {
                description: string;
                type: string;
            };
            isDefault: {
                description: string;
                type: string;
                default: boolean;
            };
            metadata: {
                type: string;
            };
            properties: {
                description: string;
                type: string;
                items: {
                    description: string;
                    type: string;
                };
            };
            isUsingDataset: {
                description: string;
                type: string;
            };
            subworkflows: {
                description: string;
                type: string;
                items: {
                    $schema: string;
                    title: string;
                    type: string;
                    required: string[];
                    properties: {
                        _id: {
                            description: string;
                            type: string;
                        };
                        slug: {
                            description: string;
                            type: string;
                        };
                        systemName: {
                            type: string;
                        };
                        schemaVersion: {
                            description: string;
                            type: string;
                            default: string;
                        };
                        name: {
                            description: string;
                            type: string;
                        };
                        properties: {
                            description: string;
                            type: string;
                            items: {
                                description: string;
                                type: string;
                            };
                        };
                        compute: {
                            $schema: string;
                            title: string;
                            description: string;
                            type: string;
                            required: string[];
                            properties: {
                                queue: {
                                    description: string;
                                    type: string;
                                    enum: string[];
                                };
                                nodes: {
                                    description: string;
                                    type: string;
                                };
                                ppn: {
                                    description: string;
                                    type: string;
                                };
                                timeLimit: {
                                    description: string;
                                    type: string;
                                };
                                timeLimitType: {
                                    description: string;
                                    type: string;
                                    default: string;
                                    enum: string[];
                                };
                                isRestartable: {
                                    description: string;
                                    type: string;
                                    default: boolean;
                                };
                                notify: {
                                    description: string;
                                    type: string;
                                };
                                email: {
                                    description: string;
                                    type: string;
                                };
                                maxCPU: {
                                    description: string;
                                    type: string;
                                };
                                arguments: {
                                    description: string;
                                    default: {};
                                    $schema: string;
                                    title: string;
                                    type: string;
                                    additionalProperties: boolean;
                                    properties: {
                                        nimage: {
                                            description: string;
                                            type: string;
                                            default: number;
                                            minimum: number;
                                            maximum: number;
                                        };
                                        npools: {
                                            description: string;
                                            type: string;
                                            default: number;
                                            minimum: number;
                                            maximum: number;
                                        };
                                        nband: {
                                            description: string;
                                            type: string;
                                            default: number;
                                            minimum: number;
                                            maximum: number;
                                        };
                                        ntg: {
                                            description: string;
                                            type: string;
                                            default: number;
                                            minimum: number;
                                            maximum: number;
                                        };
                                        ndiag: {
                                            description: string;
                                            type: string;
                                            default: number;
                                            minimum: number;
                                            maximum: number;
                                        };
                                    };
                                };
                                cluster: {
                                    description: string;
                                    type: string;
                                    properties: {
                                        fqdn: {
                                            description: string;
                                            type: string;
                                        };
                                        jid: {
                                            description: string;
                                            type: string;
                                        };
                                    };
                                };
                                errors: {
                                    description: string;
                                    type: string;
                                    items: {
                                        type: string;
                                        properties: {
                                            domain: {
                                                description: string;
                                                type: string;
                                                enum: string[];
                                            };
                                            reason: {
                                                description: string;
                                                type: string;
                                            };
                                            message: {
                                                description: string;
                                                type: string;
                                            };
                                            traceback: {
                                                description: string;
                                                type: string;
                                            };
                                        };
                                    };
                                };
                                excludeFilesPattern: {
                                    description: string;
                                    type: string;
                                };
                            };
                        };
                        units: {
                            description: string;
                            type: string;
                            items: {
                                $schema: string;
                                title: string;
                                type: string;
                                oneOf: ({
                                    $schema: string;
                                    title: string;
                                    type: string;
                                    required: string[];
                                    properties: {
                                        _id: {
                                            description: string;
                                            type: string;
                                        };
                                        slug: {
                                            description: string;
                                            type: string;
                                        };
                                        systemName: {
                                            type: string;
                                        };
                                        schemaVersion: {
                                            description: string;
                                            type: string;
                                            default: string;
                                        };
                                        name: {
                                            description: string;
                                            type: string;
                                        };
                                        isDefault: {
                                            description: string;
                                            type: string;
                                            default: boolean;
                                        };
                                        preProcessors: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        postProcessors: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        monitors: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        results: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        tags: {
                                            description: string;
                                            type: string;
                                            items: {
                                                type: string;
                                            };
                                        };
                                        status: {
                                            type: string;
                                            description: string;
                                            enum: string[];
                                        };
                                        statusTrack: {
                                            type: string;
                                            items: {
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    trackedAt: {
                                                        type: string;
                                                    };
                                                    status: {
                                                        type: string;
                                                    };
                                                    repetition: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        isDraft: {
                                            type: string;
                                        };
                                        type: {
                                            description: string;
                                            type: string;
                                            const: string;
                                        };
                                        head: {
                                            description: string;
                                            type: string;
                                        };
                                        flowchartId: {
                                            description: string;
                                            type: string;
                                        };
                                        next: {
                                            description: string;
                                            type: string;
                                        };
                                        enableRender: {
                                            description: string;
                                            type: string;
                                        };
                                        subtype: {
                                            enum: string[];
                                        };
                                        source: {
                                            enum: string[];
                                        };
                                        input: {
                                            type: string;
                                            items: {
                                                oneOf: ({
                                                    $schema: string;
                                                    title: string;
                                                    type: string;
                                                    properties: {
                                                        type: {
                                                            const: string;
                                                        };
                                                        ids: {
                                                            description: string;
                                                            type: string;
                                                            items: {
                                                                type: string;
                                                            };
                                                        };
                                                        collection?: undefined;
                                                        draft?: undefined;
                                                        objectData?: undefined;
                                                        overwrite?: undefined;
                                                        pathname?: undefined;
                                                        basename?: undefined;
                                                        filetype?: undefined;
                                                    };
                                                    required: string[];
                                                } | {
                                                    $schema: string;
                                                    title: string;
                                                    type: string;
                                                    properties: {
                                                        type: {
                                                            const: string;
                                                        };
                                                        collection: {
                                                            description: string;
                                                            type: string;
                                                        };
                                                        draft: {
                                                            description: string;
                                                            type: string;
                                                        };
                                                        ids?: undefined;
                                                        objectData?: undefined;
                                                        overwrite?: undefined;
                                                        pathname?: undefined;
                                                        basename?: undefined;
                                                        filetype?: undefined;
                                                    };
                                                    required: string[];
                                                } | {
                                                    $schema: string;
                                                    title: string;
                                                    type: string;
                                                    required: string[];
                                                    properties: {
                                                        type: {
                                                            const: string;
                                                        };
                                                        objectData: {
                                                            $schema: string;
                                                            title: string;
                                                            type: string;
                                                            properties: {
                                                                CONTAINER: {
                                                                    description: string;
                                                                    type: string;
                                                                };
                                                                NAME: {
                                                                    description: string;
                                                                    type: string;
                                                                };
                                                                PROVIDER: {
                                                                    description: string;
                                                                    type: string;
                                                                };
                                                                REGION: {
                                                                    description: string;
                                                                    type: string;
                                                                };
                                                                SIZE: {
                                                                    description: string;
                                                                    type: string;
                                                                };
                                                                TIMESTAMP: {
                                                                    description: string;
                                                                    type: string;
                                                                };
                                                            };
                                                        };
                                                        overwrite: {
                                                            description: string;
                                                            type: string;
                                                        };
                                                        pathname: {
                                                            description: string;
                                                            type: string;
                                                        };
                                                        basename: {
                                                            description: string;
                                                            type: string;
                                                            $comment: string;
                                                        };
                                                        filetype: {
                                                            description: string;
                                                            type: string;
                                                        };
                                                        ids?: undefined;
                                                        collection?: undefined;
                                                        draft?: undefined;
                                                    };
                                                })[];
                                                discriminator: {
                                                    propertyName: string;
                                                };
                                                $schema?: undefined;
                                                title?: undefined;
                                                type?: undefined;
                                                required?: undefined;
                                                properties?: undefined;
                                            };
                                            description?: undefined;
                                        };
                                        statement?: undefined;
                                        then?: undefined;
                                        else?: undefined;
                                        maxOccurrences?: undefined;
                                        throwException?: undefined;
                                        errorMessage?: undefined;
                                        application?: undefined;
                                        executable?: undefined;
                                        flavor?: undefined;
                                        context?: undefined;
                                        scope?: undefined;
                                        operand?: undefined;
                                        value?: undefined;
                                    };
                                } | {
                                    $schema: string;
                                    title: string;
                                    type: string;
                                    required: string[];
                                    properties: {
                                        _id: {
                                            description: string;
                                            type: string;
                                        };
                                        slug: {
                                            description: string;
                                            type: string;
                                        };
                                        systemName: {
                                            type: string;
                                        };
                                        schemaVersion: {
                                            description: string;
                                            type: string;
                                            default: string;
                                        };
                                        name: {
                                            description: string;
                                            type: string;
                                        };
                                        isDefault: {
                                            description: string;
                                            type: string;
                                            default: boolean;
                                        };
                                        preProcessors: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        postProcessors: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        monitors: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        results: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        tags: {
                                            description: string;
                                            type: string;
                                            items: {
                                                type: string;
                                            };
                                        };
                                        status: {
                                            type: string;
                                            description: string;
                                            enum: string[];
                                        };
                                        statusTrack: {
                                            type: string;
                                            items: {
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    trackedAt: {
                                                        type: string;
                                                    };
                                                    status: {
                                                        type: string;
                                                    };
                                                    repetition: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        isDraft: {
                                            type: string;
                                        };
                                        type: {
                                            description: string;
                                            type: string;
                                            const: string;
                                        };
                                        head: {
                                            description: string;
                                            type: string;
                                        };
                                        flowchartId: {
                                            description: string;
                                            type: string;
                                        };
                                        next: {
                                            description: string;
                                            type: string;
                                        };
                                        enableRender: {
                                            description: string;
                                            type: string;
                                        };
                                        input: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    scope: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                    template?: undefined;
                                                    rendered?: undefined;
                                                    isManuallyChanged?: undefined;
                                                };
                                                oneOf?: undefined;
                                                discriminator?: undefined;
                                            };
                                        };
                                        statement: {
                                            description: string;
                                            type: string;
                                        };
                                        then: {
                                            description: string;
                                            type: string;
                                        };
                                        else: {
                                            description: string;
                                            type: string;
                                        };
                                        maxOccurrences: {
                                            description: string;
                                            type: string;
                                        };
                                        throwException: {
                                            description: string;
                                            type: string;
                                        };
                                        subtype?: undefined;
                                        source?: undefined;
                                        errorMessage?: undefined;
                                        application?: undefined;
                                        executable?: undefined;
                                        flavor?: undefined;
                                        context?: undefined;
                                        scope?: undefined;
                                        operand?: undefined;
                                        value?: undefined;
                                    };
                                } | {
                                    $schema: string;
                                    title: string;
                                    type: string;
                                    required: string[];
                                    properties: {
                                        _id: {
                                            description: string;
                                            type: string;
                                        };
                                        slug: {
                                            description: string;
                                            type: string;
                                        };
                                        systemName: {
                                            type: string;
                                        };
                                        schemaVersion: {
                                            description: string;
                                            type: string;
                                            default: string;
                                        };
                                        name: {
                                            description: string;
                                            type: string;
                                        };
                                        isDefault: {
                                            description: string;
                                            type: string;
                                            default: boolean;
                                        };
                                        preProcessors: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        postProcessors: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        monitors: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        results: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        tags: {
                                            description: string;
                                            type: string;
                                            items: {
                                                type: string;
                                            };
                                        };
                                        status: {
                                            type: string;
                                            description: string;
                                            enum: string[];
                                        };
                                        statusTrack: {
                                            type: string;
                                            items: {
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    trackedAt: {
                                                        type: string;
                                                    };
                                                    status: {
                                                        type: string;
                                                    };
                                                    repetition: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        isDraft: {
                                            type: string;
                                        };
                                        type: {
                                            description: string;
                                            type: string;
                                            const: string;
                                        };
                                        head: {
                                            description: string;
                                            type: string;
                                        };
                                        flowchartId: {
                                            description: string;
                                            type: string;
                                        };
                                        next: {
                                            description: string;
                                            type: string;
                                        };
                                        enableRender: {
                                            description: string;
                                            type: string;
                                        };
                                        statement: {
                                            type: string;
                                            description: string;
                                        };
                                        errorMessage: {
                                            type: string;
                                            description: string;
                                        };
                                        subtype?: undefined;
                                        source?: undefined;
                                        input?: undefined;
                                        then?: undefined;
                                        else?: undefined;
                                        maxOccurrences?: undefined;
                                        throwException?: undefined;
                                        application?: undefined;
                                        executable?: undefined;
                                        flavor?: undefined;
                                        context?: undefined;
                                        scope?: undefined;
                                        operand?: undefined;
                                        value?: undefined;
                                    };
                                } | {
                                    $schema: string;
                                    title: string;
                                    type: string;
                                    required: string[];
                                    properties: {
                                        _id: {
                                            description: string;
                                            type: string;
                                        };
                                        slug: {
                                            description: string;
                                            type: string;
                                        };
                                        systemName: {
                                            type: string;
                                        };
                                        schemaVersion: {
                                            description: string;
                                            type: string;
                                            default: string;
                                        };
                                        name: {
                                            description: string;
                                            type: string;
                                        };
                                        isDefault: {
                                            description: string;
                                            type: string;
                                            default: boolean;
                                        };
                                        preProcessors: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        postProcessors: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        monitors: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        results: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        tags: {
                                            description: string;
                                            type: string;
                                            items: {
                                                type: string;
                                            };
                                        };
                                        status: {
                                            type: string;
                                            description: string;
                                            enum: string[];
                                        };
                                        statusTrack: {
                                            type: string;
                                            items: {
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    trackedAt: {
                                                        type: string;
                                                    };
                                                    status: {
                                                        type: string;
                                                    };
                                                    repetition: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        isDraft: {
                                            type: string;
                                        };
                                        type: {
                                            description: string;
                                            type: string;
                                            const: string;
                                        };
                                        head: {
                                            description: string;
                                            type: string;
                                        };
                                        flowchartId: {
                                            description: string;
                                            type: string;
                                        };
                                        next: {
                                            description: string;
                                            type: string;
                                        };
                                        enableRender: {
                                            description: string;
                                            type: string;
                                        };
                                        application: {
                                            $schema: string;
                                            title: string;
                                            type: string;
                                            required: string[];
                                            properties: {
                                                _id: {
                                                    description: string;
                                                    type: string;
                                                };
                                                slug: {
                                                    description: string;
                                                    type: string;
                                                };
                                                systemName: {
                                                    type: string;
                                                };
                                                schemaVersion: {
                                                    description: string;
                                                    type: string;
                                                    default: string;
                                                };
                                                name: {
                                                    description: string;
                                                    type: string;
                                                };
                                                isDefault: {
                                                    description: string;
                                                    type: string;
                                                    default: boolean;
                                                };
                                                shortName: {
                                                    description: string;
                                                    type: string;
                                                };
                                                summary: {
                                                    description: string;
                                                    type: string;
                                                };
                                                version: {
                                                    description: string;
                                                    type: string;
                                                };
                                                build: {
                                                    description: string;
                                                    type: string;
                                                };
                                                hasAdvancedComputeOptions: {
                                                    description: string;
                                                    type: string;
                                                };
                                                isLicensed: {
                                                    description: string;
                                                    type: string;
                                                };
                                            };
                                        };
                                        executable: {
                                            $schema: string;
                                            title: string;
                                            type: string;
                                            required: string[];
                                            properties: {
                                                _id: {
                                                    description: string;
                                                    type: string;
                                                };
                                                slug: {
                                                    description: string;
                                                    type: string;
                                                };
                                                systemName: {
                                                    type: string;
                                                };
                                                schemaVersion: {
                                                    description: string;
                                                    type: string;
                                                    default: string;
                                                };
                                                name: {
                                                    description: string;
                                                    type: string;
                                                };
                                                isDefault: {
                                                    description: string;
                                                    type: string;
                                                    default: boolean;
                                                };
                                                preProcessors: {
                                                    description: string;
                                                    type: string;
                                                    items: {
                                                        $schema: string;
                                                        title: string;
                                                        type: string;
                                                        required: string[];
                                                        properties: {
                                                            name: {
                                                                description: string;
                                                                type: string;
                                                            };
                                                        };
                                                    };
                                                };
                                                postProcessors: {
                                                    description: string;
                                                    type: string;
                                                    items: {
                                                        $schema: string;
                                                        title: string;
                                                        type: string;
                                                        required: string[];
                                                        properties: {
                                                            name: {
                                                                description: string;
                                                                type: string;
                                                            };
                                                        };
                                                    };
                                                };
                                                monitors: {
                                                    description: string;
                                                    type: string;
                                                    items: {
                                                        $schema: string;
                                                        title: string;
                                                        type: string;
                                                        required: string[];
                                                        properties: {
                                                            name: {
                                                                description: string;
                                                                type: string;
                                                            };
                                                        };
                                                    };
                                                };
                                                results: {
                                                    description: string;
                                                    type: string;
                                                    items: {
                                                        $schema: string;
                                                        title: string;
                                                        type: string;
                                                        required: string[];
                                                        properties: {
                                                            name: {
                                                                description: string;
                                                                type: string;
                                                            };
                                                        };
                                                    };
                                                };
                                                applicationId: {
                                                    description: string;
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                    };
                                                };
                                                hasAdvancedComputeOptions: {
                                                    description: string;
                                                    type: string;
                                                };
                                            };
                                        };
                                        flavor: {
                                            $schema: string;
                                            title: string;
                                            type: string;
                                            required: string[];
                                            properties: {
                                                _id: {
                                                    description: string;
                                                    type: string;
                                                };
                                                slug: {
                                                    description: string;
                                                    type: string;
                                                };
                                                systemName: {
                                                    type: string;
                                                };
                                                schemaVersion: {
                                                    description: string;
                                                    type: string;
                                                    default: string;
                                                };
                                                name: {
                                                    description: string;
                                                    type: string;
                                                };
                                                isDefault: {
                                                    description: string;
                                                    type: string;
                                                    default: boolean;
                                                };
                                                preProcessors: {
                                                    description: string;
                                                    type: string;
                                                    items: {
                                                        $schema: string;
                                                        title: string;
                                                        type: string;
                                                        required: string[];
                                                        properties: {
                                                            name: {
                                                                description: string;
                                                                type: string;
                                                            };
                                                        };
                                                    };
                                                };
                                                postProcessors: {
                                                    description: string;
                                                    type: string;
                                                    items: {
                                                        $schema: string;
                                                        title: string;
                                                        type: string;
                                                        required: string[];
                                                        properties: {
                                                            name: {
                                                                description: string;
                                                                type: string;
                                                            };
                                                        };
                                                    };
                                                };
                                                monitors: {
                                                    description: string;
                                                    type: string;
                                                    items: {
                                                        $schema: string;
                                                        title: string;
                                                        type: string;
                                                        required: string[];
                                                        properties: {
                                                            name: {
                                                                description: string;
                                                                type: string;
                                                            };
                                                        };
                                                    };
                                                };
                                                results: {
                                                    description: string;
                                                    type: string;
                                                    items: {
                                                        $schema: string;
                                                        title: string;
                                                        type: string;
                                                        required: string[];
                                                        properties: {
                                                            name: {
                                                                description: string;
                                                                type: string;
                                                            };
                                                        };
                                                    };
                                                };
                                                executableId: {
                                                    description: string;
                                                    type: string;
                                                };
                                                executableName: {
                                                    description: string;
                                                    type: string;
                                                };
                                                applicationName: {
                                                    description: string;
                                                    type: string;
                                                };
                                                input: {
                                                    title: string;
                                                    type: string;
                                                    items: {
                                                        $schema: string;
                                                        title: string;
                                                        type: string;
                                                        additionalProperties: boolean;
                                                        properties: {
                                                            templateId: {
                                                                type: string;
                                                            };
                                                            templateName: {
                                                                type: string;
                                                            };
                                                            name: {
                                                                description: string;
                                                                type: string;
                                                            };
                                                        };
                                                    };
                                                };
                                                supportedApplicationVersions: {
                                                    description: string;
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        input: {
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    template: {
                                                        $schema: string;
                                                        title: string;
                                                        type: string;
                                                        required: string[];
                                                        properties: {
                                                            _id: {
                                                                description: string;
                                                                type: string;
                                                            };
                                                            slug: {
                                                                description: string;
                                                                type: string;
                                                            };
                                                            systemName: {
                                                                type: string;
                                                            };
                                                            schemaVersion: {
                                                                description: string;
                                                                type: string;
                                                                default: string;
                                                            };
                                                            name: {
                                                                description: string;
                                                                type: string;
                                                            };
                                                            applicationName: {
                                                                type: string;
                                                            };
                                                            applicationVersion: {
                                                                type: string;
                                                            };
                                                            executableName: {
                                                                type: string;
                                                            };
                                                            contextProviders: {
                                                                type: string;
                                                                items: {
                                                                    description: string;
                                                                    type: string;
                                                                    required: string[];
                                                                    properties: {
                                                                        name: {
                                                                            type: string;
                                                                            tsType: string;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                            content: {
                                                                description: string;
                                                                type: string;
                                                            };
                                                        };
                                                    };
                                                    rendered: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                    isManuallyChanged: {
                                                        type: string;
                                                        default: boolean;
                                                    };
                                                    scope?: undefined;
                                                    name?: undefined;
                                                };
                                                oneOf?: undefined;
                                                discriminator?: undefined;
                                            };
                                            description?: undefined;
                                        };
                                        context: {
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                oneOf: ({
                                                    $schema: string;
                                                    title: string;
                                                    type: string;
                                                    required: string[];
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                            const: string;
                                                            enum?: undefined;
                                                        };
                                                        data: {
                                                            oneOf: ({
                                                                $schema: string;
                                                                title: string;
                                                                description: string;
                                                                type: string;
                                                                properties: {
                                                                    contextProviderName: {
                                                                        type: string;
                                                                        const: string;
                                                                        description: string;
                                                                    };
                                                                    CHARGE: {
                                                                        type: string;
                                                                        description: string;
                                                                    };
                                                                    MULT: {
                                                                        type: string;
                                                                        description: string;
                                                                    };
                                                                    BASIS: {
                                                                        type: string;
                                                                        description: string;
                                                                    };
                                                                    NAT: {
                                                                        type: string;
                                                                        description: string;
                                                                    };
                                                                    NTYP: {
                                                                        type: string;
                                                                        description: string;
                                                                    };
                                                                    ATOMIC_POSITIONS: {
                                                                        type: string;
                                                                        description: string;
                                                                        items?: undefined;
                                                                    };
                                                                    ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS: {
                                                                        type: string;
                                                                        description: string;
                                                                    };
                                                                    ATOMIC_SPECIES: {
                                                                        type: string;
                                                                        description: string;
                                                                        items?: undefined;
                                                                    };
                                                                    FUNCTIONAL: {
                                                                        type: string;
                                                                        description: string;
                                                                    };
                                                                    CARTESIAN: {
                                                                        type: string;
                                                                        description: string;
                                                                    };
                                                                    IBRAV?: undefined;
                                                                    RESTART_MODE?: undefined;
                                                                    ATOMIC_SPECIES_WITH_LABELS?: undefined;
                                                                    NTYP_WITH_LABELS?: undefined;
                                                                    CELL_PARAMETERS?: undefined;
                                                                    FIRST_IMAGE?: undefined;
                                                                    LAST_IMAGE?: undefined;
                                                                    INTERMEDIATE_IMAGES?: undefined;
                                                                    POSCAR?: undefined;
                                                                    POSCAR_WITH_CONSTRAINTS?: undefined;
                                                                };
                                                                required: string[];
                                                            } | {
                                                                $schema: string;
                                                                title: string;
                                                                description: string;
                                                                type: string;
                                                                required: string[];
                                                                properties: {
                                                                    IBRAV: {
                                                                        type: string;
                                                                    };
                                                                    RESTART_MODE: {
                                                                        type: string;
                                                                        enum: string[];
                                                                        default: string;
                                                                    };
                                                                    ATOMIC_SPECIES: {
                                                                        type: string;
                                                                        items: {
                                                                            type: string;
                                                                            required: string[];
                                                                            additionalProperties: boolean;
                                                                            properties: {
                                                                                X: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                Mass_X: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                PseudoPot_X: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                            };
                                                                        };
                                                                        description?: undefined;
                                                                    };
                                                                    ATOMIC_SPECIES_WITH_LABELS: {
                                                                        type: string;
                                                                        items: {
                                                                            type: string;
                                                                            required: string[];
                                                                            additionalProperties: boolean;
                                                                            properties: {
                                                                                X: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                Mass_X: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                PseudoPot_X: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                            };
                                                                        };
                                                                    };
                                                                    NAT: {
                                                                        type: string;
                                                                        description: string;
                                                                    };
                                                                    NTYP: {
                                                                        type: string;
                                                                        description: string;
                                                                    };
                                                                    NTYP_WITH_LABELS: {
                                                                        type: string;
                                                                        description: string;
                                                                        minimum: number;
                                                                    };
                                                                    ATOMIC_POSITIONS: {
                                                                        type: string;
                                                                        items: {
                                                                            type: string;
                                                                            required: string[];
                                                                            additionalProperties: boolean;
                                                                            properties: {
                                                                                X: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                x: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                y: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                z: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                "if_pos(1)": {
                                                                                    $schema: string;
                                                                                    title: string;
                                                                                    type: string;
                                                                                    minimum: number;
                                                                                    maximum: number;
                                                                                };
                                                                                "if_pos(2)": {
                                                                                    $schema: string;
                                                                                    title: string;
                                                                                    type: string;
                                                                                    minimum: number;
                                                                                    maximum: number;
                                                                                };
                                                                                "if_pos(3)": {
                                                                                    $schema: string;
                                                                                    title: string;
                                                                                    type: string;
                                                                                    minimum: number;
                                                                                    maximum: number;
                                                                                };
                                                                            };
                                                                        };
                                                                        description?: undefined;
                                                                    };
                                                                    ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS: {
                                                                        type: string;
                                                                        description: string;
                                                                    };
                                                                    CELL_PARAMETERS: {
                                                                        type: string;
                                                                        additionalProperties: boolean;
                                                                        properties: {
                                                                            v1: {
                                                                                $schema: string;
                                                                                title: string;
                                                                                type: string;
                                                                                minItems: number;
                                                                                maxItems: number;
                                                                                items: {
                                                                                    type: string;
                                                                                };
                                                                            };
                                                                            v2: {
                                                                                $schema: string;
                                                                                title: string;
                                                                                type: string;
                                                                                minItems: number;
                                                                                maxItems: number;
                                                                                items: {
                                                                                    type: string;
                                                                                };
                                                                            };
                                                                            v3: {
                                                                                $schema: string;
                                                                                title: string;
                                                                                type: string;
                                                                                minItems: number;
                                                                                maxItems: number;
                                                                                items: {
                                                                                    type: string;
                                                                                };
                                                                            };
                                                                        };
                                                                    };
                                                                    FIRST_IMAGE: {
                                                                        type: string;
                                                                        items: {
                                                                            type: string;
                                                                            required: string[];
                                                                            additionalProperties: boolean;
                                                                            properties: {
                                                                                X: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                x: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                y: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                z: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                "if_pos(1)": {
                                                                                    $schema: string;
                                                                                    title: string;
                                                                                    type: string;
                                                                                    minimum: number;
                                                                                    maximum: number;
                                                                                };
                                                                                "if_pos(2)": {
                                                                                    $schema: string;
                                                                                    title: string;
                                                                                    type: string;
                                                                                    minimum: number;
                                                                                    maximum: number;
                                                                                };
                                                                                "if_pos(3)": {
                                                                                    $schema: string;
                                                                                    title: string;
                                                                                    type: string;
                                                                                    minimum: number;
                                                                                    maximum: number;
                                                                                };
                                                                            };
                                                                        };
                                                                        description?: undefined;
                                                                    };
                                                                    LAST_IMAGE: {
                                                                        type: string;
                                                                        items: {
                                                                            type: string;
                                                                            required: string[];
                                                                            additionalProperties: boolean;
                                                                            properties: {
                                                                                X: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                x: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                y: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                z: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                "if_pos(1)": {
                                                                                    $schema: string;
                                                                                    title: string;
                                                                                    type: string;
                                                                                    minimum: number;
                                                                                    maximum: number;
                                                                                };
                                                                                "if_pos(2)": {
                                                                                    $schema: string;
                                                                                    title: string;
                                                                                    type: string;
                                                                                    minimum: number;
                                                                                    maximum: number;
                                                                                };
                                                                                "if_pos(3)": {
                                                                                    $schema: string;
                                                                                    title: string;
                                                                                    type: string;
                                                                                    minimum: number;
                                                                                    maximum: number;
                                                                                };
                                                                            };
                                                                        };
                                                                        description?: undefined;
                                                                    };
                                                                    INTERMEDIATE_IMAGES: {
                                                                        type: string;
                                                                        description: string;
                                                                        items: {
                                                                            type: string;
                                                                            items: {
                                                                                type: string;
                                                                                required: string[];
                                                                                additionalProperties: boolean;
                                                                                properties: {
                                                                                    X: {
                                                                                        type: string;
                                                                                        description: string;
                                                                                    };
                                                                                    x: {
                                                                                        type: string;
                                                                                        description: string;
                                                                                    };
                                                                                    y: {
                                                                                        type: string;
                                                                                        description: string;
                                                                                    };
                                                                                    z: {
                                                                                        type: string;
                                                                                        description: string;
                                                                                    };
                                                                                    "if_pos(1)": {
                                                                                        $schema: string;
                                                                                        title: string;
                                                                                        type: string;
                                                                                        minimum: number;
                                                                                        maximum: number;
                                                                                    };
                                                                                    "if_pos(2)": {
                                                                                        $schema: string;
                                                                                        title: string;
                                                                                        type: string;
                                                                                        minimum: number;
                                                                                        maximum: number;
                                                                                    };
                                                                                    "if_pos(3)": {
                                                                                        $schema: string;
                                                                                        title: string;
                                                                                        type: string;
                                                                                        minimum: number;
                                                                                        maximum: number;
                                                                                    };
                                                                                };
                                                                            };
                                                                        };
                                                                    };
                                                                    contextProviderName: {
                                                                        type: string;
                                                                        const: string;
                                                                        description: string;
                                                                    };
                                                                    CHARGE?: undefined;
                                                                    MULT?: undefined;
                                                                    BASIS?: undefined;
                                                                    FUNCTIONAL?: undefined;
                                                                    CARTESIAN?: undefined;
                                                                    POSCAR?: undefined;
                                                                    POSCAR_WITH_CONSTRAINTS?: undefined;
                                                                };
                                                            } | {
                                                                $schema: string;
                                                                title: string;
                                                                description: string;
                                                                type: string;
                                                                required: string[];
                                                                properties: {
                                                                    IBRAV: {
                                                                        type: string;
                                                                    };
                                                                    RESTART_MODE: {
                                                                        type: string;
                                                                        enum: string[];
                                                                        default: string;
                                                                    };
                                                                    ATOMIC_SPECIES: {
                                                                        type: string;
                                                                        items: {
                                                                            type: string;
                                                                            required: string[];
                                                                            additionalProperties: boolean;
                                                                            properties: {
                                                                                X: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                Mass_X: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                PseudoPot_X: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                            };
                                                                        };
                                                                        description?: undefined;
                                                                    };
                                                                    ATOMIC_SPECIES_WITH_LABELS: {
                                                                        type: string;
                                                                        items: {
                                                                            type: string;
                                                                            required: string[];
                                                                            additionalProperties: boolean;
                                                                            properties: {
                                                                                X: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                Mass_X: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                PseudoPot_X: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                            };
                                                                        };
                                                                    };
                                                                    NAT: {
                                                                        type: string;
                                                                        description: string;
                                                                    };
                                                                    NTYP: {
                                                                        type: string;
                                                                        description: string;
                                                                    };
                                                                    NTYP_WITH_LABELS: {
                                                                        type: string;
                                                                        description: string;
                                                                        minimum: number;
                                                                    };
                                                                    ATOMIC_POSITIONS: {
                                                                        type: string;
                                                                        items: {
                                                                            type: string;
                                                                            required: string[];
                                                                            additionalProperties: boolean;
                                                                            properties: {
                                                                                X: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                x: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                y: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                z: {
                                                                                    type: string;
                                                                                    description: string;
                                                                                };
                                                                                "if_pos(1)": {
                                                                                    $schema: string;
                                                                                    title: string;
                                                                                    type: string;
                                                                                    minimum: number;
                                                                                    maximum: number;
                                                                                };
                                                                                "if_pos(2)": {
                                                                                    $schema: string;
                                                                                    title: string;
                                                                                    type: string;
                                                                                    minimum: number;
                                                                                    maximum: number;
                                                                                };
                                                                                "if_pos(3)": {
                                                                                    $schema: string;
                                                                                    title: string;
                                                                                    type: string;
                                                                                    minimum: number;
                                                                                    maximum: number;
                                                                                };
                                                                            };
                                                                        };
                                                                        description?: undefined;
                                                                    };
                                                                    ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS: {
                                                                        type: string;
                                                                        description: string;
                                                                    };
                                                                    CELL_PARAMETERS: {
                                                                        type: string;
                                                                        additionalProperties: boolean;
                                                                        properties: {
                                                                            v1: {
                                                                                $schema: string;
                                                                                title: string;
                                                                                type: string;
                                                                                minItems: number;
                                                                                maxItems: number;
                                                                                items: {
                                                                                    type: string;
                                                                                };
                                                                            };
                                                                            v2: {
                                                                                $schema: string;
                                                                                title: string;
                                                                                type: string;
                                                                                minItems: number;
                                                                                maxItems: number;
                                                                                items: {
                                                                                    type: string;
                                                                                };
                                                                            };
                                                                            v3: {
                                                                                $schema: string;
                                                                                title: string;
                                                                                type: string;
                                                                                minItems: number;
                                                                                maxItems: number;
                                                                                items: {
                                                                                    type: string;
                                                                                };
                                                                            };
                                                                        };
                                                                    };
                                                                    contextProviderName: {
                                                                        type: string;
                                                                        const: string;
                                                                        description: string;
                                                                    };
                                                                    CHARGE?: undefined;
                                                                    MULT?: undefined;
                                                                    BASIS?: undefined;
                                                                    FUNCTIONAL?: undefined;
                                                                    CARTESIAN?: undefined;
                                                                    FIRST_IMAGE?: undefined;
                                                                    LAST_IMAGE?: undefined;
                                                                    INTERMEDIATE_IMAGES?: undefined;
                                                                    POSCAR?: undefined;
                                                                    POSCAR_WITH_CONSTRAINTS?: undefined;
                                                                };
                                                            } | {
                                                                $schema: string;
                                                                title: string;
                                                                description: string;
                                                                type: string;
                                                                properties: {
                                                                    POSCAR: {
                                                                        type: string;
                                                                        description: string;
                                                                    };
                                                                    POSCAR_WITH_CONSTRAINTS: {
                                                                        type: string;
                                                                        description: string;
                                                                    };
                                                                    contextProviderName: {
                                                                        type: string;
                                                                        const: string;
                                                                        description: string;
                                                                    };
                                                                    CHARGE?: undefined;
                                                                    MULT?: undefined;
                                                                    BASIS?: undefined;
                                                                    NAT?: undefined;
                                                                    NTYP?: undefined;
                                                                    ATOMIC_POSITIONS?: undefined;
                                                                    ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS?: undefined;
                                                                    ATOMIC_SPECIES?: undefined;
                                                                    FUNCTIONAL?: undefined;
                                                                    CARTESIAN?: undefined;
                                                                    IBRAV?: undefined;
                                                                    RESTART_MODE?: undefined;
                                                                    ATOMIC_SPECIES_WITH_LABELS?: undefined;
                                                                    NTYP_WITH_LABELS?: undefined;
                                                                    CELL_PARAMETERS?: undefined;
                                                                    FIRST_IMAGE?: undefined;
                                                                    LAST_IMAGE?: undefined;
                                                                    INTERMEDIATE_IMAGES?: undefined;
                                                                };
                                                                required: string[];
                                                            } | {
                                                                $schema: string;
                                                                title: string;
                                                                description: string;
                                                                type: string;
                                                                properties: {
                                                                    FIRST_IMAGE: {
                                                                        type: string;
                                                                        description: string;
                                                                        items?: undefined;
                                                                    };
                                                                    LAST_IMAGE: {
                                                                        type: string;
                                                                        description: string;
                                                                        items?: undefined;
                                                                    };
                                                                    INTERMEDIATE_IMAGES: {
                                                                        type: string;
                                                                        description: string;
                                                                        items: {
                                                                            type: string;
                                                                            items?: undefined;
                                                                        };
                                                                    };
                                                                    contextProviderName: {
                                                                        type: string;
                                                                        const: string;
                                                                        description: string;
                                                                    };
                                                                    CHARGE?: undefined;
                                                                    MULT?: undefined;
                                                                    BASIS?: undefined;
                                                                    NAT?: undefined;
                                                                    NTYP?: undefined;
                                                                    ATOMIC_POSITIONS?: undefined;
                                                                    ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS?: undefined;
                                                                    ATOMIC_SPECIES?: undefined;
                                                                    FUNCTIONAL?: undefined;
                                                                    CARTESIAN?: undefined;
                                                                    IBRAV?: undefined;
                                                                    RESTART_MODE?: undefined;
                                                                    ATOMIC_SPECIES_WITH_LABELS?: undefined;
                                                                    NTYP_WITH_LABELS?: undefined;
                                                                    CELL_PARAMETERS?: undefined;
                                                                    POSCAR?: undefined;
                                                                    POSCAR_WITH_CONSTRAINTS?: undefined;
                                                                };
                                                                required: string[];
                                                            })[];
                                                            discriminator: {
                                                                propertyName: string;
                                                            };
                                                            $schema?: undefined;
                                                            title?: undefined;
                                                            description?: undefined;
                                                            type?: undefined;
                                                            properties?: undefined;
                                                            required?: undefined;
                                                            minItems?: undefined;
                                                            items?: undefined;
                                                            uniqueItems?: undefined;
                                                        };
                                                        extraData: {
                                                            $schema: string;
                                                            title: string;
                                                            type: string;
                                                            required: string[];
                                                            properties: {
                                                                materialHash: {
                                                                    type: string;
                                                                };
                                                            };
                                                        };
                                                        isEdited: {
                                                            type: string;
                                                        };
                                                    };
                                                } | {
                                                    $schema: string;
                                                    title: string;
                                                    type: string;
                                                    required: string[];
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                            const: string;
                                                            enum?: undefined;
                                                        };
                                                        data: {
                                                            $schema: string;
                                                            title: string;
                                                            description: string;
                                                            type: string;
                                                            properties: {
                                                                wavefunction: {
                                                                    type: string;
                                                                };
                                                                density: {
                                                                    type: string;
                                                                };
                                                                dimensions?: undefined;
                                                                shifts?: undefined;
                                                                reciprocalVectorRatios?: undefined;
                                                                gridMetricType?: undefined;
                                                                gridMetricValue?: undefined;
                                                                preferGridMetric?: undefined;
                                                                nImages?: undefined;
                                                                type?: undefined;
                                                                offset?: undefined;
                                                                electricField?: undefined;
                                                                targetFermiEnergy?: undefined;
                                                                target_column_name?: undefined;
                                                                problem_category?: undefined;
                                                                fraction_held_as_test_set?: undefined;
                                                                numberOfSteps?: undefined;
                                                                timeStep?: undefined;
                                                                electronMass?: undefined;
                                                                temperature?: undefined;
                                                                startingMagnetization?: undefined;
                                                                isTotalMagnetization?: undefined;
                                                                totalMagnetization?: undefined;
                                                                isExistingChargeDensity?: undefined;
                                                                isStartingMagnetization?: undefined;
                                                                isArbitrarySpinAngle?: undefined;
                                                                isArbitrarySpinDirection?: undefined;
                                                                lforcet?: undefined;
                                                                spinAngles?: undefined;
                                                                isConstrainedMagnetization?: undefined;
                                                                constrainedMagnetization?: undefined;
                                                                isFixedMagnetization?: undefined;
                                                                fixedMagnetization?: undefined;
                                                            };
                                                            oneOf?: undefined;
                                                            discriminator?: undefined;
                                                            required?: undefined;
                                                            minItems?: undefined;
                                                            items?: undefined;
                                                            uniqueItems?: undefined;
                                                        };
                                                        isEdited: {
                                                            type: string;
                                                        };
                                                        extraData: {
                                                            type: string;
                                                            $schema?: undefined;
                                                            title?: undefined;
                                                            required?: undefined;
                                                            properties?: undefined;
                                                        };
                                                    };
                                                } | {
                                                    $schema: string;
                                                    title: string;
                                                    type: string;
                                                    required: string[];
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                            enum: string[];
                                                            const?: undefined;
                                                        };
                                                        data: {
                                                            $schema: string;
                                                            title: string;
                                                            description: string;
                                                            type: string;
                                                            required: string[];
                                                            properties: {
                                                                dimensions: {
                                                                    oneOf: {
                                                                        type: string;
                                                                        items: {
                                                                            type: string;
                                                                        };
                                                                        minItems: number;
                                                                        maxItems: number;
                                                                    }[];
                                                                };
                                                                shifts: {
                                                                    type: string;
                                                                    minItems: number;
                                                                    maxItems: number;
                                                                    items: {
                                                                        type: string;
                                                                    };
                                                                };
                                                                reciprocalVectorRatios: {
                                                                    type: string;
                                                                    minItems: number;
                                                                    maxItems: number;
                                                                    items: {
                                                                        type: string;
                                                                    };
                                                                };
                                                                gridMetricType: {
                                                                    type: string;
                                                                    enum: string[];
                                                                };
                                                                gridMetricValue: {
                                                                    type: string;
                                                                };
                                                                preferGridMetric: {
                                                                    type: string;
                                                                };
                                                                wavefunction?: undefined;
                                                                density?: undefined;
                                                                nImages?: undefined;
                                                                type?: undefined;
                                                                offset?: undefined;
                                                                electricField?: undefined;
                                                                targetFermiEnergy?: undefined;
                                                                target_column_name?: undefined;
                                                                problem_category?: undefined;
                                                                fraction_held_as_test_set?: undefined;
                                                                numberOfSteps?: undefined;
                                                                timeStep?: undefined;
                                                                electronMass?: undefined;
                                                                temperature?: undefined;
                                                                startingMagnetization?: undefined;
                                                                isTotalMagnetization?: undefined;
                                                                totalMagnetization?: undefined;
                                                                isExistingChargeDensity?: undefined;
                                                                isStartingMagnetization?: undefined;
                                                                isArbitrarySpinAngle?: undefined;
                                                                isArbitrarySpinDirection?: undefined;
                                                                lforcet?: undefined;
                                                                spinAngles?: undefined;
                                                                isConstrainedMagnetization?: undefined;
                                                                constrainedMagnetization?: undefined;
                                                                isFixedMagnetization?: undefined;
                                                                fixedMagnetization?: undefined;
                                                            };
                                                            oneOf?: undefined;
                                                            discriminator?: undefined;
                                                            minItems?: undefined;
                                                            items?: undefined;
                                                            uniqueItems?: undefined;
                                                        };
                                                        extraData: {
                                                            $schema: string;
                                                            title: string;
                                                            type: string;
                                                            required: string[];
                                                            properties: {
                                                                materialHash: {
                                                                    type: string;
                                                                };
                                                            };
                                                        };
                                                        isEdited: {
                                                            type: string;
                                                        };
                                                    };
                                                } | {
                                                    $schema: string;
                                                    title: string;
                                                    type: string;
                                                    required: string[];
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                            enum: string[];
                                                            const?: undefined;
                                                        };
                                                        data: {
                                                            $schema: string;
                                                            title: string;
                                                            description: string;
                                                            type: string;
                                                            minItems: number;
                                                            items: {
                                                                type: string;
                                                                required: string[];
                                                                properties: {
                                                                    point: {
                                                                        type: string;
                                                                    };
                                                                    steps: {
                                                                        type: string;
                                                                    };
                                                                    coordinates: {
                                                                        type: string;
                                                                        items: {
                                                                            type: string;
                                                                        };
                                                                    };
                                                                    paramType?: undefined;
                                                                    atomicSpecies?: undefined;
                                                                    atomicOrbital?: undefined;
                                                                    value?: undefined;
                                                                    hubbardUValue?: undefined;
                                                                    siteIndex?: undefined;
                                                                    atomicSpecies2?: undefined;
                                                                    siteIndex2?: undefined;
                                                                    atomicOrbital2?: undefined;
                                                                    hubbardVValue?: undefined;
                                                                    atomicSpeciesIndex?: undefined;
                                                                };
                                                            };
                                                            oneOf?: undefined;
                                                            discriminator?: undefined;
                                                            properties?: undefined;
                                                            required?: undefined;
                                                            uniqueItems?: undefined;
                                                        };
                                                        extraData: {
                                                            $schema: string;
                                                            title: string;
                                                            type: string;
                                                            required: string[];
                                                            properties: {
                                                                materialHash: {
                                                                    type: string;
                                                                };
                                                            };
                                                        };
                                                        isEdited: {
                                                            type: string;
                                                        };
                                                    };
                                                } | {
                                                    $schema: string;
                                                    title: string;
                                                    type: string;
                                                    required: string[];
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                            const: string;
                                                            enum?: undefined;
                                                        };
                                                        data: {
                                                            $schema: string;
                                                            title: string;
                                                            description: string;
                                                            type: string;
                                                            minItems: number;
                                                            items: {
                                                                type: string;
                                                                properties: {
                                                                    paramType: {
                                                                        type: string;
                                                                        title: string;
                                                                        enum: string[];
                                                                    };
                                                                    atomicSpecies: {
                                                                        type: string;
                                                                        title: string;
                                                                    };
                                                                    atomicOrbital: {
                                                                        type: string;
                                                                        title: string;
                                                                    };
                                                                    value: {
                                                                        type: string;
                                                                        title: string;
                                                                    };
                                                                    point?: undefined;
                                                                    steps?: undefined;
                                                                    coordinates?: undefined;
                                                                    hubbardUValue?: undefined;
                                                                    siteIndex?: undefined;
                                                                    atomicSpecies2?: undefined;
                                                                    siteIndex2?: undefined;
                                                                    atomicOrbital2?: undefined;
                                                                    hubbardVValue?: undefined;
                                                                    atomicSpeciesIndex?: undefined;
                                                                };
                                                                required?: undefined;
                                                            };
                                                            oneOf?: undefined;
                                                            discriminator?: undefined;
                                                            properties?: undefined;
                                                            required?: undefined;
                                                            uniqueItems?: undefined;
                                                        };
                                                        isEdited: {
                                                            type: string;
                                                        };
                                                        extraData: {
                                                            type: string;
                                                            $schema?: undefined;
                                                            title?: undefined;
                                                            required?: undefined;
                                                            properties?: undefined;
                                                        };
                                                    };
                                                } | {
                                                    $schema: string;
                                                    title: string;
                                                    type: string;
                                                    required: string[];
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                            const: string;
                                                            enum?: undefined;
                                                        };
                                                        data: {
                                                            $schema: string;
                                                            title: string;
                                                            description: string;
                                                            type: string;
                                                            items: {
                                                                type: string;
                                                                properties: {
                                                                    atomicSpecies: {
                                                                        type: string;
                                                                        title: string;
                                                                    };
                                                                    atomicOrbital: {
                                                                        type: string;
                                                                        title: string;
                                                                    };
                                                                    hubbardUValue: {
                                                                        type: string;
                                                                        title: string;
                                                                    };
                                                                    point?: undefined;
                                                                    steps?: undefined;
                                                                    coordinates?: undefined;
                                                                    paramType?: undefined;
                                                                    value?: undefined;
                                                                    siteIndex?: undefined;
                                                                    atomicSpecies2?: undefined;
                                                                    siteIndex2?: undefined;
                                                                    atomicOrbital2?: undefined;
                                                                    hubbardVValue?: undefined;
                                                                    atomicSpeciesIndex?: undefined;
                                                                };
                                                                required?: undefined;
                                                            };
                                                            oneOf?: undefined;
                                                            discriminator?: undefined;
                                                            properties?: undefined;
                                                            required?: undefined;
                                                            minItems?: undefined;
                                                            uniqueItems?: undefined;
                                                        };
                                                        extraData: {
                                                            $schema: string;
                                                            title: string;
                                                            type: string;
                                                            required: string[];
                                                            properties: {
                                                                materialHash: {
                                                                    type: string;
                                                                };
                                                            };
                                                        };
                                                        isEdited: {
                                                            type: string;
                                                        };
                                                    };
                                                } | {
                                                    $schema: string;
                                                    title: string;
                                                    type: string;
                                                    required: string[];
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                            const: string;
                                                            enum?: undefined;
                                                        };
                                                        data: {
                                                            $schema: string;
                                                            title: string;
                                                            description: string;
                                                            type: string;
                                                            minItems: number;
                                                            items: {
                                                                type: string;
                                                                properties: {
                                                                    atomicSpecies: {
                                                                        type: string;
                                                                        title: string;
                                                                    };
                                                                    siteIndex: {
                                                                        type: string;
                                                                        title: string;
                                                                    };
                                                                    atomicOrbital: {
                                                                        type: string;
                                                                        title: string;
                                                                    };
                                                                    atomicSpecies2: {
                                                                        type: string;
                                                                        title: string;
                                                                    };
                                                                    siteIndex2: {
                                                                        type: string;
                                                                        title: string;
                                                                    };
                                                                    atomicOrbital2: {
                                                                        type: string;
                                                                        title: string;
                                                                    };
                                                                    hubbardVValue: {
                                                                        type: string;
                                                                        title: string;
                                                                    };
                                                                    point?: undefined;
                                                                    steps?: undefined;
                                                                    coordinates?: undefined;
                                                                    paramType?: undefined;
                                                                    value?: undefined;
                                                                    hubbardUValue?: undefined;
                                                                    atomicSpeciesIndex?: undefined;
                                                                };
                                                                required?: undefined;
                                                            };
                                                            oneOf?: undefined;
                                                            discriminator?: undefined;
                                                            properties?: undefined;
                                                            required?: undefined;
                                                            uniqueItems?: undefined;
                                                        };
                                                        isEdited: {
                                                            type: string;
                                                        };
                                                        extraData: {
                                                            type: string;
                                                            $schema?: undefined;
                                                            title?: undefined;
                                                            required?: undefined;
                                                            properties?: undefined;
                                                        };
                                                    };
                                                } | {
                                                    $schema: string;
                                                    title: string;
                                                    type: string;
                                                    required: string[];
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                            const: string;
                                                            enum?: undefined;
                                                        };
                                                        data: {
                                                            $schema: string;
                                                            title: string;
                                                            description: string;
                                                            type: string;
                                                            uniqueItems: boolean;
                                                            minItems: number;
                                                            items: {
                                                                type: string;
                                                                properties: {
                                                                    atomicSpecies: {
                                                                        type: string;
                                                                        title: string;
                                                                    };
                                                                    atomicSpeciesIndex: {
                                                                        type: string;
                                                                        title: string;
                                                                    };
                                                                    hubbardUValue: {
                                                                        type: string;
                                                                        title: string;
                                                                    };
                                                                    point?: undefined;
                                                                    steps?: undefined;
                                                                    coordinates?: undefined;
                                                                    paramType?: undefined;
                                                                    atomicOrbital?: undefined;
                                                                    value?: undefined;
                                                                    siteIndex?: undefined;
                                                                    atomicSpecies2?: undefined;
                                                                    siteIndex2?: undefined;
                                                                    atomicOrbital2?: undefined;
                                                                    hubbardVValue?: undefined;
                                                                };
                                                                required?: undefined;
                                                            };
                                                            oneOf?: undefined;
                                                            discriminator?: undefined;
                                                            properties?: undefined;
                                                            required?: undefined;
                                                        };
                                                        isEdited: {
                                                            type: string;
                                                        };
                                                        extraData: {
                                                            type: string;
                                                            $schema?: undefined;
                                                            title?: undefined;
                                                            required?: undefined;
                                                            properties?: undefined;
                                                        };
                                                    };
                                                } | {
                                                    $schema: string;
                                                    title: string;
                                                    type: string;
                                                    required: string[];
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                            const: string;
                                                            enum?: undefined;
                                                        };
                                                        data: {
                                                            $schema: string;
                                                            title: string;
                                                            description: string;
                                                            type: string;
                                                            properties: {
                                                                nImages: {
                                                                    type: string;
                                                                };
                                                                wavefunction?: undefined;
                                                                density?: undefined;
                                                                dimensions?: undefined;
                                                                shifts?: undefined;
                                                                reciprocalVectorRatios?: undefined;
                                                                gridMetricType?: undefined;
                                                                gridMetricValue?: undefined;
                                                                preferGridMetric?: undefined;
                                                                type?: undefined;
                                                                offset?: undefined;
                                                                electricField?: undefined;
                                                                targetFermiEnergy?: undefined;
                                                                target_column_name?: undefined;
                                                                problem_category?: undefined;
                                                                fraction_held_as_test_set?: undefined;
                                                                numberOfSteps?: undefined;
                                                                timeStep?: undefined;
                                                                electronMass?: undefined;
                                                                temperature?: undefined;
                                                                startingMagnetization?: undefined;
                                                                isTotalMagnetization?: undefined;
                                                                totalMagnetization?: undefined;
                                                                isExistingChargeDensity?: undefined;
                                                                isStartingMagnetization?: undefined;
                                                                isArbitrarySpinAngle?: undefined;
                                                                isArbitrarySpinDirection?: undefined;
                                                                lforcet?: undefined;
                                                                spinAngles?: undefined;
                                                                isConstrainedMagnetization?: undefined;
                                                                constrainedMagnetization?: undefined;
                                                                isFixedMagnetization?: undefined;
                                                                fixedMagnetization?: undefined;
                                                            };
                                                            oneOf?: undefined;
                                                            discriminator?: undefined;
                                                            required?: undefined;
                                                            minItems?: undefined;
                                                            items?: undefined;
                                                            uniqueItems?: undefined;
                                                        };
                                                        isEdited: {
                                                            type: string;
                                                        };
                                                        extraData: {
                                                            type: string;
                                                            $schema?: undefined;
                                                            title?: undefined;
                                                            required?: undefined;
                                                            properties?: undefined;
                                                        };
                                                    };
                                                } | {
                                                    $schema: string;
                                                    title: string;
                                                    type: string;
                                                    required: string[];
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                            const: string;
                                                            enum?: undefined;
                                                        };
                                                        data: {
                                                            $schema: string;
                                                            title: string;
                                                            type: string;
                                                            properties: {
                                                                type: {
                                                                    type: string;
                                                                    enum: string[];
                                                                    default: string;
                                                                    description: string;
                                                                };
                                                                offset: {
                                                                    type: string;
                                                                };
                                                                electricField: {
                                                                    type: string;
                                                                    title: string;
                                                                };
                                                                targetFermiEnergy: {
                                                                    type: string;
                                                                    title: string;
                                                                };
                                                                wavefunction?: undefined;
                                                                density?: undefined;
                                                                dimensions?: undefined;
                                                                shifts?: undefined;
                                                                reciprocalVectorRatios?: undefined;
                                                                gridMetricType?: undefined;
                                                                gridMetricValue?: undefined;
                                                                preferGridMetric?: undefined;
                                                                nImages?: undefined;
                                                                target_column_name?: undefined;
                                                                problem_category?: undefined;
                                                                fraction_held_as_test_set?: undefined;
                                                                numberOfSteps?: undefined;
                                                                timeStep?: undefined;
                                                                electronMass?: undefined;
                                                                temperature?: undefined;
                                                                startingMagnetization?: undefined;
                                                                isTotalMagnetization?: undefined;
                                                                totalMagnetization?: undefined;
                                                                isExistingChargeDensity?: undefined;
                                                                isStartingMagnetization?: undefined;
                                                                isArbitrarySpinAngle?: undefined;
                                                                isArbitrarySpinDirection?: undefined;
                                                                lforcet?: undefined;
                                                                spinAngles?: undefined;
                                                                isConstrainedMagnetization?: undefined;
                                                                constrainedMagnetization?: undefined;
                                                                isFixedMagnetization?: undefined;
                                                                fixedMagnetization?: undefined;
                                                            };
                                                            oneOf?: undefined;
                                                            discriminator?: undefined;
                                                            description?: undefined;
                                                            required?: undefined;
                                                            minItems?: undefined;
                                                            items?: undefined;
                                                            uniqueItems?: undefined;
                                                        };
                                                        extraData: {
                                                            $schema: string;
                                                            title: string;
                                                            type: string;
                                                            required: string[];
                                                            properties: {
                                                                materialHash: {
                                                                    type: string;
                                                                };
                                                            };
                                                        };
                                                        isEdited: {
                                                            type: string;
                                                        };
                                                    };
                                                } | {
                                                    $schema: string;
                                                    title: string;
                                                    type: string;
                                                    required: string[];
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                            const: string;
                                                            enum?: undefined;
                                                        };
                                                        data: {
                                                            $schema: string;
                                                            title: string;
                                                            description: string;
                                                            type: string;
                                                            properties: {
                                                                target_column_name: {
                                                                    type: string;
                                                                };
                                                                problem_category: {
                                                                    type: string;
                                                                    enum: string[];
                                                                };
                                                                wavefunction?: undefined;
                                                                density?: undefined;
                                                                dimensions?: undefined;
                                                                shifts?: undefined;
                                                                reciprocalVectorRatios?: undefined;
                                                                gridMetricType?: undefined;
                                                                gridMetricValue?: undefined;
                                                                preferGridMetric?: undefined;
                                                                nImages?: undefined;
                                                                type?: undefined;
                                                                offset?: undefined;
                                                                electricField?: undefined;
                                                                targetFermiEnergy?: undefined;
                                                                fraction_held_as_test_set?: undefined;
                                                                numberOfSteps?: undefined;
                                                                timeStep?: undefined;
                                                                electronMass?: undefined;
                                                                temperature?: undefined;
                                                                startingMagnetization?: undefined;
                                                                isTotalMagnetization?: undefined;
                                                                totalMagnetization?: undefined;
                                                                isExistingChargeDensity?: undefined;
                                                                isStartingMagnetization?: undefined;
                                                                isArbitrarySpinAngle?: undefined;
                                                                isArbitrarySpinDirection?: undefined;
                                                                lforcet?: undefined;
                                                                spinAngles?: undefined;
                                                                isConstrainedMagnetization?: undefined;
                                                                constrainedMagnetization?: undefined;
                                                                isFixedMagnetization?: undefined;
                                                                fixedMagnetization?: undefined;
                                                            };
                                                            oneOf?: undefined;
                                                            discriminator?: undefined;
                                                            required?: undefined;
                                                            minItems?: undefined;
                                                            items?: undefined;
                                                            uniqueItems?: undefined;
                                                        };
                                                        isEdited: {
                                                            type: string;
                                                        };
                                                        extraData: {
                                                            type: string;
                                                            $schema?: undefined;
                                                            title?: undefined;
                                                            required?: undefined;
                                                            properties?: undefined;
                                                        };
                                                    };
                                                } | {
                                                    $schema: string;
                                                    title: string;
                                                    type: string;
                                                    required: string[];
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                            const: string;
                                                            enum?: undefined;
                                                        };
                                                        data: {
                                                            $schema: string;
                                                            title: string;
                                                            description: string;
                                                            type: string;
                                                            properties: {
                                                                fraction_held_as_test_set: {
                                                                    type: string;
                                                                    minimum: number;
                                                                    maximum: number;
                                                                };
                                                                wavefunction?: undefined;
                                                                density?: undefined;
                                                                dimensions?: undefined;
                                                                shifts?: undefined;
                                                                reciprocalVectorRatios?: undefined;
                                                                gridMetricType?: undefined;
                                                                gridMetricValue?: undefined;
                                                                preferGridMetric?: undefined;
                                                                nImages?: undefined;
                                                                type?: undefined;
                                                                offset?: undefined;
                                                                electricField?: undefined;
                                                                targetFermiEnergy?: undefined;
                                                                target_column_name?: undefined;
                                                                problem_category?: undefined;
                                                                numberOfSteps?: undefined;
                                                                timeStep?: undefined;
                                                                electronMass?: undefined;
                                                                temperature?: undefined;
                                                                startingMagnetization?: undefined;
                                                                isTotalMagnetization?: undefined;
                                                                totalMagnetization?: undefined;
                                                                isExistingChargeDensity?: undefined;
                                                                isStartingMagnetization?: undefined;
                                                                isArbitrarySpinAngle?: undefined;
                                                                isArbitrarySpinDirection?: undefined;
                                                                lforcet?: undefined;
                                                                spinAngles?: undefined;
                                                                isConstrainedMagnetization?: undefined;
                                                                constrainedMagnetization?: undefined;
                                                                isFixedMagnetization?: undefined;
                                                                fixedMagnetization?: undefined;
                                                            };
                                                            oneOf?: undefined;
                                                            discriminator?: undefined;
                                                            required?: undefined;
                                                            minItems?: undefined;
                                                            items?: undefined;
                                                            uniqueItems?: undefined;
                                                        };
                                                        isEdited: {
                                                            type: string;
                                                        };
                                                        extraData: {
                                                            type: string;
                                                            $schema?: undefined;
                                                            title?: undefined;
                                                            required?: undefined;
                                                            properties?: undefined;
                                                        };
                                                    };
                                                } | {
                                                    $schema: string;
                                                    title: string;
                                                    type: string;
                                                    required: string[];
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                            const: string;
                                                            enum?: undefined;
                                                        };
                                                        data: {
                                                            $schema: string;
                                                            title: string;
                                                            description: string;
                                                            type: string;
                                                            properties: {
                                                                numberOfSteps: {
                                                                    type: string;
                                                                    title: string;
                                                                };
                                                                timeStep: {
                                                                    type: string;
                                                                    title: string;
                                                                };
                                                                electronMass: {
                                                                    type: string;
                                                                    title: string;
                                                                };
                                                                temperature: {
                                                                    type: string;
                                                                    title: string;
                                                                };
                                                                wavefunction?: undefined;
                                                                density?: undefined;
                                                                dimensions?: undefined;
                                                                shifts?: undefined;
                                                                reciprocalVectorRatios?: undefined;
                                                                gridMetricType?: undefined;
                                                                gridMetricValue?: undefined;
                                                                preferGridMetric?: undefined;
                                                                nImages?: undefined;
                                                                type?: undefined;
                                                                offset?: undefined;
                                                                electricField?: undefined;
                                                                targetFermiEnergy?: undefined;
                                                                target_column_name?: undefined;
                                                                problem_category?: undefined;
                                                                fraction_held_as_test_set?: undefined;
                                                                startingMagnetization?: undefined;
                                                                isTotalMagnetization?: undefined;
                                                                totalMagnetization?: undefined;
                                                                isExistingChargeDensity?: undefined;
                                                                isStartingMagnetization?: undefined;
                                                                isArbitrarySpinAngle?: undefined;
                                                                isArbitrarySpinDirection?: undefined;
                                                                lforcet?: undefined;
                                                                spinAngles?: undefined;
                                                                isConstrainedMagnetization?: undefined;
                                                                constrainedMagnetization?: undefined;
                                                                isFixedMagnetization?: undefined;
                                                                fixedMagnetization?: undefined;
                                                            };
                                                            oneOf?: undefined;
                                                            discriminator?: undefined;
                                                            required?: undefined;
                                                            minItems?: undefined;
                                                            items?: undefined;
                                                            uniqueItems?: undefined;
                                                        };
                                                        isEdited: {
                                                            type: string;
                                                        };
                                                        extraData: {
                                                            type: string;
                                                            $schema?: undefined;
                                                            title?: undefined;
                                                            required?: undefined;
                                                            properties?: undefined;
                                                        };
                                                    };
                                                } | {
                                                    $schema: string;
                                                    title: string;
                                                    type: string;
                                                    required: string[];
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                            const: string;
                                                            enum?: undefined;
                                                        };
                                                        data: {
                                                            $schema: string;
                                                            title: string;
                                                            description: string;
                                                            type: string;
                                                            required: string[];
                                                            properties: {
                                                                startingMagnetization: {
                                                                    type: string;
                                                                    items: {
                                                                        type: string;
                                                                        required: string[];
                                                                        properties: {
                                                                            atomicSpecies: {
                                                                                type: string;
                                                                                title: string;
                                                                            };
                                                                            value: {
                                                                                type: string;
                                                                                title: string;
                                                                                minimum: number;
                                                                                maximum: number;
                                                                            };
                                                                            index: {
                                                                                type: string;
                                                                                title: string;
                                                                            };
                                                                        };
                                                                    };
                                                                };
                                                                isTotalMagnetization: {
                                                                    type: string;
                                                                    title: string;
                                                                };
                                                                totalMagnetization: {
                                                                    type: string;
                                                                    title: string;
                                                                };
                                                                wavefunction?: undefined;
                                                                density?: undefined;
                                                                dimensions?: undefined;
                                                                shifts?: undefined;
                                                                reciprocalVectorRatios?: undefined;
                                                                gridMetricType?: undefined;
                                                                gridMetricValue?: undefined;
                                                                preferGridMetric?: undefined;
                                                                nImages?: undefined;
                                                                type?: undefined;
                                                                offset?: undefined;
                                                                electricField?: undefined;
                                                                targetFermiEnergy?: undefined;
                                                                target_column_name?: undefined;
                                                                problem_category?: undefined;
                                                                fraction_held_as_test_set?: undefined;
                                                                numberOfSteps?: undefined;
                                                                timeStep?: undefined;
                                                                electronMass?: undefined;
                                                                temperature?: undefined;
                                                                isExistingChargeDensity?: undefined;
                                                                isStartingMagnetization?: undefined;
                                                                isArbitrarySpinAngle?: undefined;
                                                                isArbitrarySpinDirection?: undefined;
                                                                lforcet?: undefined;
                                                                spinAngles?: undefined;
                                                                isConstrainedMagnetization?: undefined;
                                                                constrainedMagnetization?: undefined;
                                                                isFixedMagnetization?: undefined;
                                                                fixedMagnetization?: undefined;
                                                            };
                                                            oneOf?: undefined;
                                                            discriminator?: undefined;
                                                            minItems?: undefined;
                                                            items?: undefined;
                                                            uniqueItems?: undefined;
                                                        };
                                                        extraData: {
                                                            $schema: string;
                                                            title: string;
                                                            type: string;
                                                            required: string[];
                                                            properties: {
                                                                materialHash: {
                                                                    type: string;
                                                                };
                                                            };
                                                        };
                                                        isEdited: {
                                                            type: string;
                                                        };
                                                    };
                                                } | {
                                                    $schema: string;
                                                    title: string;
                                                    type: string;
                                                    required: string[];
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                            const: string;
                                                            enum?: undefined;
                                                        };
                                                        data: {
                                                            $schema: string;
                                                            title: string;
                                                            description: string;
                                                            type: string;
                                                            properties: {
                                                                isExistingChargeDensity: {
                                                                    type: string;
                                                                    title: string;
                                                                };
                                                                isStartingMagnetization: {
                                                                    type: string;
                                                                    title: string;
                                                                };
                                                                startingMagnetization: {
                                                                    type: string;
                                                                    items: {
                                                                        type: string;
                                                                        properties: {
                                                                            index: {
                                                                                type: string;
                                                                                title: string;
                                                                            };
                                                                            atomicSpecies: {
                                                                                type: string;
                                                                                title: string;
                                                                            };
                                                                            value: {
                                                                                type: string;
                                                                                title: string;
                                                                                minimum?: undefined;
                                                                                maximum?: undefined;
                                                                            };
                                                                        };
                                                                        required?: undefined;
                                                                    };
                                                                };
                                                                isArbitrarySpinAngle: {
                                                                    type: string;
                                                                    title: string;
                                                                };
                                                                isArbitrarySpinDirection: {
                                                                    type: string;
                                                                    title: string;
                                                                };
                                                                lforcet: {
                                                                    type: string;
                                                                };
                                                                spinAngles: {
                                                                    type: string;
                                                                    items: {
                                                                        type: string;
                                                                        properties: {
                                                                            index: {
                                                                                type: string;
                                                                                title: string;
                                                                            };
                                                                            atomicSpecies: {
                                                                                type: string;
                                                                                title: string;
                                                                            };
                                                                            angle1: {
                                                                                type: string;
                                                                                title: string;
                                                                            };
                                                                            angle2: {
                                                                                type: string;
                                                                                title: string;
                                                                            };
                                                                        };
                                                                    };
                                                                };
                                                                isConstrainedMagnetization: {
                                                                    type: string;
                                                                    title: string;
                                                                };
                                                                constrainedMagnetization: {
                                                                    type: string;
                                                                    properties: {
                                                                        constrainType: {
                                                                            type: string;
                                                                            title: string;
                                                                            enum: string[];
                                                                        };
                                                                        lambda: {
                                                                            type: string;
                                                                            title: string;
                                                                        };
                                                                    };
                                                                };
                                                                isFixedMagnetization: {
                                                                    type: string;
                                                                    title: string;
                                                                };
                                                                fixedMagnetization: {
                                                                    type: string;
                                                                    properties: {
                                                                        x: {
                                                                            type: string;
                                                                            title: string;
                                                                        };
                                                                        y: {
                                                                            type: string;
                                                                            title: string;
                                                                        };
                                                                        z: {
                                                                            type: string;
                                                                            title: string;
                                                                        };
                                                                    };
                                                                };
                                                                wavefunction?: undefined;
                                                                density?: undefined;
                                                                dimensions?: undefined;
                                                                shifts?: undefined;
                                                                reciprocalVectorRatios?: undefined;
                                                                gridMetricType?: undefined;
                                                                gridMetricValue?: undefined;
                                                                preferGridMetric?: undefined;
                                                                nImages?: undefined;
                                                                type?: undefined;
                                                                offset?: undefined;
                                                                electricField?: undefined;
                                                                targetFermiEnergy?: undefined;
                                                                target_column_name?: undefined;
                                                                problem_category?: undefined;
                                                                fraction_held_as_test_set?: undefined;
                                                                numberOfSteps?: undefined;
                                                                timeStep?: undefined;
                                                                electronMass?: undefined;
                                                                temperature?: undefined;
                                                                isTotalMagnetization?: undefined;
                                                                totalMagnetization?: undefined;
                                                            };
                                                            oneOf?: undefined;
                                                            discriminator?: undefined;
                                                            required?: undefined;
                                                            minItems?: undefined;
                                                            items?: undefined;
                                                            uniqueItems?: undefined;
                                                        };
                                                        extraData: {
                                                            $schema: string;
                                                            title: string;
                                                            type: string;
                                                            required: string[];
                                                            properties: {
                                                                materialHash: {
                                                                    type: string;
                                                                };
                                                            };
                                                        };
                                                        isEdited: {
                                                            type: string;
                                                        };
                                                    };
                                                })[];
                                            };
                                        };
                                        subtype?: undefined;
                                        source?: undefined;
                                        statement?: undefined;
                                        then?: undefined;
                                        else?: undefined;
                                        maxOccurrences?: undefined;
                                        throwException?: undefined;
                                        errorMessage?: undefined;
                                        scope?: undefined;
                                        operand?: undefined;
                                        value?: undefined;
                                    };
                                } | {
                                    $schema: string;
                                    title: string;
                                    type: string;
                                    required: string[];
                                    properties: {
                                        _id: {
                                            description: string;
                                            type: string;
                                        };
                                        slug: {
                                            description: string;
                                            type: string;
                                        };
                                        systemName: {
                                            type: string;
                                        };
                                        schemaVersion: {
                                            description: string;
                                            type: string;
                                            default: string;
                                        };
                                        name: {
                                            description: string;
                                            type: string;
                                        };
                                        isDefault: {
                                            description: string;
                                            type: string;
                                            default: boolean;
                                        };
                                        preProcessors: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        postProcessors: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        monitors: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        results: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        tags: {
                                            description: string;
                                            type: string;
                                            items: {
                                                type: string;
                                            };
                                        };
                                        status: {
                                            type: string;
                                            description: string;
                                            enum: string[];
                                        };
                                        statusTrack: {
                                            type: string;
                                            items: {
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    trackedAt: {
                                                        type: string;
                                                    };
                                                    status: {
                                                        type: string;
                                                    };
                                                    repetition: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                        isDraft: {
                                            type: string;
                                        };
                                        type: {
                                            description: string;
                                            type: string;
                                            const: string;
                                        };
                                        head: {
                                            description: string;
                                            type: string;
                                        };
                                        flowchartId: {
                                            description: string;
                                            type: string;
                                        };
                                        next: {
                                            description: string;
                                            type: string;
                                        };
                                        enableRender: {
                                            description: string;
                                            type: string;
                                        };
                                        scope: {
                                            type: string;
                                        };
                                        input: {
                                            description: string;
                                            type: string;
                                            items: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    scope: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                    name: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                    template?: undefined;
                                                    rendered?: undefined;
                                                    isManuallyChanged?: undefined;
                                                };
                                                oneOf?: undefined;
                                                discriminator?: undefined;
                                            };
                                        };
                                        operand: {
                                            description: string;
                                            type: string;
                                        };
                                        value: {
                                            description: string;
                                            oneOf: {
                                                type: string;
                                            }[];
                                        };
                                        subtype?: undefined;
                                        source?: undefined;
                                        statement?: undefined;
                                        then?: undefined;
                                        else?: undefined;
                                        maxOccurrences?: undefined;
                                        throwException?: undefined;
                                        errorMessage?: undefined;
                                        application?: undefined;
                                        executable?: undefined;
                                        flavor?: undefined;
                                        context?: undefined;
                                    };
                                })[];
                                discriminator: {
                                    propertyName: string;
                                };
                                required: string[];
                            };
                        };
                        model: {
                            $schema: string;
                            title: string;
                            type: string;
                            oneOf: ({
                                $schema: string;
                                title: string;
                                type: string;
                                definitions: {
                                    lda: {
                                        required: string[];
                                        properties: {
                                            type: {
                                                const: string;
                                            };
                                            subtype: {
                                                const: string;
                                            };
                                            functional: {
                                                enum: string[];
                                            };
                                            method: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    type: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                    subtype: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                    precision: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                    data: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                    gga: {
                                        required: string[];
                                        properties: {
                                            type: {
                                                const: string;
                                            };
                                            subtype: {
                                                const: string;
                                            };
                                            functional: {
                                                enum: string[];
                                            };
                                            method: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    type: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                    subtype: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                    precision: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                    data: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                    hybrid: {
                                        required: string[];
                                        properties: {
                                            type: {
                                                const: string;
                                            };
                                            subtype: {
                                                const: string;
                                            };
                                            functional: {
                                                enum: string[];
                                            };
                                            method: {
                                                $schema: string;
                                                title: string;
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    type: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                    subtype: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                    precision: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                    data: {
                                                        description: string;
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                                oneOf: {
                                    properties: {
                                        type: {
                                            const: string;
                                        };
                                        subtype: {
                                            const: string;
                                        };
                                        functional: {
                                            enum: string[];
                                        };
                                        method: {
                                            $schema: string;
                                            title: string;
                                            type: string;
                                            required: string[];
                                            properties: {
                                                type: {
                                                    description: string;
                                                    type: string;
                                                };
                                                subtype: {
                                                    description: string;
                                                    type: string;
                                                };
                                                precision: {
                                                    description: string;
                                                    type: string;
                                                };
                                                data: {
                                                    description: string;
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                    required: string[];
                                }[];
                                discriminator: {
                                    propertyName: string;
                                };
                                required: string[];
                                properties: {
                                    type: {
                                        const: string;
                                        enum?: undefined;
                                    };
                                    subtype?: undefined;
                                    method?: undefined;
                                };
                            } | {
                                $schema: string;
                                title: string;
                                type: string;
                                properties: {
                                    type: {
                                        enum: string[];
                                        const?: undefined;
                                    };
                                    subtype: {
                                        enum: string[];
                                    };
                                    method: {
                                        $schema: string;
                                        title: string;
                                        type: string;
                                        required: string[];
                                        properties: {
                                            type: {
                                                description: string;
                                                type: string;
                                            };
                                            subtype: {
                                                description: string;
                                                type: string;
                                            };
                                            precision: {
                                                description: string;
                                                type: string;
                                            };
                                            data: {
                                                description: string;
                                                type: string;
                                            };
                                        };
                                    };
                                };
                                required: string[];
                                definitions?: undefined;
                                oneOf?: undefined;
                                discriminator?: undefined;
                            })[];
                            discriminator: {
                                propertyName: string;
                            };
                        };
                        application: {
                            $schema: string;
                            title: string;
                            type: string;
                            required: string[];
                            properties: {
                                _id: {
                                    description: string;
                                    type: string;
                                };
                                slug: {
                                    description: string;
                                    type: string;
                                };
                                systemName: {
                                    type: string;
                                };
                                schemaVersion: {
                                    description: string;
                                    type: string;
                                    default: string;
                                };
                                name: {
                                    description: string;
                                    type: string;
                                };
                                isDefault: {
                                    description: string;
                                    type: string;
                                    default: boolean;
                                };
                                shortName: {
                                    description: string;
                                    type: string;
                                };
                                summary: {
                                    description: string;
                                    type: string;
                                };
                                version: {
                                    description: string;
                                    type: string;
                                };
                                build: {
                                    description: string;
                                    type: string;
                                };
                                hasAdvancedComputeOptions: {
                                    description: string;
                                    type: string;
                                };
                                isLicensed: {
                                    description: string;
                                    type: string;
                                };
                            };
                        };
                        isDraft: {
                            description: string;
                            type: string;
                            default: boolean;
                        };
                    };
                };
            };
            units: {
                description: string;
                type: string;
                items: {
                    $schema: string;
                    title: string;
                    type: string;
                    oneOf: ({
                        $schema: string;
                        title: string;
                        type: string;
                        required: string[];
                        properties: {
                            _id: {
                                description: string;
                                type: string;
                            };
                            slug: {
                                description: string;
                                type: string;
                            };
                            systemName: {
                                type: string;
                            };
                            schemaVersion: {
                                description: string;
                                type: string;
                                default: string;
                            };
                            name: {
                                description: string;
                                type: string;
                            };
                            isDefault: {
                                description: string;
                                type: string;
                                default: boolean;
                            };
                            preProcessors: {
                                description: string;
                                type: string;
                                items: {
                                    $schema: string;
                                    title: string;
                                    type: string;
                                    required: string[];
                                    properties: {
                                        name: {
                                            description: string;
                                            type: string;
                                        };
                                    };
                                };
                            };
                            postProcessors: {
                                description: string;
                                type: string;
                                items: {
                                    $schema: string;
                                    title: string;
                                    type: string;
                                    required: string[];
                                    properties: {
                                        name: {
                                            description: string;
                                            type: string;
                                        };
                                    };
                                };
                            };
                            monitors: {
                                description: string;
                                type: string;
                                items: {
                                    $schema: string;
                                    title: string;
                                    type: string;
                                    required: string[];
                                    properties: {
                                        name: {
                                            description: string;
                                            type: string;
                                        };
                                    };
                                };
                            };
                            results: {
                                description: string;
                                type: string;
                                items: {
                                    $schema: string;
                                    title: string;
                                    type: string;
                                    required: string[];
                                    properties: {
                                        name: {
                                            description: string;
                                            type: string;
                                        };
                                    };
                                };
                            };
                            tags: {
                                description: string;
                                type: string;
                                items: {
                                    type: string;
                                };
                            };
                            status: {
                                type: string;
                                description: string;
                                enum: string[];
                            };
                            statusTrack: {
                                type: string;
                                items: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        trackedAt: {
                                            type: string;
                                        };
                                        status: {
                                            type: string;
                                        };
                                        repetition: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                            isDraft: {
                                type: string;
                            };
                            type: {
                                description: string;
                                type: string;
                                const: string;
                            };
                            head: {
                                description: string;
                                type: string;
                            };
                            flowchartId: {
                                description: string;
                                type: string;
                            };
                            next: {
                                description: string;
                                type: string;
                            };
                            enableRender: {
                                description: string;
                                type: string;
                            };
                            workflowId: {
                                description: string;
                                type: string;
                            };
                            input: {
                                description: string;
                                type: string;
                                required: string[];
                                properties: {
                                    target: {
                                        description: string;
                                        type: string;
                                    };
                                    scope: {
                                        description: string;
                                        type: string;
                                    };
                                    name: {
                                        description: string;
                                        type: string;
                                    };
                                    values: {
                                        description: string;
                                        type: string;
                                        items: {
                                            oneOf: {
                                                type: string;
                                            }[];
                                        };
                                    };
                                    useValues: {
                                        type: string;
                                    };
                                };
                                items?: undefined;
                            };
                            mapFlowchartId?: undefined;
                        };
                    } | {
                        $schema: string;
                        title: string;
                        type: string;
                        required: string[];
                        properties: {
                            _id: {
                                description: string;
                                type: string;
                            };
                            slug: {
                                description: string;
                                type: string;
                            };
                            systemName: {
                                type: string;
                            };
                            schemaVersion: {
                                description: string;
                                type: string;
                                default: string;
                            };
                            name: {
                                description: string;
                                type: string;
                            };
                            isDefault: {
                                description: string;
                                type: string;
                                default: boolean;
                            };
                            preProcessors: {
                                description: string;
                                type: string;
                                items: {
                                    $schema: string;
                                    title: string;
                                    type: string;
                                    required: string[];
                                    properties: {
                                        name: {
                                            description: string;
                                            type: string;
                                        };
                                    };
                                };
                            };
                            postProcessors: {
                                description: string;
                                type: string;
                                items: {
                                    $schema: string;
                                    title: string;
                                    type: string;
                                    required: string[];
                                    properties: {
                                        name: {
                                            description: string;
                                            type: string;
                                        };
                                    };
                                };
                            };
                            monitors: {
                                description: string;
                                type: string;
                                items: {
                                    $schema: string;
                                    title: string;
                                    type: string;
                                    required: string[];
                                    properties: {
                                        name: {
                                            description: string;
                                            type: string;
                                        };
                                    };
                                };
                            };
                            results: {
                                description: string;
                                type: string;
                                items: {
                                    $schema: string;
                                    title: string;
                                    type: string;
                                    required: string[];
                                    properties: {
                                        name: {
                                            description: string;
                                            type: string;
                                        };
                                    };
                                };
                            };
                            tags: {
                                description: string;
                                type: string;
                                items: {
                                    type: string;
                                };
                            };
                            status: {
                                type: string;
                                description: string;
                                enum: string[];
                            };
                            statusTrack: {
                                type: string;
                                items: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        trackedAt: {
                                            type: string;
                                        };
                                        status: {
                                            type: string;
                                        };
                                        repetition: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                            isDraft: {
                                type: string;
                            };
                            type: {
                                description: string;
                                type: string;
                                const: string;
                            };
                            head: {
                                description: string;
                                type: string;
                            };
                            flowchartId: {
                                description: string;
                                type: string;
                            };
                            next: {
                                description: string;
                                type: string;
                            };
                            enableRender: {
                                description: string;
                                type: string;
                            };
                            mapFlowchartId: {
                                description: string;
                                type: string;
                            };
                            input: {
                                description: string;
                                type: string;
                                items: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        operation: {
                                            description: string;
                                            type: string;
                                        };
                                        arguments: {
                                            description: string;
                                            type: string;
                                            items: {
                                                type: string;
                                            };
                                        };
                                    };
                                };
                                required?: undefined;
                                properties?: undefined;
                            };
                            workflowId?: undefined;
                        };
                    } | {
                        $schema: string;
                        title: string;
                        type: string;
                        required: string[];
                        properties: {
                            _id: {
                                description: string;
                                type: string;
                            };
                            slug: {
                                description: string;
                                type: string;
                            };
                            systemName: {
                                type: string;
                            };
                            schemaVersion: {
                                description: string;
                                type: string;
                                default: string;
                            };
                            name: {
                                description: string;
                                type: string;
                            };
                            isDefault: {
                                description: string;
                                type: string;
                                default: boolean;
                            };
                            preProcessors: {
                                description: string;
                                type: string;
                                items: {
                                    $schema: string;
                                    title: string;
                                    type: string;
                                    required: string[];
                                    properties: {
                                        name: {
                                            description: string;
                                            type: string;
                                        };
                                    };
                                };
                            };
                            postProcessors: {
                                description: string;
                                type: string;
                                items: {
                                    $schema: string;
                                    title: string;
                                    type: string;
                                    required: string[];
                                    properties: {
                                        name: {
                                            description: string;
                                            type: string;
                                        };
                                    };
                                };
                            };
                            monitors: {
                                description: string;
                                type: string;
                                items: {
                                    $schema: string;
                                    title: string;
                                    type: string;
                                    required: string[];
                                    properties: {
                                        name: {
                                            description: string;
                                            type: string;
                                        };
                                    };
                                };
                            };
                            results: {
                                description: string;
                                type: string;
                                items: {
                                    $schema: string;
                                    title: string;
                                    type: string;
                                    required: string[];
                                    properties: {
                                        name: {
                                            description: string;
                                            type: string;
                                        };
                                    };
                                };
                            };
                            tags: {
                                description: string;
                                type: string;
                                items: {
                                    type: string;
                                };
                            };
                            status: {
                                type: string;
                                description: string;
                                enum: string[];
                            };
                            statusTrack: {
                                type: string;
                                items: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        trackedAt: {
                                            type: string;
                                        };
                                        status: {
                                            type: string;
                                        };
                                        repetition: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                            isDraft: {
                                type: string;
                            };
                            type: {
                                description: string;
                                type: string;
                                const: string;
                            };
                            head: {
                                description: string;
                                type: string;
                            };
                            flowchartId: {
                                description: string;
                                type: string;
                            };
                            next: {
                                description: string;
                                type: string;
                            };
                            enableRender: {
                                description: string;
                                type: string;
                            };
                            workflowId?: undefined;
                            input?: undefined;
                            mapFlowchartId?: undefined;
                        };
                    })[];
                    discriminator: {
                        propertyName: string;
                    };
                    required: string[];
                };
            };
        };
    };
    static usePredefinedIds: boolean;
    static get defaultConfig(): {
        name: string;
        properties: never[];
        subworkflows: {
            _id: string;
            application: {
                name: string;
                summary: string;
                version: string;
            };
            model: {
                method: {
                    subtype: string;
                    type: string;
                };
                subtype: string;
                type: string;
            };
            name: string;
            properties: never[];
            units: never[];
        }[];
        workflows: never[];
        units: {
            _id: string;
            flowchartId: string;
            head: boolean;
            monitors: never[];
            postProcessors: never[];
            preProcessors: never[];
            results: never[];
            type: string;
            name: string;
        }[];
    };
    static generateWorkflowId(name: any, properties?: null, subworkflows?: null, applicationName?: null): any;
    static fromSubworkflow(subworkflow: any, ClsConstructor?: typeof Workflow): Workflow;
    static fromSubworkflows(name: any, ClsConstructor?: typeof Workflow, ...subworkflows: any[]): Workflow;
    constructor(config: any, _Subworkflow?: typeof Subworkflow, _UnitFactory?: typeof UnitFactory, _Workflow?: typeof Workflow, _MapUnit?: typeof MapUnit);
    _Subworkflow: typeof Subworkflow;
    _UnitFactory: typeof UnitFactory;
    _Workflow: typeof Workflow;
    _MapUnit: typeof MapUnit;
    initialize(): void;
    _subworkflows: any;
    _units: any;
    _workflows: any;
    /**
     * @summary Adds subworkflow to current workflow.
     * @param subworkflow {Subworkflow}
     * @param head {Boolean}
     */
    addSubworkflow(subworkflow: Subworkflow, head?: boolean, index?: number): void;
    removeSubworkflow(id: any): void;
    subworkflowId(index: any): any;
    replaceSubworkflowAtIndex(index: any, newSubworkflow: any): void;
    get units(): any;
    setUnits(arr: any): void;
    get usedApplications(): any[];
    get usedApplicationNames(): any[];
    get usedApplicationVersions(): any[];
    get usedApplicationNamesWithVersions(): string[];
    get usedModels(): any[];
    get humanReadableUsedModels(): any[];
    toJSON(exclude?: any[]): lodash.Omit<any, any>;
    get isDefault(): any;
    set isMultiMaterial(value: any);
    get isMultiMaterial(): any;
    set isUsingDataset(value: boolean);
    get isUsingDataset(): boolean;
    get properties(): any[];
    get humanReadableProperties(): string[];
    get systemName(): string;
    get defaultDescription(): string;
    get exabyteId(): any;
    get hash(): any;
    get isOutdated(): any;
    get history(): any;
    setMethodData(methodData: any): void;
    /**
     * @param unit {Unit}
     * @param head {Boolean}
     * @param index {Number}
     */
    addUnit(unit: Unit, head?: boolean, index?: number): void;
    removeUnit(flowchartId: any): void;
    /**
     * @return Subworkflow[]
     */
    get subworkflows(): any;
    get workflows(): any;
    addUnitType(type: any, head?: boolean, index?: number): void;
    addMapUnit(mapUnit: any, mapWorkflow: any): void;
    findSubworkflowById(id: any): any;
    get allSubworkflows(): any[];
    /**
     * @summary Calculates hash of the workflow. Meaningful fields are units and subworkflows.
     * units and subworkflows must be sorted topologically before hashing (already sorted).
     */
    calculateHash(): string;
}
declare class BaseWorkflow {
}
import { Subworkflow } from "../subworkflows/subworkflow";
import { UnitFactory } from "../units/factory";
import { MapUnit } from "../units";
import lodash from "lodash";
export {};
