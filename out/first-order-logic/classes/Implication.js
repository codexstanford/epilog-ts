class Implication {
    constructor(antecedent, consequent) {
        this.antecedent = antecedent;
        this.consequent = consequent;
    }
    toString() {
        return "(" + this.antecedent.toString() + " ⇒ " + this.consequent.toString() + ")";
    }
}
export { Implication };
//# sourceMappingURL=Implication.js.map