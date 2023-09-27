import { ERROR_LITERAL, FALSE_LITERAL, Literal, TRUE_LITERAL } from "../../epilog-ts/classes/Literal.js";
import { Clause } from "../classes/Clause.js";
import { Conjunction } from "../classes/Conjunction.js";
import { Disjunction } from "../classes/Disjunction.js";
import { Negation } from "../classes/Negation.js";
import { toPCNF } from "./pnf.js";
// Normalize input via the following:
// A FALSE_LITERAL becomes a negated TRUE_LITERAL, and a negated FALSE_LITERAL becomes a positive TRUE_LITERAL
function normalizeLiteralForClause(literal) {
    if (literal.atom.toString() === FALSE_LITERAL.toString()) {
        if (literal.isNegated()) {
            return TRUE_LITERAL;
        }
        return new Literal(TRUE_LITERAL.atom, true);
    }
    return literal;
}
// Normalize input via the following:
// The negation of a Literal is converted into a negated Literal 
function normalizeNegationForClause(negation) {
    if (!(negation.target instanceof Literal)) {
        console.error("Could not normalize negation for clause - its target was not a Literal:", negation.toString());
        return ERROR_LITERAL;
    }
    return normalizeLiteralForClause(new Literal(negation.target.atom, true));
}
// Converts a Formula into a list of normalized clauses.
// Clauses are normalized via the helper functions normalizeLiteralForClause and normalizeNegationForClause
// Also converts negations of literals into literals with negative polarity.
// Normalization simplifies resolution by ensuring that only Literals occur in Clauses, and that only TRUE_LITERAL and its negated form will occur, never FALSE_LITERAL.
// Because of this, the only derived clause that indicates refutation is the empty clause.
function toClausal(initialFormula, cnfOptions = { algorithm: "tseitins" }) {
    let cnfFormula = toPCNF(initialFormula, false, cnfOptions);
    if (!(cnfFormula instanceof Conjunction)) {
        console.error("Could not convert formula to clausal form. toPCNF did not return a prefix-free cnf formula:", cnfFormula.toString());
        return [];
    }
    let clauseList = [];
    // Normalize the clauses
    for (let conjunct of cnfFormula.conjuncts) {
        if (conjunct instanceof Literal) {
            clauseList.push(new Clause([normalizeLiteralForClause(conjunct)]));
            continue;
        }
        if (conjunct instanceof Negation) {
            clauseList.push(new Clause([normalizeNegationForClause(conjunct)]));
            continue;
        }
        if (conjunct instanceof Disjunction) {
            let literalList = [];
            for (let disjunct of conjunct.disjuncts) {
                if (disjunct instanceof Literal) {
                    literalList.push(normalizeLiteralForClause(disjunct));
                    continue;
                }
                if (disjunct instanceof Negation) {
                    literalList.push(normalizeNegationForClause(disjunct));
                    continue;
                }
                console.error("Could not convert formula to clausal form. toPCNF did not return a cnf formula - contained the following Disjunction with a non-Literal, non-Negation disjunct:", conjunct.toString());
                return [];
            }
            clauseList.push(new Clause(literalList));
            continue;
        }
        console.error("Could not convert formula to clausal form. toPCNF did not return a cnf formula - contained the following conjunct that was not a Literal, Negation, or Disjunction:", conjunct.toString());
        return [];
    }
    return clauseList;
}
export { toClausal };
//# sourceMappingURL=clausal.js.map