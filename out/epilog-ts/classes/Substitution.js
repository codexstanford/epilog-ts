import { isEpilogVariable } from "../utils/string-utils.js";
import { ERROR_TERM } from "./Term.js";
class Substitution {
    constructor(varMap = new Map()) {
        // Ensure domain only consists of variables
        for (let varName of varMap.keys()) {
            if (varName === "_") {
                console.error("Substitution can only substitute named variables, but domain element is anonymous.");
                this.varMap = new Map();
                return;
            }
            if (!isEpilogVariable(varName)) {
                console.error("Substitution can only substitute variables, but domain element is not a variable:", varName);
                this.varMap = new Map();
                return;
            }
        }
        this.varMap = varMap;
        // Check whether there is an overlapping domain and range. Only reports the first overlap
        const RANGE = this.getRange();
        for (let domainElem of this.getDomain()) {
            if (RANGE.has(domainElem)) {
                console.warn("Substitution has overlapping domain and range. Both contain", domainElem);
                break;
            }
        }
    }
    toString() {
        let str = "{\n";
        for (let [varName, varAssignment] of this.varMap.entries()) {
            str += "\t" + varName + " ⟶ " + varAssignment + ", \n";
        }
        // No dangling comma if the map is empty.
        if (this.varMap.size > 0) {
            str = str.slice(0, -3);
        }
        str += "\n}";
        return str;
    }
    // Should check whether a sub exists with hasSub() before calling getSub(), unless it is known to exist.
    getSub(varName) {
        if (!this.varMap.has(varName)) {
            console.error("Tried to access a substitution for an element not in the Substitution's domain:", varName);
            return ERROR_TERM;
        }
        return this.varMap.get(varName);
    }
    setSub(varName, varSub) {
        if (varName === "_") {
            console.error("Substitution can only substitute named variables, but proposed domain element is anonymous.");
            return;
        }
        if (!isEpilogVariable(varName)) {
            console.error("Substitution can only substitute variables, but proposed domain element is not a variable:", varName);
            return;
        }
        this.varMap.set(varName, varSub);
    }
    hasSub(varName) {
        return this.varMap.has(varName);
    }
    // Get the set of strings mapped from by the substitution
    getDomain() {
        return new Set(...this.varMap.keys());
    }
    // Get the set of strings corresponding to object mapped to by the substitution
    getRange() {
        let rangeSet = new Set();
        for (let val of this.varMap.values()) {
            rangeSet.add(val.toString());
        }
        return rangeSet;
    }
}
export { Substitution };
//# sourceMappingURL=Substitution.js.map