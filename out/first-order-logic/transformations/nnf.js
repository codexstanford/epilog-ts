import { FALSE_LITERAL, Literal, TRUE_LITERAL } from "../../epilog-ts/classes/Literal.js";
import { Biconditional } from "../classes/Biconditional.js";
import { Conjunction } from "../classes/Conjunction.js";
import { Disjunction } from "../classes/Disjunction.js";
import { ERROR_FORMULA } from "../classes/Formula.js";
import { Implication } from "../classes/Implication.js";
import { Negation } from "../classes/Negation.js";
import { QuantifiedFormula, Quantifier } from "../classes/QuantifiedFormula.js";
// Recursively rewrite the biconditionals and implications using ∧, ∨, and ¬
function rewriteWithoutBiconditionalsAndImplications(initialFormula) {
    // For a Biconditional or Implication, recursively call on its components and convert to using ∧, ∨, and ¬.
    // Otherwise, simply recursively call on its components.
    if (initialFormula instanceof Literal) {
        return initialFormula;
    }
    if (initialFormula instanceof Negation) {
        return new Negation(rewriteWithoutBiconditionalsAndImplications(initialFormula.target));
    }
    if (initialFormula instanceof QuantifiedFormula) {
        return new QuantifiedFormula(initialFormula.quantifier, initialFormula.variable, rewriteWithoutBiconditionalsAndImplications(initialFormula.formula));
    }
    // Rewrite each conjunct
    if (initialFormula instanceof Conjunction) {
        let rewrittenConjuncts = [];
        for (let conjunct of initialFormula.conjuncts) {
            rewrittenConjuncts.push(rewriteWithoutBiconditionalsAndImplications(conjunct));
        }
        return new Conjunction(rewrittenConjuncts);
    }
    // Rewrite each disjunct
    if (initialFormula instanceof Disjunction) {
        let rewrittenDisjuncts = [];
        for (let disjunct of initialFormula.disjuncts) {
            rewrittenDisjuncts.push(rewriteWithoutBiconditionalsAndImplications(disjunct));
        }
        return new Disjunction(rewrittenDisjuncts);
    }
    if (initialFormula instanceof Biconditional) {
        let rewrittenAntecedent = rewriteWithoutBiconditionalsAndImplications(initialFormula.antecedent);
        let rewrittenConsequent = rewriteWithoutBiconditionalsAndImplications(initialFormula.consequent);
        // Either each side of the biconditional is true, or each side is false
        let firstDisjunct = new Conjunction([rewrittenAntecedent, rewrittenConsequent]);
        let secondDisjunct = new Conjunction([new Negation(rewrittenAntecedent), new Negation(rewrittenConsequent)]);
        return new Disjunction([firstDisjunct, secondDisjunct]);
    }
    if (initialFormula instanceof Implication) {
        let rewrittenAntecedent = rewriteWithoutBiconditionalsAndImplications(initialFormula.antecedent);
        let rewrittenConsequent = rewriteWithoutBiconditionalsAndImplications(initialFormula.consequent);
        return new Disjunction([new Negation(rewrittenAntecedent), rewrittenConsequent]);
    }
    console.error("Trying to rewrite a Formula that is not a valid type:", initialFormula);
    return ERROR_FORMULA;
}
// Push negations inward using DeMorgan's laws until all negations only apply to literals, removing double negations along the way.
function makeNegationsAtomic(initialFormula) {
    // For a Negation, handle each case for its target.
    // Otherwise, simply recursively call on its components.
    if (initialFormula instanceof Negation) {
        const target = initialFormula.target;
        // If negating a negation, skip the target and simplify the target of the inner negation
        if (target instanceof Negation) {
            return makeNegationsAtomic(target.target);
        }
        if (target instanceof Literal) {
            // If a negated literal, flip its polarity
            if (target.isNegated()) {
                return new Literal(target.atom, false);
            }
            // If a boolean literal, invert it
            if (target.toString() === TRUE_LITERAL.toString()) {
                return FALSE_LITERAL;
            }
            if (target.toString() === FALSE_LITERAL.toString()) {
                return TRUE_LITERAL;
            }
            // Otherwise, return the input.
            return initialFormula;
        }
        // If a Biconditional or Implication, convert to using only ∧, ∨, and ¬, then make negations atomic on the result.
        if (target instanceof Biconditional || target instanceof Implication) {
            let rewrittenFormula = rewriteWithoutBiconditionalsAndImplications(target);
            return makeNegationsAtomic(new Negation(rewrittenFormula));
        }
        if (target instanceof QuantifiedFormula) {
            if (target.quantifier === Quantifier.Universal) {
                return new QuantifiedFormula(Quantifier.Existential, target.variable, makeNegationsAtomic(new Negation(target.formula)));
            }
            if (target.quantifier === Quantifier.Existential) {
                return new QuantifiedFormula(Quantifier.Universal, target.variable, makeNegationsAtomic(new Negation(target.formula)));
            }
            console.error("Trying to make negations atomic, but negated QuantifiedFormula does not have a valid Quantifier:", initialFormula);
            return ERROR_FORMULA;
        }
        // DeMorgan's Laws
        // Flip the conjunction, and push the negation inward on each former conjunct
        if (target instanceof Conjunction) {
            let negatedDisjuncts = [];
            for (let conjunct of target.conjuncts) {
                negatedDisjuncts.push(makeNegationsAtomic(new Negation(conjunct)));
            }
            return new Disjunction(negatedDisjuncts);
        }
        // Flip the disjunction, and push the negation inward on each former disjunct
        if (target instanceof Disjunction) {
            let negatedConjuncts = [];
            for (let disjunct of target.disjuncts) {
                negatedConjuncts.push(makeNegationsAtomic(new Negation(disjunct)));
            }
            return new Conjunction(negatedConjuncts);
        }
        console.error("Trying to make negations atomic, but negated Formula is not a valid type:", initialFormula);
        return ERROR_FORMULA;
    }
    if (initialFormula instanceof Literal) {
        return initialFormula;
    }
    if (initialFormula instanceof QuantifiedFormula) {
        return new QuantifiedFormula(initialFormula.quantifier, initialFormula.variable, makeNegationsAtomic(initialFormula.formula));
    }
    if (initialFormula instanceof Biconditional) {
        let simplifiedAntecedent = makeNegationsAtomic(initialFormula.antecedent);
        let simplifiedConsequent = makeNegationsAtomic(initialFormula.consequent);
        return new Biconditional(simplifiedAntecedent, simplifiedConsequent);
    }
    if (initialFormula instanceof Implication) {
        let simplifiedAntecedent = makeNegationsAtomic(initialFormula.antecedent);
        let simplifiedConsequent = makeNegationsAtomic(initialFormula.consequent);
        return new Implication(simplifiedAntecedent, simplifiedConsequent);
    }
    if (initialFormula instanceof Conjunction) {
        let simplifiedConjuncts = [];
        for (let conjunct of initialFormula.conjuncts) {
            simplifiedConjuncts.push(makeNegationsAtomic(conjunct));
        }
        return new Conjunction(simplifiedConjuncts);
    }
    if (initialFormula instanceof Disjunction) {
        let simplifiedDisjuncts = [];
        for (let disjunct of initialFormula.disjuncts) {
            simplifiedDisjuncts.push(makeNegationsAtomic(disjunct));
        }
        return new Disjunction(simplifiedDisjuncts);
    }
    console.error("Trying to make negations atomic on a Formula that is not a valid type:", initialFormula);
    return ERROR_FORMULA;
}
function toNNF(initialFormula) {
    // Rewrite biconditionals and implications
    let rewrittenFormula = rewriteWithoutBiconditionalsAndImplications(initialFormula);
    // Push negations inward using DeMorgan's and its extension to quantifiers, removing double negations along the way
    rewrittenFormula = makeNegationsAtomic(rewrittenFormula);
    return rewrittenFormula;
}
export { toNNF, rewriteWithoutBiconditionalsAndImplications, makeNegationsAtomic, };
//# sourceMappingURL=nnf.js.map