import { ERROR_ATOM } from "../../epilog-ts/classes/Atom.js";
import { Literal } from "../../epilog-ts/classes/Literal.js";
import { Variable } from "../../epilog-ts/classes/Term.js";
import { Biconditional } from "../classes/Biconditional.js";
import { Conjunction } from "../classes/Conjunction.js";
import { Disjunction } from "../classes/Disjunction.js";
import { ERROR_FORMULA, Formula } from "../classes/Formula.js";
import { Implication } from "../classes/Implication.js";
import { Negation } from "../classes/Negation.js";
import { QuantifiedFormula, Quantifier } from "../classes/QuantifiedFormula.js";

// Computes the order in which quantifiers appear in the input formula, primarily for use when converting to prefix form, or when skolemizing.
// Traverses the formula in DFS order.
// Returns a list of pairs of (i) Quantifiers and (ii) Variables.
function getQuantifiersInOrder(formula : Formula) : [Quantifier, Variable][] {

    if (formula instanceof Literal) { 
        return [];
    }

    if (formula instanceof Negation) { 
        return getQuantifiersInOrder(formula.target);
    }

    if (formula instanceof Conjunction) { 
        let quantifiersList : [Quantifier, Variable][] = [];

        for (let conjunct of formula.conjuncts) {
            quantifiersList = [...quantifiersList, ...getQuantifiersInOrder(conjunct)];
        }

        return quantifiersList;
    }

    if (formula instanceof Disjunction) { 
        let quantifiersList : [Quantifier, Variable][] = [];

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

    console.error("Tried to get quantifiers in order of Formula without a valid type:",formula);
    return [];
}

function getFreeVars_helper(formula : Formula, boundVars : Set<string>) : Set<string> {

    let freeVars : Set<string> = new Set();

    // Literals can contain free vars, if they aren't bound by a quantifier above it
    if (formula instanceof Literal) {
        let varNames : Set<string> = formula.getVars();

        for (let literalVarName of varNames) {
            if (!boundVars.has(literalVarName)) {
                freeVars.add(literalVarName);
            }
        }

        return freeVars;
    }

    // A QuantifiedFormula can bind a variable
    if (formula instanceof QuantifiedFormula) {
        let quantVarName : string = formula.variable.name;

        // Get the free variables of the subformula, but with the quantified variable bound
        let subformulaFreeVars : Set<string> = getFreeVars_helper(formula.formula, new Set([...boundVars, quantVarName]));

        return subformulaFreeVars;
    }

    // All other formulae just gather the free variables of their subformulae

    if (formula instanceof Negation) {
        return getFreeVars_helper(formula.target, boundVars);
    }

    if (formula instanceof Conjunction) {
        let freeVarSet : Set<string> = new Set();

        for (let conjunct of formula.conjuncts) {
            freeVarSet = new Set([...freeVarSet, ...getFreeVars_helper(conjunct, boundVars)]);
        }
        
        return freeVarSet;
    }

    if (formula instanceof Disjunction) {
        let freeVarSet : Set<string> = new Set();

        for (let disjunct of formula.disjuncts) {
            freeVarSet = new Set([...freeVarSet, ...getFreeVars_helper(disjunct, boundVars)]);
        }
        
        return freeVarSet;
    }

    if (formula instanceof Biconditional || formula instanceof Implication) {
        
        return new Set([...getFreeVars_helper(formula.antecedent, boundVars), ...getFreeVars_helper(formula.consequent, boundVars)]);
    }

    console.error("Tried to get free variables of a Formula with invalid type:",formula);
    return new Set();
}

function getFreeVars(formula : Formula) : Set<string> {

    return getFreeVars_helper(formula, new Set());
}

function hasFreeVars(formula : Formula) : boolean {
    let freeVarSet : Set<string> = getFreeVars(formula);

    return freeVarSet.size !== 0;
}

// Requires the formula be closed (have no free variables)
function hasVarNameCollisions(formula : Formula) : boolean {
    if (hasFreeVars(formula)) { 
        console.error("Formula must have no free variables to determine whether variable name collisions are present:", getFreeVars(formula));
        return false;
    }

    let quantifierList : [Quantifier, Variable][] = getQuantifiersInOrder(formula);

    let varNameSet : Set<string> = new Set();

    for (let [quantifier, currVar] of quantifierList) {
        let varName : string = currVar.name;
        if (varNameSet.has(varName)) {
            return true;
        }

        varNameSet.add(varName);
    }

    return false;
}

// Determines whether the formula is in NNF (i.e. a formula where the only logical connectives are ∧, ∨, and ¬)
function isInNNF(formula : Formula) : boolean {
    if (formula instanceof Literal) {
        return true;
    }

    // Implications and Biconditionals cannot appear in an NNF formula.
    if (formula instanceof Implication || formula instanceof Biconditional) {
        return false;
    }

    // Negations must target non-negated literals.
    if (formula instanceof Negation) {
        if (formula.target instanceof Literal) {
            return !formula.target.isNegated();
        }

        return false;
    }

    // Conjunctions are in NNF iff each of its conjuncts is.
    if (formula instanceof Conjunction) {
        for (let conjunct of formula.conjuncts) {
            if (!isInNNF(conjunct)) {
                return false;
            }
        }
        return true;
    }

    // Disjunctions are in NNF iff each of its disjuncts is.
    if (formula instanceof Disjunction) {
        for (let disjunct of formula.disjuncts) {
            if (!isInNNF(disjunct)) {
                return false;
            }
        }
        return true;
    }

    // A QuantifiedFormula is in NNF iff the scope of its quantification is.
    if (formula instanceof QuantifiedFormula) {
        return isInNNF(formula.formula);
    }

    console.error("Trying to determine whether Formula is in NNF, but formula is not a valid type:",formula);
    return false;
}

export {
    getQuantifiersInOrder,

    getFreeVars,
    hasFreeVars,

    hasVarNameCollisions,

    isInNNF
}