import { QuantifiedFormula, Quantifier } from "../classes/QuantifiedFormula.js";
import { getQuantifiersInOrder } from "../utils/general.js";
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
// options allows the user to specify the following:
// algorithm: The algorithm that toCNF will use to convert the input formula to CNF. Either Tseitin's algorithm, or the standard algorithm can be used
function toPCNF(initialFormula, includePrefix = true, cnfOptions = { algorithm: "tseitins" }) {
    // Convert to NNF
    let resultFormula = toNNF(initialFormula);
    // Bind all free variables
    resultFormula = bindFreeVars(resultFormula);
    // Rename all distinct variables
    resultFormula = standardizeVarNames(resultFormula);
    // Skolemize
    resultFormula = skolemize(resultFormula);
    // Compute the scoping constraints for each quantifier (just a list of quantifier-variable pairs, gathered in DFS order)
    let quantifiersInOrder = getQuantifiersInOrder(resultFormula);
    // Remove all Quantifiers
    resultFormula = removeQuantifiers(resultFormula);
    // Convert into cnf via Tseitin's
    resultFormula = toCNF(resultFormula, cnfOptions);
    // Just include the target of the universal quantifier prefix
    if (!includePrefix) {
        return resultFormula;
    }
    // Otherwise, re-add all quantifiers under Scoping constraints. After skolemization, should all be Universal.
    let currQuantifier = Quantifier.Existential;
    let currVariable;
    for (let i = quantifiersInOrder.length - 1; i >= 0; i--) {
        [currQuantifier, currVariable] = quantifiersInOrder[i];
        resultFormula = new QuantifiedFormula(currQuantifier, currVariable, resultFormula);
    }
    return resultFormula;
}
export { toPCNF };
//# sourceMappingURL=pnf.js.map