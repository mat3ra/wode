import type { AtomicElementValue } from "@mat3ra/made/dist/js/basis/elements";

import QEPWXInputDataManager from "../espresso/QEPWXInputDataManager";

/**
 * q3 reads the same UPF files as pw.x, but takes their full location from the input instead of a
 * `pseudo_dir` plus file name, so nothing has to be staged next to the input file.
 */
class Q3InputDataManager extends QEPWXInputDataManager {
    protected getPseudopotentialReference(element: AtomicElementValue) {
        const pseudo = (this.methodData?.pseudo || []).find((p) => p.element === element);
        return pseudo?.path || pseudo?.filename || "";
    }
}

export default Q3InputDataManager;
