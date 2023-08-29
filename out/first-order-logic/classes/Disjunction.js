class Disjunction {
    constructor(disjuncts) {
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
    isEmpty() {
        return this.disjuncts.length === 0;
    }
}
export { Disjunction };
//# sourceMappingURL=Disjunction.js.map