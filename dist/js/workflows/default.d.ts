declare namespace _default {
    let name: string;
    let properties: never[];
    let subworkflows: {
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
    let workflows: never[];
    let units: {
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
}
export default _default;
