import { Formula } from "./Formula.js";


type Clause = Disjunction;

class Disjunction {

    readonly disjuncts: Formula[];

    constructor(disjuncts: Formula[]) {
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