import { FALSE_LITERAL } from "../../epilog-ts/classes/Literal.js";
import { Formula } from "./Formula.js";


type Clause = Disjunction;

class Disjunction {

    readonly disjuncts: Formula[];

    constructor(disjuncts: Formula[]) {
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

    isEmpty() : boolean {
        return this.disjuncts.length === 0;
    }

    getVars() : Set<string> {
        let varList : string[] = [];

        for (let disjunct of this.disjuncts) {
            varList = varList.concat([...disjunct.getVars()]);
        }
        
        let varSet : Set<string> = new Set(varList);
        return varSet;
    }
}


export {
    Disjunction,
    Clause
}