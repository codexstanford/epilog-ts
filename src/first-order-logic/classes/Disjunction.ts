import { FALSE_LITERAL } from "../../epilog-ts/classes/Literal.js";
import { Formula } from "./Formula.js";


type Clause = Disjunction;

class Disjunction {

    readonly disjuncts: Formula[];

    constructor(disjuncts: Formula[]) {
        // If the empty disjunction, set it to the list containing the 'true' literal
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
}


export {
    Disjunction,
    Clause
}