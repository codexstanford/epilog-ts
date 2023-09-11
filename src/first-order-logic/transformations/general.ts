import { Variable } from "../../epilog-ts/classes/Term.js";
import { Formula } from "../classes/Formula.js";
import { QuantifiedFormula, Quantifier } from "../classes/QuantifiedFormula.js";
import { getFreeVars } from "../utils/general.js";


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
    bindFreeVars
}