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
export { Literal };
//# sourceMappingURL=Literal.js.map