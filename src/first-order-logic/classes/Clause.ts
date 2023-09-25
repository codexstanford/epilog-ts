import { ERROR_LITERAL, Literal } from "../../epilog-ts/classes/Literal.js";
import { Formula } from "./Formula.js";


// Conceptually a Disjunction, but imposes the following constraints
    // its disjuncts must all be Literals
    // its disjuncts are made unique w.r.t. toString (i.e. repeats will be excluded in the constructor)
    // its disjuncts are sorted in ascending alphabetical order w.r.t. toString (i.e. the constructor will sort the list of Literals alphabetically)
class Clause {
    private literalSet : Set<string>;
    readonly literals : Literal[];


    constructor(literals : Formula[]) {
        this.literalSet = new Set();
        this.literals = [];

        for (let formula of literals) {
            if (!(formula instanceof Literal)) {
                console.error("Clause must consist only of Literals, but the following Formula was passed to the constructor:",formula.toString());
                this.literals = [ERROR_LITERAL];
                this.literalSet = new Set([ERROR_LITERAL.toString()]);
                return;
            }

            // Ensure the literals are unique
            if (this.literalSet.has(formula.toString())) {
                continue;
            }

            this.literalSet.add(formula.toString());
            this.literals.push(formula);
        }

        // Sort the literals list
        this.literals = this.literals.sort((a, b) => {
            if (a.toString() === b.toString()) {
                return 0;
            }

            return a.toString() < b.toString() ? -1 : 1;
        });
    }

    toString() {
        if (this.literals.length === 0) {
            return "{}";
        }

        let str = "{";
        
        for (let literal of this.literals) {
            str += literal.toString() + ", ";
        }

        str = str.slice(0, -2);
        str += "}";

        return str;
    }
}

export {
    Clause
}