import { Atom, ERROR_ATOM } from "./Atom.js";
import { Predicate } from "./Predicate.js";
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
const TRUE_LITERAL = new Literal(new Atom(new Predicate('true'), []), false);
const FALSE_LITERAL = new Literal(new Atom(new Predicate('false'), []), false);
const ERROR_LITERAL = new Literal(ERROR_ATOM, false);
export { Literal, TRUE_LITERAL, FALSE_LITERAL, ERROR_LITERAL, };
//# sourceMappingURL=Literal.js.map