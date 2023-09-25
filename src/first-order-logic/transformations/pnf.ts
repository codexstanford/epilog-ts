import { ERROR_TERM, Variable } from "../../epilog-ts/classes/Term.js";
import { ERROR_FORMULA, Formula } from "../classes/Formula.js";
import { QuantifiedFormula, Quantifier } from "../classes/QuantifiedFormula.js";
import { getFreeVars, getQuantifiersInOrder } from "../utils/general.js";
import { bindFreeVars, removeQuantifiers } from "./general.js";
import { standardizeVarNames } from "../utils/standardize.js";
import { toNNF } from "./nnf.js";
import { skolemize } from "./skolemize.js";
import { toCNF } from "./cnf.js";

// Converts input formula into prenex CNF
    // Based on
        // (i) the algorithm on page 52 of the Calculus of Computation textbook by Bradley and Manna: https://community.wvu.edu/~krsubramani/courses/backupcourses/dm2Spr2013/coursetext/CalcofComp.pdf
        // (ii) the algorithm provided in lecture notes for Stanford's Autumn 2022 course, CS 257: Automated Reasoning
    // If includePrefix is false, does not add the prefix that universally quantifies the variables in the main formula.
function toPCNF(initialFormula: Formula, includePrefix: boolean = true) : Formula {
    // Convert to NNF
    let resultFormula = toNNF(initialFormula);

    // Bind all free variables
    resultFormula = bindFreeVars(resultFormula);

    // Rename all distinct variables
    resultFormula = standardizeVarNames(resultFormula);

    // Skolemize
    resultFormula = skolemize(resultFormula);

    // Compute the scoping constraints for each quantifier (just a list of quantifier-variable pairs, gathered in DFS order)
    let quantifiersInOrder : [Quantifier, Variable][] = getQuantifiersInOrder(resultFormula);

    // Remove all Quantifiers
    resultFormula = removeQuantifiers(resultFormula);

    // Convert into clausal form via Tseitin's
    resultFormula = toCNF(resultFormula);

    // Just include the target of the universal quantifier prefix
    if (!includePrefix) {
        return resultFormula;
    }

    // Otherwise, re-add all quantifiers under Scoping constraints. After skolemization, should all be Universal.
    let currQuantifier : Quantifier = Quantifier.Existential;
    let currVariable : Variable;
    for (let i = quantifiersInOrder.length-1; i >=0; i--) {
        [currQuantifier, currVariable] = quantifiersInOrder[i];
        resultFormula = new QuantifiedFormula(currQuantifier, currVariable, resultFormula);
    }

    return resultFormula;
}

export {
    toPCNF
}