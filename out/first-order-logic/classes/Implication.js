class Implication {
    constructor(antecedent, consequent) {
        this.antecedent = antecedent;
        this.consequent = consequent;
    }
    toString() {
        return "(" + this.antecedent.toString() + " ⇒ " + this.consequent.toString() + ")";
    }
    getVars() {
        return new Set([...this.antecedent.getVars(), ...this.consequent.getVars()]);
    }
}
export { Implication };
//# sourceMappingURL=Implication.js.map