import { TRUE_LITERAL } from "../../epilog-ts/classes/Literal.js";
import { Formula } from "./Formula.js";

class Conjunction {

    readonly conjuncts: Formula[];

    constructor(conjuncts: Formula[]) {

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

    getVars() : Set<string> {
        let varList : string[] = [];

        for (let conjunct of this.conjuncts) {
            varList = varList.concat([...conjunct.getVars()]);
        }
        
        let varSet : Set<string> = new Set(varList);
        return varSet;
    }
}


export {
    Conjunction
}