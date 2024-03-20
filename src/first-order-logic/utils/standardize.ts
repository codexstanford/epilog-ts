import { Literal } from "../../epilog-ts-core/classes/Literal.js";
import { Substitution } from "../../epilog-ts-core/classes/Substitution.js";
import { Term, Variable } from "../../epilog-ts-core/classes/Term.js";
import { Biconditional } from "../classes/Biconditional.js";
import { Conjunction } from "../classes/Conjunction.js";
import { Disjunction } from "../classes/Disjunction.js";
import { ERROR_FORMULA, Formula } from "../classes/Formula.js";
import { Implication } from "../classes/Implication.js";
import { Negation } from "../classes/Negation.js";
import { QuantifiedFormula, Quantifier } from "../classes/QuantifiedFormula.js";
import { getFreeVars, hasFreeVars } from "./general.js";



// Recursive function to rename variables in a formula that may have name collisions. Requires the formula to have no free variables.
    // Parses the formula in DFS order
// Returns a pair containing (i) the substituted formula and (ii) the number of distinct variables that have been parsed.
function standardizeVarNames_helper(initialFormula : Formula, varCounter : number, sub : Substitution) : [Formula, number] {
    
    if (initialFormula instanceof QuantifiedFormula) {
        let varName : string = initialFormula.variable.name; 
        
        let newVar : Variable = new Variable("V" + varCounter);
        varCounter++;
        
        let subbedResult : Formula = ERROR_FORMULA;

        // If already a substitution for the variable, input is a nested quantifier that quantifies over a distinct variable with the same name as another 
        if (sub.hasSub(varName)) {
            let oldVar : Term = sub.getSub(varName);

            sub.setSub(varName, newVar);

            [subbedResult, varCounter] = standardizeVarNames_helper(initialFormula.formula, varCounter, sub);
            
            // Restore the old substitution
            sub.setSub(varName, oldVar);
        }
        else {
            // Otherwise, a new variable is being bound and we should delete the introduced substitution
            sub.setSub(varName, newVar);
    
            [subbedResult, varCounter] = standardizeVarNames_helper(initialFormula.formula, varCounter, sub);

            // Not strictly necessary, but keeps the substitution clean
            sub.deleteSub(varName);
        }
        
        return [new QuantifiedFormula(initialFormula.quantifier, newVar, subbedResult), varCounter];
    }

    if (initialFormula instanceof Literal) {
        let updatedLiteral : Literal = Literal.applySub(sub, initialFormula);

        return [updatedLiteral, varCounter];
    }

    if (initialFormula instanceof Negation) {
        let updatedTarget : Formula = ERROR_FORMULA;
        [updatedTarget, varCounter] = standardizeVarNames_helper(initialFormula.target, varCounter, sub);

        return [new Negation(updatedTarget), varCounter];
    }

    if (initialFormula instanceof Conjunction) {
        let modifiedConjuncts : Formula[] = [];

        // Standardize each conjunct and update the varCounter along the way
        for (let conjunct of initialFormula.conjuncts) {
            let updatedConjunct : Formula = ERROR_FORMULA;
            [updatedConjunct, varCounter] = standardizeVarNames_helper(conjunct, varCounter, sub); 

            modifiedConjuncts.push(updatedConjunct);
        }

        return [new Conjunction(modifiedConjuncts), varCounter];
    }
    
    if (initialFormula instanceof Disjunction) {
        let modifiedDisjuncts : Formula[] = [];

        // Standardize each disjunct and update the varCounter along the way
        for (let disjunct of initialFormula.disjuncts) {
            let updatedDisjunct : Formula = ERROR_FORMULA;
            [updatedDisjunct, varCounter] = standardizeVarNames_helper(disjunct, varCounter, sub); 

            modifiedDisjuncts.push(updatedDisjunct);
        }

        return [new Disjunction(modifiedDisjuncts), varCounter];
    }

    if (initialFormula instanceof Implication) {
        let updatedAntecedent : Formula = ERROR_FORMULA;
        let updatedConsequent : Formula = ERROR_FORMULA;
        [updatedAntecedent, varCounter] = standardizeVarNames_helper(initialFormula.antecedent, varCounter, sub);
        [updatedConsequent, varCounter] = standardizeVarNames_helper(initialFormula.consequent, varCounter, sub);

        return [new Implication(updatedAntecedent, updatedConsequent), varCounter];
    }

    if (initialFormula instanceof Biconditional) {
        let updatedAntecedent : Formula = ERROR_FORMULA;
        let updatedConsequent : Formula = ERROR_FORMULA;
        [updatedAntecedent, varCounter] = standardizeVarNames_helper(initialFormula.antecedent, varCounter, sub);
        [updatedConsequent, varCounter] = standardizeVarNames_helper(initialFormula.consequent, varCounter, sub);

        return [new Biconditional(updatedAntecedent, updatedConsequent), varCounter];
    }

    console.error("Trying to standardize a Formula with an invalid type:", initialFormula);
    return [ERROR_FORMULA, varCounter];
}

// Rename each variable to have a unique name of the form "V{num}".
// Requires that the input formula be closed (have no free variables).
function standardizeVarNames(initialFormula : Formula) : Formula {

    if (hasFreeVars(initialFormula)) {
        console.error("Cannot standardize the variable names of a formula with free variables:", initialFormula.toString(), getFreeVars(initialFormula));
        return ERROR_FORMULA;
    }

    let emptySub = new Substitution();

    return standardizeVarNames_helper(initialFormula, 0, emptySub)[0];
}

export {
    standardizeVarNames
}