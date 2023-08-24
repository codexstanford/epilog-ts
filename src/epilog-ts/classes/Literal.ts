import { Atom, ERROR_ATOM } from "./Atom.js";
import { Substitution } from "./Substitution.js";

class Literal {
    readonly atom: Atom;
    private negated: boolean;

    constructor(atom: Atom, negated: boolean) {
        this.atom = atom;
        this.negated = negated;
    }

    toString() : string {
        if (this.negated) {
            return "~" + this.atom.toString();
        }

        return this.atom.toString();
    }

    isGround() : boolean {
        return this.atom.isGround();
    }

    isNegated() : boolean {
        return this.negated;
    }

    getVars() : Set<string> {
        return this.atom.getVars();
    }

    // Builds a new Literal to which the substitution has been applied
    static applySub(sub: Substitution, literal: Literal) : Literal {
        return new Literal(Atom.applySub(sub, literal.atom), literal.isNegated());
    }
    
}

const ERROR_LITERAL = new Literal(ERROR_ATOM, false);

export { 
    Literal,

    ERROR_LITERAL
}