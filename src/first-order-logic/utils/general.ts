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

// Returns the original formula prefixed with universal quantifiers for each of its free variables 
function bindFreeVars(formula : Formula) : Formula {
    let freeVarSet : Set<string> = getFreeVars(formula);
    
    let resultFormula = formula;
    
    // Sorts the list and traverses it in reverse order to result in free variables quantified in alphabetical order.
        // Done purely for reasons of preference. Others should feel free to remove/edit this process.
    let alphSortedFreeVars : string[] = [...freeVarSet].sort();
    for (let i = alphSortedFreeVars.length-1; i >= 0; i--) {
        let freeVarName : string = alphSortedFreeVars[i];
        resultFormula = new QuantifiedFormula(Quantifier.Universal, new Variable(freeVarName), resultFormula);
    }
    
    return resultFormula;
}

export {
    getQuantifiersInOrder,

    getFreeVars,

    bindFreeVars
}