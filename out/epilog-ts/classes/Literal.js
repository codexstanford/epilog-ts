import { ERROR_ATOM } from "./Atom.js";
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
}
const ERROR_LITERAL = new Literal(ERROR_ATOM, false);
export { Literal, ERROR_LITERAL };
//# sourceMappingURL=Literal.js.map