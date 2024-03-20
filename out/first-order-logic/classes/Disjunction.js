import { FALSE_LITERAL } from "../../epilog-ts-core/classes/Literal.js";
class Disjunction {
    constructor(disjuncts) {
        // If the empty disjunction, set it to the list containing the 'false' literal
        if (disjuncts.length === 0) {
            disjuncts = [FALSE_LITERAL];
        }
        this.disjuncts = disjuncts;
    }
    toString() {
        if (this.disjuncts.length === 0) {
            return "()";
        }
        let str = "(";
        for (let disjunct of this.disjuncts) {
            str += disjunct.toString() + " ∨ ";
        }
        str = str.slice(0, -3);
        str += ")";
        return str;
    }
    isEmpty() {
        return this.disjuncts.length === 0;
    }
    getVars() {
        let varList = [];
        for (let disjunct of this.disjuncts) {
            varList = varList.concat([...disjunct.getVars()]);
        }
        let varSet = new Set(varList);
        return varSet;
    }
}
export { Disjunction };
//# sourceMappingURL=Disjunction.js.map