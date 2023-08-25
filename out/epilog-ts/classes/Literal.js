import { Atom, ERROR_ATOM } from "./Atom.js";
class Literal {
    constructor(atom, negated) {
        this.atom = atom;
        this.negated = negated;
    }
    toString() {
        if (this.negated) {
            return "~" + this.atom.toString();
        }
        return this.atom.toString();
    }
    isGround() {
        return this.atom.isGround();
    }
    isNegated() {
        return this.negated;
    }
    getVars() {
        return this.atom.getVars();
    }
    // Builds a new Literal to which the substitution has been applied
    static applySub(sub, literal) {
        return new Literal(Atom.applySub(sub, literal.atom), literal.isNegated());
    }
}
const ERROR_LITERAL = new Literal(ERROR_ATOM, false);
export { Literal, ERROR_LITERAL };
//# sourceMappingURL=Literal.js.map