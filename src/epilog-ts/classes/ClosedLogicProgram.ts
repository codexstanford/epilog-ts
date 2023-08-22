import { Dataset } from "./Dataset.js";
import { Ruleset } from "./Ruleset.js";

// Type alias for brevity
type CLP = ClosedLogicProgram;

class ClosedLogicProgram {
    readonly dataset: Dataset;
    readonly ruleset: Ruleset;

    constructor(dataset: Dataset, ruleset: Ruleset) {
        this.dataset = dataset;
        this.ruleset = ruleset;
    }

    toString() : string {
        return "Dataset: " + this.dataset.toString() + "\n" + "Ruleset: " + this.ruleset.toString();
    }
}

export {
    CLP,
    ClosedLogicProgram
}