var Quantifier;
(function (Quantifier) {
    Quantifier[Quantifier["Universal"] = 0] = "Universal";
    Quantifier[Quantifier["Existential"] = 1] = "Existential";
})(Quantifier || (Quantifier = {}));
function quantifierToString(quantifier) {
    switch (quantifier) {
        case Quantifier.Universal: {
            return "∀";
        }
        case Quantifier.Existential: {
            return "∃";
        }
        default: {
            console.error("Invalid quantifier:", quantifier);
            return "";
        }
    }
}
class QuantifiedFormula {
    constructor(quantifier, variable, formula) {
        if (variable.isAnonymous()) {
            console.error("Anonymous variable used in QuantifiedFormula.");
        }
        this.quantifier = quantifier;
        this.variable = variable;
        this.formula = formula;
    }
    toString() {
        let str = quantifierToString(this.quantifier);
        return str + this.variable.toString() + ".(" + this.formula.toString() + ")";
    }
}
export { QuantifiedFormula, Quantifier };
//# sourceMappingURL=QuantifiedFormula.js.map