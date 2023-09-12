import { Literal } from "../../epilog-ts/classes/Literal.js";
import { Biconditional } from "../classes/Biconditional.js";
import { Conjunction } from "../classes/Conjunction.js";
import { Disjunction } from "../classes/Disjunction.js";
import { Implication } from "../classes/Implication.js";
import { Negation } from "../classes/Negation.js";
import { QuantifiedFormula } from "../classes/QuantifiedFormula.js";
// Computes the order in which quantifiers appear in the input formula, primarily for use when converting to prefix form, or when skolemizing.
// Traverses the formula in DFS order.
// Returns a list of pairs of (i) Quantifiers and (ii) Variables.
function getQuantifiersInOrder(formula) {
    if (formula instanceof Literal) {
        return [];
    }
    if (formula instanceof Negation) {
        return getQuantifiersInOrder(formula.target);
    }
    if (formula instanceof Conjunction) {
        let quantifiersList = [];
        for (let conjunct of formula.conjuncts) {
            quantifiersList = [...quantifiersList, ...getQuantifiersInOrder(conjunct)];
        }
        return quantifiersList;
    }
    if (formula instanceof Disjunction) {
        let quantifiersList = [];
        for (let disjunct of formula.disjuncts) {
            quantifiersList = [...quantifiersList, ...getQuantifiersInOrder(disjunct)];
        }
        return quantifiersList;
    }
    if (formula instanceof Implication || formula instanceof Biconditional) {
        return [...getQuantifiersInOrder(formula.antecedent), ...getQuantifiersInOrder(formula.consequent)];
    }
    if (formula instanceof QuantifiedFormula) {
        return [[formula.quantifier, formula.variable], ...getQuantifiersInOrder(formula.formula)];
    }
    console.error("Tried to get quantifiers in order of Formula without a valid type:", formula);
    return [];
}
function getFreeVars_helper(formula, boundVars) {
    let freeVars = new Set();
    // Literals can contain free vars, if they aren't bound by a quantifier above it
    if (formula instanceof Literal) {
        let varNames = formula.getVars();
        for (let literalVarName of varNames) {
            if (!boundVars.has(literalVarName)) {
                freeVars.add(literalVarName);
            }
        }
        return freeVars;
    }
    // A QuantifiedFormula can bind a variable
    if (formula instanceof QuantifiedFormula) {
        let quantVarName = formula.variable.name;
        // Get the free variables of the subformula, but with the quantified variable bound
        let subformulaFreeVars = getFreeVars_helper(formula.formula, new Set([...boundVars, quantVarName]));
        return subformulaFreeVars;
    }
    // All other formulae just gather the free variables of their subformulae
    if (formula instanceof Negation) {
        return getFreeVars_helper(formula.target, boundVars);
    }
    if (formula instanceof Conjunction) {
        let freeVarSet = new Set();
        for (let conjunct of formula.conjuncts) {
            freeVarSet = new Set([...freeVarSet, ...getFreeVars_helper(conjunct, boundVars)]);
        }
        return freeVarSet;
    }
    if (formula instanceof Disjunction) {
        let freeVarSet = new Set();
        for (let disjunct of formula.disjuncts) {
            freeVarSet = new Set([...freeVarSet, ...getFreeVars_helper(disjunct, boundVars)]);
        }
        return freeVarSet;
    }
    if (formula instanceof Biconditional || formula instanceof Implication) {
        return new Set([...getFreeVars_helper(formula.antecedent, boundVars), ...getFreeVars_helper(formula.consequent, boundVars)]);
    }
    console.error("Tried to get free variables of a Formula with invalid type:", formula);
    return new Set();
}
function getFreeVars(formula) {
    return getFreeVars_helper(formula, new Set());
}
function hasFreeVars(formula) {
    let freeVarSet = getFreeVars(formula);
    return freeVarSet.size !== 0;
}
export { getQuantifiersInOrder, getFreeVars, hasFreeVars };
//# sourceMappingURL=general.js.map