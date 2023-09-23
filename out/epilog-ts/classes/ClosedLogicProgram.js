import { Dataset } from "./Dataset.js";
import { Ruleset } from "./Ruleset.js";
class ClosedLogicProgram {
    constructor(dataset, ruleset) {
        this.dataset = dataset;
        this.ruleset = ruleset;
    }
    getPredNames() {
        return new Set([...this.dataset.getPredNames(), ...this.ruleset.getPredNames()]);
    }
    toString() {
        return "Dataset: " + this.dataset.toString() + "\n" + "Ruleset: " + this.ruleset.toString();
    }
    static renamePredicate(oldPredName, newPredName, clp) {
        return new ClosedLogicProgram(Dataset.renamePredicate(oldPredName, newPredName, clp.dataset), Ruleset.renamePredicate(oldPredName, newPredName, clp.ruleset));
    }
}
export { ClosedLogicProgram };
//# sourceMappingURL=ClosedLogicProgram.js.map