import { Literal } from "../../epilog-ts-core/classes/Literal.js";
import { Substitution } from "../../epilog-ts-core/classes/Substitution.js";
import { Variable } from "../../epilog-ts-core/classes/Term.js";
import { tryGetMGU } from "../../epilog-ts-core/utils/unify.js";
import { Clause } from "../classes/Clause.js";
// Renames the Variables in each Clause such that the sets of Variables in each are disjoint.  
function makeVarNamesDisjoint(c1, c2) {
    let c1VarNames = c1.getVars();
    let c2VarNames = c2.getVars();
    let c1Sub = new Substitution();
    let c2Sub = new Substitution();
    let currNumVars = 0;
    for (let varName1 of c1VarNames) {
        c1Sub.setSub(varName1, new Variable("V" + currNumVars));
        currNumVars++;
    }
    for (let varName2 of c2VarNames) {
        c2Sub.setSub(varName2, new Variable("V" + currNumVars));
        currNumVars++;
    }
    return [Clause.applySub(c1Sub, c1), Clause.applySub(c2Sub, c2)];
}
// Perform resolution on two clauses, generating all possible clauses that could result from their resolution.
function resolve(c1, c2) {
    //console.log(c1.toString(), "and", c2.toString());
    // Replace the Variables in each Clause so the sets of Variables are disjoint.
    [c1, c2] = makeVarNamesDisjoint(c1, c2);
    let resolvents = [];
    for (let i = 0; i < c1.literals.length; i++) {
        let lit1 = c1.literals[i];
        for (let j = 0; j < c2.literals.length; j++) {
            let lit2 = c2.literals[j];
            // Cannot resolve literals with the same polarity
            if (lit1.isNegated() === lit2.isNegated()) {
                continue;
            }
            // Must be able to unify lit1 with the complement of lit2
            let mguResult = tryGetMGU(lit1, Literal.complement(lit2));
            if (mguResult === false) {
                continue;
            }
            // Can resolve, so compute the resolvent as the union of the remaining clause Literals, with the mgu applied.
            let resolventLiterals = [];
            for (let ii = 0; ii < c1.literals.length; ii++) {
                if (i === ii) {
                    continue;
                }
                resolventLiterals.push(Literal.applySub(mguResult, c1.literals[ii]));
            }
            for (let jj = 0; jj < c2.literals.length; jj++) {
                if (j === jj) {
                    continue;
                }
                resolventLiterals.push(Literal.applySub(mguResult, c2.literals[jj]));
            }
            resolvents.push(new Clause(resolventLiterals));
        }
    }
    return resolvents;
}
export { resolve };
//# sourceMappingURL=resolution.js.map