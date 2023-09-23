import { isEpilogConstant } from "../utils/string-utils.js";
class Predicate {
    constructor(name) {
        if (isEpilogConstant(name)) {
            this.name = name;
            return;
        }
        console.error("Invalid predicate name: ", name);
        this.name = "error";
    }
    toString() {
        return this.name;
    }
    static renamePredicate(oldPredName, newPredName, pred) {
        if (oldPredName === pred.name) {
            return new Predicate(newPredName);
        }
        return new Predicate(pred.name);
    }
}
export { Predicate };
//# sourceMappingURL=Predicate.js.map