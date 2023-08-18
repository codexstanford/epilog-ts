import { Atom } from "./Atom";

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

export { Literal }