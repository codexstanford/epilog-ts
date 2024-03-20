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

    getPredNames() : Set<string> {
        return new Set([...this.dataset.getPredNames(), ...this.ruleset.getPredNames()])
    }
    
    toString() : string {
        return "Dataset: " + this.dataset.toString() + "\n" + "Ruleset: " + this.ruleset.toString();
    }

    static renamePredicate(oldPredName: string, newPredName: string, clp : ClosedLogicProgram) : ClosedLogicProgram {
        return new ClosedLogicProgram(Dataset.renamePredicate(oldPredName, newPredName, clp.dataset), Ruleset.renamePredicate(oldPredName, newPredName, clp.ruleset))
    }
}

export {
    CLP,
    ClosedLogicProgram
}