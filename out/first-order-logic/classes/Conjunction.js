import { TRUE_LITERAL } from "../../epilog-ts-core/classes/Literal.js";
class Conjunction {
    constructor(conjuncts) {
        // If the empty conjunction, set it to the list containing the 'true' literal
        if (conjuncts.length === 0) {
            conjuncts = [TRUE_LITERAL];
        }
        this.conjuncts = conjuncts;
    }
    toString() {
        if (this.conjuncts.length === 0) {
            return "()";
        }
        let str = "(";
        for (let conjunct of this.conjuncts) {
            str += conjunct.toString() + " ∧ ";
        }
        str = str.slice(0, -3);
        str += ")";
        return str;
    }
    getVars() {
        let varList = [];
        for (let conjunct of this.conjuncts) {
            varList = varList.concat([...conjunct.getVars()]);
        }
        let varSet = new Set(varList);
        return varSet;
    }
}
export { Conjunction };
//# sourceMappingURL=Conjunction.js.map