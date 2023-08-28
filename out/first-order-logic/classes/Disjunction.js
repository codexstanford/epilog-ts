class Disjunction {
    constructor(disjuncts) {
        if (disjuncts.length === 0) {
            console.warn("Warning: created the empty disjunction");
        }
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
}
export { Disjunction };
//# sourceMappingURL=Disjunction.js.map