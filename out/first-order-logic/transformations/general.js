import { Literal } from "../../epilog-ts-core/classes/Literal.js";
import { Variable } from "../../epilog-ts-core/classes/Term.js";
import { Biconditional } from "../classes/Biconditional.js";
import { Conjunction } from "../classes/Conjunction.js";
import { Disjunction } from "../classes/Disjunction.js";
import { ERROR_FORMULA } from "../classes/Formula.js";
import { Implication } from "../classes/Implication.js";
import { Negation } from "../classes/Negation.js";
import { QuantifiedFormula, Quantifier } from "../classes/QuantifiedFormula.js";
import { getFreeVars } from "../utils/general.js";
// Removes all quantifiers from the input formula.
// The Quantifiers and Variables of QuantifiedFormulae are removed, but their "formula" properties remain part of the formula. 
function removeQuantifiers(formula) {
    if (formula instanceof Literal) {
        return formula;
    }
    if (formula instanceof Negation) {
        return new Negation(removeQuantifiers(formula.target));
    }
    if (formula instanceof Conjunction) {
        let strippedConjuncts = [];
        for (let conjunct of formula.conjuncts) {
            strippedConjuncts.push(removeQuantifiers(conjunct));
        }
        return new Conjunction(strippedConjuncts);
    }
    if (formula instanceof Disjunction) {
        let strippedDisjuncts = [];
        for (let disjunct of formula.disjuncts) {
            strippedDisjuncts.push(removeQuantifiers(disjunct));
        }
        return new Disjunction(strippedDisjuncts);
    }
    if (formula instanceof Implication) {
        return new Implication(removeQuantifiers(formula.antecedent), removeQuantifiers(formula.consequent));
    }
    if (formula instanceof Biconditional) {
        return new Biconditional(removeQuantifiers(formula.antecedent), removeQuantifiers(formula.consequent));
    }
    if (formula instanceof QuantifiedFormula) {
        return removeQuantifiers(formula.formula);
    }
    console.error("Tried to strip quantifiers from a Formula without a valid type:", formula);
    return ERROR_FORMULA;
}
// Returns the original formula prefixed with universal quantifiers for each of its free variables 
function bindFreeVars(formula) {
    let freeVarSet = getFreeVars(formula);
    let resultFormula = formula;
    // Sorts the list and traverses it in reverse order to result in free variables quantified in alphabetical order.
    // Done purely for reasons of preference. Others should feel free to remove/edit this process.
    let alphSortedFreeVars = [...freeVarSet].sort();
    for (let i = alphSortedFreeVars.length - 1; i >= 0; i--) {
        let freeVarName = alphSortedFreeVars[i];
        resultFormula = new QuantifiedFormula(Quantifier.Universal, new Variable(freeVarName), resultFormula);
    }
    return resultFormula;
}
export { removeQuantifiers, bindFreeVars };
//# sourceMappingURL=general.js.map