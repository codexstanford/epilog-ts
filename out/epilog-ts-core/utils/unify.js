import { Literal } from "../../epilog-ts-core/classes/Literal.js";
import { Substitution } from "../../epilog-ts-core/classes/Substitution.js";
import { CompoundTerm, Symbol, Variable, applySubtoTerm } from "../../epilog-ts-core/classes/Term.js";
// Recursive helper function to unify Terms
function tryGetMGU_helper(term1, term2, currSub) {
    term1 = applySubtoTerm(currSub, term1);
    term2 = applySubtoTerm(currSub, term2);
    // Both are Symbols
    if (term1 instanceof Symbol &&
        term2 instanceof Symbol) {
        // (2) Different Symbols
        if (term1.name !== term2.name) {
            return false;
        }
        // (1) Same Symbol
        return currSub;
    }
    // (2) Cannot unify a Symbol and a CompoundTerm
    if ((term1 instanceof Symbol &&
        term2 instanceof CompoundTerm) ||
        (term1 instanceof CompoundTerm &&
            term2 instanceof Symbol)) {
        return false;
    }
    // (3) The variables are equal under the Substitution
    if (term1 instanceof Variable &&
        term2 instanceof Variable &&
        term1.name === term2.name) {
        return currSub;
    }
    // (4) Try to unify a Variable with any other Term
    if (term1 instanceof Variable) {
        // Variable occurs in the other arg
        if (term2.getVars().has(term1.name)) {
            return false;
        }
        // Replace the Variable with the other arg
        return Substitution.compose(currSub, new Substitution(new Map([[term1.name, term2]])));
    }
    // (4) Same for other term
    if (term2 instanceof Variable) {
        // Variable occurs in the other arg
        if (term1.getVars().has(term2.name)) {
            return false;
        }
        // Replace the Variable with the other arg
        return Substitution.compose(currSub, new Substitution(new Map([[term2.name, term1]])));
    }
    // Both are CompoundTerms. If they agree in Constructor and arity, try to unify their arguments.
    if (term1 instanceof CompoundTerm &&
        term2 instanceof CompoundTerm) {
        // (6) If they disagree on Constructor or arity, they cannot be unified.
        if (term1.constr.name !== term2.constr.name) {
            return false;
        }
        if (term1.args.length !== term2.args.length) {
            return false;
        }
        // (5) Try to unify their arguments
        for (let j = 0; j < term1.args.length; j++) {
            let currArg1 = term1.args[j];
            let currArg2 = term2.args[j];
            let tryUnifyResult = tryGetMGU_helper(currArg1, currArg2, currSub);
            // Could not unify arguments
            if (tryUnifyResult === false) {
                return false;
            }
            // Succeeded in unifying arguments - update current substitution to be the unifying substitution. 
            currSub = tryUnifyResult;
        }
        return currSub;
    }
    console.error("Could not unify terms - invalid situation:", term1.toString(), "and", term2.toString());
    return false;
}
// Attempts to unify lit1 and lit2. If succeeds, returns the most general unifier. If fails, returns false. 
// lit1 and lit2 must not have any variables in common, and must agree in their arity if they have the same predicate.
function tryGetMGU_literal(lit1, lit2) {
    // Must agree on polarity.
    if (lit1.isNegated() !== lit2.isNegated()) {
        return false;
    }
    // Must agree on predicate.
    if (lit1.atom.pred.name !== lit2.atom.pred.name) {
        return false;
    }
    // Must agree on arity.
    if (lit1.atom.args.length !== lit2.atom.args.length) {
        console.error("Cannot find MGU - Literals with same predicate have different arity:", lit1.toString(), "and", lit2.toString());
        return false;
    }
    let mgu = new Substitution();
    // Attempt to unify the arguments, building the mgu along the way
    for (let i = 0; i < lit1.atom.args.length; i++) {
        // Must apply current Substitution to each argument 
        let currLit1Arg = applySubtoTerm(mgu, lit1.atom.args[i]);
        let currLit2Arg = applySubtoTerm(mgu, lit2.atom.args[i]);
        let argUnificationResult = tryGetMGU_helper(currLit1Arg, currLit2Arg, mgu);
        // Failed to unify arguments
        if (argUnificationResult === false) {
            return false;
        }
        // Succeeded in unifying arguments - update the mgu.
        mgu = argUnificationResult;
    }
    return mgu;
}
// Attempts to unify expr1 and expr2. If succeeds, returns the most general unifier. If fails, returns false. 
// expr1 and expr2 must not have any variables in common.
// An implementation of the most general unifier algorithm from the Logic Programming textbook by Michael Genesereth and Vinay Chaudhri: http://logicprogramming.stanford.edu/notes/chapter_08.html
function tryGetMGU(expr1, expr2) {
    // expr1 and expr2 must not have any Variables in common
    let expr1Vars = expr1.getVars();
    let expr2Vars = expr2.getVars();
    for (let varName of expr1Vars) {
        if (expr2Vars.has(varName)) {
            console.error("Cannot find MGU - Expressions must have disjoint sets of Variables:", expr1.toString(), "and", expr2.toString());
            return false;
        }
    }
    if (expr1 instanceof Literal && expr2 instanceof Literal) {
        return tryGetMGU_literal(expr1, expr2);
    }
    // Cannot unify a Literal and a Term
    if (expr1 instanceof Literal || expr2 instanceof Literal) {
        return false;
    }
    return tryGetMGU_helper(expr1, expr2, new Substitution());
}
export { tryGetMGU };
//# sourceMappingURL=unify.js.map