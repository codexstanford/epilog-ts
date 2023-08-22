import { Atom, ERROR_ATOM } from "./Atom.js";

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
    
}

const ERROR_LITERAL = new Literal(ERROR_ATOM, false);

export { 
    Literal,

    ERROR_LITERAL
}