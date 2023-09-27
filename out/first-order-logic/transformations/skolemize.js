import { Constructor } from "../../epilog-ts/classes/Constructor.js";
import { Literal } from "../../epilog-ts/classes/Literal.js";
import { Substitution } from "../../epilog-ts/classes/Substitution.js";
import { CompoundTerm } from "../../epilog-ts/classes/Term.js";
import { Biconditional } from "../classes/Biconditional.js";
import { Conjunction } from "../classes/Conjunction.js";
import { Disjunction } from "../classes/Disjunction.js";
import { ERROR_FORMULA } from "../classes/Formula.js";
import { Implication } from "../classes/Implication.js";
import { Negation } from "../classes/Negation.js";
import { QuantifiedFormula, Quantifier } from "../classes/QuantifiedFormula.js";
import { getFreeVars, hasFreeVars, hasVarNameCollisions } from "../utils/general.js";
let skolemCounter = 0;
// Strictly a helper for skolemize
// Returns 
// (i) the formula with existential quantifiers removed and its existentially-quantified variables replaced with skolem function terms with constructors of the form "skolemfunc{num}", and 
// (ii) the updated skolemFunctionCounter
// Assumes the formula has no free variables and no variable name collisions
// The second argument keeps track of how many distinct skolem functions have been created thus far
// The third argument keeps track of the currently-applicable skolemizing substitutions for existential variables (i.e. for the variables that are in scope)
function skolemize_helper(formula, skolemFunctionCounter, skolemizingSub, currentUnivVars) {
    if (formula instanceof Literal) {
        return [Literal.applySub(skolemizingSub, formula), skolemFunctionCounter];
    }
    if (formula instanceof Negation) {
        let modifiedTarget = ERROR_FORMULA;
        [modifiedTarget, skolemFunctionCounter] = skolemize_helper(formula.target, skolemFunctionCounter, skolemizingSub, currentUnivVars);
        return [new Negation(modifiedTarget), skolemFunctionCounter];
    }
    if (formula instanceof Implication) {
        let modifiedAntecedent = ERROR_FORMULA;
        let modifiedConsequent = ERROR_FORMULA;
        [modifiedAntecedent, skolemFunctionCounter] = skolemize_helper(formula.antecedent, skolemFunctionCounter, skolemizingSub, currentUnivVars);
        [modifiedConsequent, skolemFunctionCounter] = skolemize_helper(formula.consequent, skolemFunctionCounter, skolemizingSub, currentUnivVars);
        return [new Implication(modifiedAntecedent, modifiedConsequent), skolemFunctionCounter];
    }
    if (formula instanceof Biconditional) {
        let modifiedAntecedent = ERROR_FORMULA;
        let modifiedConsequent = ERROR_FORMULA;
        [modifiedAntecedent, skolemFunctionCounter] = skolemize_helper(formula.antecedent, skolemFunctionCounter, skolemizingSub, currentUnivVars);
        [modifiedConsequent, skolemFunctionCounter] = skolemize_helper(formula.consequent, skolemFunctionCounter, skolemizingSub, currentUnivVars);
        return [new Biconditional(modifiedAntecedent, modifiedConsequent), skolemFunctionCounter];
    }
    if (formula instanceof Conjunction) {
        let modifiedConjuncts = [];
        for (let conjunct of formula.conjuncts) {
            let currModifiedConjunct = ERROR_FORMULA;
            [currModifiedConjunct, skolemFunctionCounter] = skolemize_helper(conjunct, skolemFunctionCounter, skolemizingSub, currentUnivVars);
            modifiedConjuncts.push(currModifiedConjunct);
        }
        return [new Conjunction(modifiedConjuncts), skolemFunctionCounter];
    }
    if (formula instanceof Disjunction) {
        let modifiedDisjuncts = [];
        for (let disjunct of formula.disjuncts) {
            let currModifiedDisjunct = ERROR_FORMULA;
            [currModifiedDisjunct, skolemFunctionCounter] = skolemize_helper(disjunct, skolemFunctionCounter, skolemizingSub, currentUnivVars);
            modifiedDisjuncts.push(currModifiedDisjunct);
        }
        return [new Disjunction(modifiedDisjuncts), skolemFunctionCounter];
    }
    if (formula instanceof QuantifiedFormula) {
        if (formula.quantifier === Quantifier.Universal) {
            let modifiedFormula = ERROR_FORMULA;
            currentUnivVars.push(formula.variable);
            [modifiedFormula, skolemFunctionCounter] = skolemize_helper(formula.formula, skolemFunctionCounter, skolemizingSub, currentUnivVars);
            currentUnivVars.pop();
            return [new QuantifiedFormula(Quantifier.Universal, formula.variable.clone(), modifiedFormula), skolemFunctionCounter];
        }
        if (formula.quantifier === Quantifier.Existential) {
            let newSkolemTerm = new CompoundTerm(new Constructor("skolemfunc" + skolemFunctionCounter), currentUnivVars);
            skolemFunctionCounter++;
            skolemizingSub.setSub(formula.variable.name, newSkolemTerm);
            let modifiedFormula = ERROR_FORMULA;
            [modifiedFormula, skolemFunctionCounter] = skolemize_helper(formula.formula, skolemFunctionCounter, skolemizingSub, currentUnivVars);
            skolemizingSub.deleteSub(formula.variable.name);
            return [modifiedFormula, skolemFunctionCounter];
        }
        console.error("Cannot skolemize a QuantifiedFormula without a valid Quantifier:", formula);
        return [ERROR_FORMULA, 0];
    }
    console.error("Cannot replace existential variables with skolem function terms in a Formula without a valid type:", formula);
    return [ERROR_FORMULA, 0];
}
// Replaces all existentially-quantified variables in a Formula with skolem function terms, where the constructor is of the form "skolemfunc{num}"
// Requires that the formula have no free variables, and have no variable name collisions
function skolemize(formula) {
    if (hasFreeVars(formula)) {
        console.error("Cannot skolemize a formula with free variables:", formula.toString(), getFreeVars(formula));
        return ERROR_FORMULA;
    }
    if (hasVarNameCollisions(formula)) {
        console.error("Cannot skolemize a formula with variable name collisions:", formula.toString(), formula.getVars());
        return ERROR_FORMULA;
    }
    // Replace existentially-quantified variables with skolem function terms, and remove existential quantifiers
    let resultFormula = ERROR_FORMULA;
    [resultFormula, skolemCounter] = skolemize_helper(formula, skolemCounter, new Substitution(), []);
    return resultFormula;
}
export { skolemize };
//# sourceMappingURL=skolemize.js.map