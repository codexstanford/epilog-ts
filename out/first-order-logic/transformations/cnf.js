import { Atom } from "../../epilog-ts/classes/Atom.js";
import { Literal } from "../../epilog-ts/classes/Literal.js";
import { Predicate } from "../../epilog-ts/classes/Predicate.js";
import { Biconditional } from "../classes/Biconditional.js";
import { Conjunction } from "../classes/Conjunction.js";
import { Disjunction } from "../classes/Disjunction.js";
import { ERROR_FORMULA } from "../classes/Formula.js";
import { Implication } from "../classes/Implication.js";
import { Negation } from "../classes/Negation.js";
import { QuantifiedFormula } from "../classes/QuantifiedFormula.js";
import { getQuantifiersInOrder, isInNNF } from "../utils/general.js";
const ERROR_CONJUNCTION = new Conjunction([ERROR_FORMULA]);
// Recursive helper function
// Expects the following inputs:
// (i) formula: a quantifier-free NNF formula to convert to CNF form, 
// (ii) tseitinPropVarForFormula: the new propositional variable (0-ary atom) introduced for the internal node that is (i),
// (iii) tseitinVarCounter: a counter indicating the number of variables that have been introduced via Tseitin's transformation thus var
// Returns (i) the input formula in CNF form and (ii) the updated tseitinVarCounter
// Internal nodes must know the tseitinvars corresponding to their children to ensure proper reformulation
// Note: since our Disjunctions and Conjunctions are flat (i.e. they are n-ary connectives, not just binary), 
// we use the more efficient CNF encoding mentioned on page 13 of Decision Procedures - Kroening and Strichman: https://link.springer.com/content/pdf/10.1007/978-3-540-74105-3.pdf.
// For conjunction (resp. disjunction) with n conjuncts (resp. disjuncts), this allows us to encode it with one tseitinvar and n+1 clauses, rather than n-1 tseitinvars and 3(n-1) clauses.
function toCNF_helper(formula, tseitinPropVarForFormula, tseitinVarCounter) {
    // Internal node - Conjunction
    if (formula instanceof Conjunction) {
        // The empty Conjunction should never appear, as the Conjunction constructor adds the TRUE_LITERAL when given an empty list of conjuncts.
        if (formula.conjuncts.length === 0) {
            console.error("Tseitin's transformation expects no empty Conjunctions. Empty Conjunctions should contain the TRUE_LITERAL, per the Conjunction constructor.");
            return [ERROR_CONJUNCTION, 0];
        }
        let conjunctInCNFAccumulator = [];
        let tseitinVarConjuncts = [];
        let finalTseitinVarConjunctDisjuncts = [new Literal(tseitinPropVarForFormula, false)];
        // For each conjunct, convert it to CNF. Then add the conjuncts from the result to the accumulator. 
        for (let currConjunct of formula.conjuncts) {
            // Must be in NNF, and we check here because we look ahead to specially handle Literals and Negations when they are conjuncts.
            if (currConjunct instanceof Negation && !(currConjunct.target instanceof Literal)) {
                console.error("Tseitin's transformation expected formula to be in NNF, but contains non-atomic negation:", currConjunct.toString());
                return [ERROR_CONJUNCTION, 0];
            }
            if (currConjunct instanceof Negation && currConjunct.target instanceof Literal && currConjunct.target.isNegated()) {
                console.error("Tseitin's transformation expected formula to be in NNF, but contains a double negation:", currConjunct.toString());
                return [ERROR_CONJUNCTION, 0];
            }
            // Special case: Don't assign tseitinvars to leaf nodes. Already in CNF. And when negating, need to be careful to not double negate.
            if (currConjunct instanceof Literal || currConjunct instanceof Negation) {
                // Directly add the two-literal clause for this conjunct.
                tseitinVarConjuncts.push(new Disjunction([new Negation(new Literal(tseitinPropVarForFormula, false)), currConjunct]));
                // Add the negation of the literal to the final clause
                // If it's a Literal, handle differently depending on whether it's positive or negative.
                if (currConjunct instanceof Literal) {
                    // If negative, flip to positive
                    if (currConjunct.isNegated()) {
                        finalTseitinVarConjunctDisjuncts.push(new Literal(currConjunct.atom, false));
                        continue;
                    }
                    // If positive, negate it
                    finalTseitinVarConjunctDisjuncts.push(new Negation(currConjunct));
                    continue;
                }
                // If it's a negation, add its target
                finalTseitinVarConjunctDisjuncts.push(currConjunct.target);
                continue;
            }
            // --- By this point, the conjunct must be a Conjunction or a Disjunction, and so should be assigned a tseitinvar.
            // Create a tseitinvar for the internal node that is the conjunct.
            let newTseitinVar = new Atom(new Predicate("tseitinvar" + tseitinVarCounter), []);
            tseitinVarCounter++;
            // Convert to CNF.
            let currConjunctInCNF = ERROR_CONJUNCTION;
            [currConjunctInCNF, tseitinVarCounter] = toCNF_helper(currConjunct, newTseitinVar, tseitinVarCounter);
            // Accumulate the conjuncts.
            conjunctInCNFAccumulator = [...conjunctInCNFAccumulator, ...currConjunctInCNF.conjuncts];
            // Add the two-literal clause for this conjunct.
            tseitinVarConjuncts.push(new Disjunction([new Negation(new Literal(tseitinPropVarForFormula, false)), new Literal(newTseitinVar, false)]));
            // Add the negation of the new tseitinvar to the final clause
            finalTseitinVarConjunctDisjuncts.push(new Negation(new Literal(newTseitinVar, false)));
        }
        let cnfResult = new Conjunction([...tseitinVarConjuncts, new Disjunction(finalTseitinVarConjunctDisjuncts), ...conjunctInCNFAccumulator]);
        return [cnfResult, tseitinVarCounter];
    }
    // Internal node - Disjunction
    if (formula instanceof Disjunction) {
        // The empty Disjunction should never appear, as the Disjunction constructor adds the FALSE_LITERAL when given an empty list of disjuncts.
        if (formula.disjuncts.length === 0) {
            console.error("Tseitin's transformation expects no empty Disjunctions. Empty Disjunctions should contain the FALSE_LITERAL, per the Disjunction constructor.");
            return [ERROR_CONJUNCTION, 0];
        }
        let disjunctInCNFAccumulator = [];
        let tseitinVarConjuncts = [];
        let finalTseitinVarConjunctDisjuncts = [new Negation(new Literal(tseitinPropVarForFormula, false))];
        // For each disjunct, convert it to CNF. Then add the conjuncts from the result to the accumulator. 
        for (let currDisjunct of formula.disjuncts) {
            // Must be in NNF, and we check here because we look ahead to specially handle Literals and Negations when they are disjuncts.
            if (currDisjunct instanceof Negation && !(currDisjunct.target instanceof Literal)) {
                console.error("Tseitin's transformation expected formula to be in NNF, but contains non-atomic negation:", currDisjunct.toString());
                return [ERROR_CONJUNCTION, 0];
            }
            if (currDisjunct instanceof Negation && currDisjunct.target instanceof Literal && currDisjunct.target.isNegated()) {
                console.error("Tseitin's transformation expected formula to be in NNF, but contains a double negation:", currDisjunct.toString());
                return [ERROR_CONJUNCTION, 0];
            }
            // Special case: Don't assign tseitinvars to leaf nodes. Already in CNF. And when negating, need to be careful to not double negate.
            if (currDisjunct instanceof Literal || currDisjunct instanceof Negation) {
                // Add the literal to the final clause.
                finalTseitinVarConjunctDisjuncts.push(currDisjunct);
                // Construct the two-literal clause for this disjunct, containing the current tseitinvar and the negation of the disjunct.
                // If it's a Literal, handle differently depending on whether it's positive or negative.
                if (currDisjunct instanceof Literal) {
                    // If negative, flip to positive.
                    if (currDisjunct.isNegated()) {
                        tseitinVarConjuncts.push(new Disjunction([new Literal(tseitinPropVarForFormula, false), new Literal(currDisjunct.atom, false)]));
                        continue;
                    }
                    // If positive, negate it.
                    tseitinVarConjuncts.push(new Disjunction([new Literal(tseitinPropVarForFormula, false), new Negation(currDisjunct)]));
                    continue;
                }
                // If it's a negation, add its target.
                tseitinVarConjuncts.push(new Disjunction([new Literal(tseitinPropVarForFormula, false), currDisjunct.target]));
                continue;
            }
            // --- By this point, the disjunct must be a Conjunction or a Disjunction, and so should be assigned a tseitinvar.
            // Create a tseitinvar for the internal node that is the disjunct.
            let newTseitinVar = new Atom(new Predicate("tseitinvar" + tseitinVarCounter), []);
            tseitinVarCounter++;
            // Convert to CNF.
            let currDisjunctInCNF = ERROR_CONJUNCTION;
            [currDisjunctInCNF, tseitinVarCounter] = toCNF_helper(currDisjunct, newTseitinVar, tseitinVarCounter);
            // Accumulate the conjuncts.
            disjunctInCNFAccumulator = [...disjunctInCNFAccumulator, ...currDisjunctInCNF.conjuncts];
            // Add the two-literal clause for this disjunct.
            tseitinVarConjuncts.push(new Disjunction([new Literal(tseitinPropVarForFormula, false), new Negation(new Literal(newTseitinVar, false))]));
            // Add the new tseitinvar to the final clause
            finalTseitinVarConjunctDisjuncts.push(new Literal(newTseitinVar, false));
        }
        let cnfResult = new Conjunction([...tseitinVarConjuncts, new Disjunction(finalTseitinVarConjunctDisjuncts), ...disjunctInCNFAccumulator]);
        return [cnfResult, tseitinVarCounter];
    }
    // Note: Because Literals and negated literals are specially handled in the Conjunction and Disjunction cases to reduce the number of added tseitinvars,
    // the following two cases are only reached when the input formula to toCNF is a Literal or a Negation.
    // Leaf node - Literal
    if (formula instanceof Literal) {
        return [new Conjunction([formula]), tseitinVarCounter];
    }
    // Leaf node - Negation, if atomic. Error otherwise.
    if (formula instanceof Negation) {
        if (!(formula.target instanceof Literal)) {
            console.error("Tseitin's transformation expected formula to be in NNF, but contains non-atomic negation:", formula.toString());
            return [ERROR_CONJUNCTION, 0];
        }
        if (formula.target.isNegated()) {
            console.error("Tseitin's transformation expected formula to be in NNF, but contains a double negation:", formula.toString());
            return [ERROR_CONJUNCTION, 0];
        }
        return [new Conjunction([formula]), tseitinVarCounter];
    }
    // Expecting NNF Formula
    if (formula instanceof Implication || formula instanceof Biconditional) {
        console.error("Tseitin's transformation expected formula to be in NNF, but contains Implication or Biconditional:", formula.toString());
        return [ERROR_CONJUNCTION, 0];
    }
    // Expecting QF Formula
    if (formula instanceof QuantifiedFormula) {
        console.error("Cannot perform Tseitin's transformation on a QuantifiedFormula:", formula.toString());
        return [ERROR_CONJUNCTION, 0];
    }
    console.error("Cannot perform Tseitin's transformation on a Formula without a valid type:", formula);
    return [ERROR_CONJUNCTION, 0];
}
// Converts a quantifier-free, NNF Formula into an equisatisfiable Formula in CNF form using Tseitin's transformation
function toCNF(initialFormula) {
    if (getQuantifiersInOrder(initialFormula).length !== 0) {
        console.error("Formula must be quantifier-free to convert to CNF", initialFormula.toString(), "\nYou may want the toPCNF function instead.");
        return ERROR_CONJUNCTION;
    }
    if (!isInNNF(initialFormula)) {
        console.error("Formula must be in NNF to perform Tseitin's transformation:", initialFormula.toString());
        return ERROR_CONJUNCTION;
    }
    // A unit clause is already in CNF form.
    if (initialFormula instanceof Literal) {
        return new Conjunction([initialFormula]);
    }
    // We must assert that the unit clause containing just the tseitinvar corresponding to the root of the Formula is true.
    let topTseitinVar = new Atom(new Predicate("tseitinvar0"), []);
    let cnfFormula = toCNF_helper(initialFormula, topTseitinVar, 1)[0];
    return new Conjunction([new Literal(topTseitinVar, false), ...cnfFormula.conjuncts]);
}
export { toCNF };
//# sourceMappingURL=cnf.js.map