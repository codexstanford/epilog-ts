import { Variable } from "../../epilog-ts/classes/Term.js";
import { Formula } from "./Formula.js";

enum Quantifier {
    Universal,
    Existential
}

function quantifierToString(quantifier: Quantifier) : String {
    switch (quantifier) {
        case Quantifier.Universal: {
            return "∀";
        }
        case Quantifier.Existential: {
            return "∃";
        }
        default: {
            console.error("Invalid quantifier:",quantifier);
            return "";
        }
    }
}

class QuantifiedFormula {
    readonly quantifier: Quantifier;
    readonly variable: Variable;
    readonly formula: Formula

    constructor(quantifier: Quantifier, variable: Variable, formula: Formula) {

        if (variable.isAnonymous()) {
            console.error("Anonymous variable used in QuantifiedFormula.");
        }

        this.quantifier = quantifier;
        this.variable = variable;
        this.formula = formula;
    }

    toString() {
        let str = quantifierToString(this.quantifier);

        return str + this.variable.toString() + ".(" + this.formula.toString() + ")";
    }

    // Doesn't include the quantified variable; only includes those that actually appear in a Literal
    getVars() : Set<string> {
        return this.formula.getVars();
    }

}

export {
    QuantifiedFormula,

    Quantifier
}