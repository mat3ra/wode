/**
 * @summary Get QptIrr units used in phonon map calculations
 * @param unitBuilders {Object} unit builders
 * @param unitFactoryCls {*} unit factory class
 * @param application {*} application instance
 * @returns {[{head: boolean, preProcessors: [], postProcessors: [], name: *, flowchartId: *, type: *, results: [], monitors: []},*]}
 */
export function getQpointIrrep({ unitBuilders, unitFactoryCls, application }: Object): [{
    head: boolean;
    preProcessors: [];
    postProcessors: [];
    name: any;
    flowchartId: any;
    type: any;
    results: [];
    monitors: [];
}, any];
