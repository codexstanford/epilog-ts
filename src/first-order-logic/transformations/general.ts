import { Literal } from "../../epilog-ts/classes/Literal.js";
import { Variable } from "../../epilog-ts/classes/Term.js";
import { Biconditional } from "../classes/Biconditional.js";
import { Conjunction } from "../classes/Conjunction.js";
import { Disjunction } from "../classes/Disjunction.js";
import { ERROR_FORMULA, Formula } from "../classes/Formula.js";
import { Implication } from "../classes/Implication.js";
import { Negation } from "../classes/Negation.js";
import { QuantifiedFormula, Quantifier } from "../classes/QuantifiedFormula.js";
import { getFreeVars } from "../utils/general.js";


// Removes all quantifiers from the input formula.
    // The Quantifiers and Variables of QuantifiedFormulae are removed, but their "formula" properties remain part of the formula. 
function stripQuantifiers(formula : Formula) : Formula {
    if (formula instanceof Literal) { 
        return formula;
    }

    if (formula instanceof Negation) { 
        return new Negation(stripQuantifiers(formula.target));
    }

    if (formula instanceof Conjunction) { 
        let strippedConjuncts : Formula[] = [];

        for (let conjunct of formula.conjuncts) {
            strippedConjuncts.push(stripQuantifiers(conjunct));
        }
        
        return new Conjunction(strippedConjuncts);
    }

    if (formula instanceof Disjunction) { 
        let strippedDisjuncts : Formula[] = [];

        for (let disjunct of formula.disjuncts) {
            strippedDisjuncts.push(stripQuantifiers(disjunct));
        }

        return new Disjunction(strippedDisjuncts);
    }

    if (formula instanceof Implication) {
        return new Implication(stripQuantifiers(formula.antecedent), stripQuantifiers(formula.consequent));
    }
    
    if (formula instanceof Biconditional) { 
        return new Biconditional(stripQuantifiers(formula.antecedent), stripQuantifiers(formula.consequent));
    }

    if (formula instanceof QuantifiedFormula) {
        return stripQuantifiers(formula.formula);
    }

    console.error("Tried to strip quantifiers from a Formula without a valid type:",formula);
    return ERROR_FORMULA;
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
    stripQuantifiers,

    bindFreeVars
}