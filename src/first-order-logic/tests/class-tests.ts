import { Atom } from "../../epilog-ts/classes/Atom.js";
import { Literal } from "../../epilog-ts/classes/Literal.js";
import { Predicate } from "../../epilog-ts/classes/Predicate.js";
import { Variable } from "../../epilog-ts/classes/Term.js";
import { printTestingMessage_Start, runTest } from "../../testing/testing.js";
import { Biconditional } from "../classes/Biconditional.js";
import { Clause } from "../classes/Clause.js";
import { Conjunction } from "../classes/Conjunction.js";
import { Disjunction } from "../classes/Disjunction.js";
import { Implication } from "../classes/Implication.js";
import { Negation } from "../classes/Negation.js";
import { QuantifiedFormula, Quantifier } from "../classes/QuantifiedFormula.js";

// Unit tests for {first-order-logic/classes} files
function runTests() : void {
    runDisjunctionTests();
    runConjunctionTests();
    runNegationTests();
    runImplicationTests();
    runBiconditionalTests();
    runQuantifiedFormulaTests();

    runClauseTests();
}

function runDisjunctionTests() : void {
    printTestingMessage_Start("Disjunction")

    runTest("Disjunction-empty-success", () => {
        let d1 : Disjunction = new Disjunction([]);
        return d1.toString() === '(false())' && 
        d1.disjuncts.length === 1;
    },{});

    runTest("Disjunction-unit-success", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let l1 : Literal = new Literal(atom1, false);
        let d1 : Disjunction = new Disjunction([l1]);
        return d1.toString() === '(p())' && 
        d1.disjuncts.length === 1 && 
        d1.disjuncts[0] === l1;
    },{});

    runTest("Disjunction-many-1-success", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let atom2: Atom = new Atom(new Predicate("q"), []);
        let l1 : Literal = new Literal(atom1, false);
        let l2 : Literal = new Literal(atom2, true);
        let d1 : Disjunction = new Disjunction([l1, l2]);
        return d1.toString() === '(p() ∨ ~q())' && 
        d1.disjuncts.length === 2 && 
        d1.disjuncts[0] === l1 && 
        d1.disjuncts[1] === l2;
    },{});

    runTest("Disjunction-many-2-success", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let atom2: Atom = new Atom(new Predicate("q"), []);
        let l1 : Literal = new Literal(atom1, false);
        let l2 : Literal = new Literal(atom2, true);
        let d1 : Disjunction = new Disjunction([l1, l2, l1]);
        return d1.toString() === '(p() ∨ ~q() ∨ p())' && 
        d1.disjuncts.length === 3 && 
        d1.disjuncts[0] === l1 && 
        d1.disjuncts[1] === l2 && 
        d1.disjuncts[2] === l1;
    },{});
}

function runConjunctionTests() : void {
    printTestingMessage_Start("Conjunction")

    runTest("Conjunction-empty-success", () => {
        let c1 : Conjunction = new Conjunction([]);
        return c1.toString() === '(true())'&& 
        c1.conjuncts.length === 1;
    },{});

    runTest("Conjunction-unit-success", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let l1 : Literal = new Literal(atom1, false);
        let c1 : Conjunction = new Conjunction([l1]);
        return c1.toString() === '(p())' && 
        c1.conjuncts.length === 1 &&
        c1.conjuncts[0] === l1;
    },{});

    runTest("Conjunction-many-1-success", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let atom2: Atom = new Atom(new Predicate("q"), []);
        let l1 : Literal = new Literal(atom1, false);
        let l2 : Literal = new Literal(atom2, true);
        let c1 : Conjunction = new Conjunction([l1, l2]);
        return c1.toString() === '(p() ∧ ~q())' && 
        c1.conjuncts.length === 2 &&
        c1.conjuncts[0] === l1 && 
        c1.conjuncts[1] === l2;
    },{});

    runTest("Conjunction-many-2-success", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let atom2: Atom = new Atom(new Predicate("q"), []);
        let l1 : Literal = new Literal(atom1, false);
        let l2 : Literal = new Literal(atom2, true);
        let c1 : Conjunction = new Conjunction([l1, l2, l1]);
        return c1.toString() === '(p() ∧ ~q() ∧ p())' && 
        c1.conjuncts.length === 3 &&
        c1.conjuncts[0] === l1 && 
        c1.conjuncts[1] === l2 && 
        c1.conjuncts[2] === l1;
    },{});

    runTest("Conjunction-complex-success", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let atom2: Atom = new Atom(new Predicate("q"), []);
        let l1 : Literal = new Literal(atom1, false);
        let l2 : Literal = new Literal(atom2, true);
        let c1: Conjunction = new Conjunction([new Literal(atom1, true), new Literal(atom2, false)]);
        let d : Disjunction = new Disjunction([l1, l2]);
        let c2: Conjunction = new Conjunction([d, c1]);
        return c2.toString() === '((p() ∨ ~q()) ∧ (~p() ∧ q()))' &&
        c2.conjuncts.length === 2 &&
        c2.conjuncts[0] === d && 
        c2.conjuncts[1] === c1;
    },{});
}

function runNegationTests() : void {
    printTestingMessage_Start("Negation")

    runTest("Negation-simple-success", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let l1 : Literal = new Literal(atom1, false);
        let n1 : Negation = new Negation(l1);
        return n1.toString() === '¬p()' && 
        n1.target === l1;
    },{});

    runTest("Negation-negated-success", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let l1 : Literal = new Literal(atom1, true);
        let n1 : Negation = new Negation(l1);
        return n1.toString() === '¬~p()' && 
        n1.target === l1;
    },{});

    runTest("Negation-complex-success", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let atom2: Atom = new Atom(new Predicate("q"), []);
        let l1 : Literal = new Literal(atom1, false);
        let l2 : Literal = new Literal(atom2, true);
        let c1: Conjunction = new Conjunction([new Literal(atom1, true), new Literal(atom2, false)]);
        let d : Disjunction = new Disjunction([l1, l2]);
        let c2: Conjunction = new Conjunction([d, c1]);
        let n1 : Negation = new Negation(c2);
        return n1.toString() === '¬((p() ∨ ~q()) ∧ (~p() ∧ q()))' && 
        n1.target === c2;
    },{});
}

function runImplicationTests() : void {
    printTestingMessage_Start("Implication")

    runTest("Implication-simple-success", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let atom2: Atom = new Atom(new Predicate("q"), []);
        let l1 : Literal = new Literal(atom1, false);
        let l2 : Literal = new Literal(atom2, false);
        let im1 : Implication = new Implication(l1, l2);
        return im1.toString() === '(p() ⇒ q())' && 
        im1.antecedent === l1 && 
        im1.consequent === l2;
    },{});

    runTest("Implication-complex-success", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let l1 : Literal = new Literal(atom1, true);
        let n1 : Negation = new Negation(l1);

        let atom2: Atom = new Atom(new Predicate("q"), []);
        let l2 : Literal = new Literal(atom2, true);
        let c1: Conjunction = new Conjunction([l1, new Literal(atom2, false)]);
        let d : Disjunction = new Disjunction([new Literal(atom1, false), l2]);
        let c2: Conjunction = new Conjunction([d, c1]);
        let im1 : Implication = new Implication(n1, c2);
        return im1.toString() === '(¬~p() ⇒ ((p() ∨ ~q()) ∧ (~p() ∧ q())))' && 
        im1.antecedent === n1 && 
        im1.consequent === c2;
    },{});

}

function runBiconditionalTests() : void {
    printTestingMessage_Start("Biconditional")

    runTest("Biconditional-simple-success", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let atom2: Atom = new Atom(new Predicate("q"), []);
        let l1 : Literal = new Literal(atom1, false);
        let l2 : Literal = new Literal(atom2, false);
        let b1 : Biconditional = new Biconditional(l1, l2);
        return b1.toString() === '(p() ⇔ q())' && 
        b1.antecedent === l1 && 
        b1.consequent === l2;
    },{});

    runTest("Biconditional-complex-success", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let l1 : Literal = new Literal(atom1, true);
        let n1 : Negation = new Negation(l1);

        let atom2: Atom = new Atom(new Predicate("q"), []);
        let l2 : Literal = new Literal(atom2, true);
        let c1: Conjunction = new Conjunction([l1, new Literal(atom2, false)]);
        let d : Disjunction = new Disjunction([new Literal(atom1, false), l2]);
        let c2: Conjunction = new Conjunction([d, c1]);
        let im1 : Implication = new Implication(n1, c2);
        let b1 : Biconditional = new Biconditional(im1, c2);

        return b1.toString() === '((¬~p() ⇒ ((p() ∨ ~q()) ∧ (~p() ∧ q()))) ⇔ ((p() ∨ ~q()) ∧ (~p() ∧ q())))' && 
        b1.antecedent === im1 && 
        b1.consequent === c2;
    },{});

}

function runQuantifiedFormulaTests() : void {
    printTestingMessage_Start("QuantifiedFormula")

    runTest("QuantifiedFormula-universal-simple-success", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let atom2: Atom = new Atom(new Predicate("q"), []);
        let l1 : Literal = new Literal(atom1, false);
        let l2 : Literal = new Literal(atom2, false);
        let b1 : Biconditional = new Biconditional(l1, l2);
        let u1 : QuantifiedFormula = new QuantifiedFormula(Quantifier.Universal, new Variable("X"), b1);
        return u1.toString() === '∀X.((p() ⇔ q()))' && 
        u1.formula === b1;
    },{});

    runTest("QuantifiedFormula-universal-simple-failure", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let atom2: Atom = new Atom(new Predicate("q"), []);
        let l1 : Literal = new Literal(atom1, false);
        let l2 : Literal = new Literal(atom2, false);
        let b1 : Biconditional = new Biconditional(l1, l2);
        let u1 : QuantifiedFormula = new QuantifiedFormula(Quantifier.Universal, new Variable("_"), b1);
        return u1.toString() === '∀_.((p() ⇔ q()))' && 
        u1.formula === b1;
    },{});

    runTest("QuantifiedFormula-universal-complex-success", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let l1 : Literal = new Literal(atom1, true);
        let n1 : Negation = new Negation(l1);

        let atom2: Atom = new Atom(new Predicate("q"), []);
        let l2 : Literal = new Literal(atom2, true);
        let c1: Conjunction = new Conjunction([l1, new Literal(atom2, false)]);
        let d : Disjunction = new Disjunction([new Literal(atom1, false), l2]);
        let c2: Conjunction = new Conjunction([d, c1]);
        let im1 : Implication = new Implication(n1, c2);
        let b1 : Biconditional = new Biconditional(im1, c2);
        let u1 : QuantifiedFormula = new QuantifiedFormula(Quantifier.Universal, new Variable("Var23"), b1);

        return u1.toString() === '∀Var23.(((¬~p() ⇒ ((p() ∨ ~q()) ∧ (~p() ∧ q()))) ⇔ ((p() ∨ ~q()) ∧ (~p() ∧ q()))))' && 
        u1.formula === b1;
    },{});

    runTest("QuantifiedFormula-existential-simple-success", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let atom2: Atom = new Atom(new Predicate("q"), []);
        let l1 : Literal = new Literal(atom1, false);
        let l2 : Literal = new Literal(atom2, false);
        let b1 : Biconditional = new Biconditional(l1, l2);
        let u1 : QuantifiedFormula = new QuantifiedFormula(Quantifier.Existential, new Variable("X"), b1);
        return u1.toString() === '∃X.((p() ⇔ q()))' && 
        u1.formula === b1;
    },{});

    runTest("QuantifiedFormula-existential-simple-failure", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let atom2: Atom = new Atom(new Predicate("q"), []);
        let l1 : Literal = new Literal(atom1, false);
        let l2 : Literal = new Literal(atom2, false);
        let b1 : Biconditional = new Biconditional(l1, l2);
        let u1 : QuantifiedFormula = new QuantifiedFormula(Quantifier.Existential, new Variable("_"), b1);
        return u1.toString() === '∃_.((p() ⇔ q()))' && 
        u1.formula === b1;
    },{});

    runTest("QuantifiedFormula-existential-complex-success", () => {
        let atom1: Atom = new Atom(new Predicate("p"), []);
        let l1 : Literal = new Literal(atom1, true);
        let n1 : Negation = new Negation(l1);

        let atom2: Atom = new Atom(new Predicate("q"), []);
        let l2 : Literal = new Literal(atom2, true);
        let c1: Conjunction = new Conjunction([l1, new Literal(atom2, false)]);
        let d : Disjunction = new Disjunction([new Literal(atom1, false), l2]);
        let c2: Conjunction = new Conjunction([d, c1]);
        let im1 : Implication = new Implication(n1, c2);
        let b1 : Biconditional = new Biconditional(im1, c2);
        let u1 : QuantifiedFormula = new QuantifiedFormula(Quantifier.Existential, new Variable("Var23"), b1);

        return u1.toString() === '∃Var23.(((¬~p() ⇒ ((p() ∨ ~q()) ∧ (~p() ∧ q()))) ⇔ ((p() ∨ ~q()) ∧ (~p() ∧ q()))))' && 
        u1.formula === b1;
    },{});
}

function runClauseTests() : void {
    printTestingMessage_Start("Clause");

    let x_var = new Variable('X');
    let y_var = new Variable('Y');

    let p_pred = new Predicate('p');
    let q_pred = new Predicate('q');
    let s_pred = new Predicate('s');

    let p_x = new Literal(new Atom(p_pred, [x_var]), false);
    let q_x = new Literal(new Atom(q_pred, [x_var]), false);
    let s_xy = new Literal(new Atom(s_pred, [x_var, y_var]), false);
    let neg_s_xy = new Literal(new Atom(s_pred, [x_var, y_var]), true);
    let neg_s_xy_repeat = new Literal(new Atom(s_pred, [x_var, y_var]), true);

    runTest("Clause-empty-success", () => {
        let c1 : Clause = new Clause([]);
        return c1.toString() === '{}' && 
        c1.literals.length === 0;
    },{});

    runTest("Clause-single non-Literal-failure", () => {
        let c1 : Clause = new Clause([new Negation(p_x)]);
        return c1.toString() === '{error()}' && 
        c1.literals.length === 1;
    },{});

    runTest("Clause-Literal and non-Literal-failure", () => {
        let c1 : Clause = new Clause([p_x, new Negation(p_x)]);
        return c1.toString() === '{error()}' && 
        c1.literals.length === 1;
    },{});

    runTest("Clause-single literal-success", () => {
        let c1 : Clause = new Clause([p_x]);
        return c1.toString() === '{p(X)}' && 
        c1.literals.length === 1;
    },{});

    runTest("Clause-single repeat literal-success", () => {
        let c1 : Clause = new Clause([p_x, p_x]);
        return c1.toString() === '{p(X)}' && 
        c1.literals.length === 1;
    },{});

    runTest("Clause-multiple literal sorted-success", () => {
        let c1 : Clause = new Clause([p_x, q_x]);
        return c1.toString() === '{p(X), q(X)}' && 
        c1.literals.length === 2;
    },{});

    runTest("Clause-multiple literal unsorted-success", () => {
        let c1 : Clause = new Clause([q_x, p_x]);
        return c1.toString() === '{p(X), q(X)}' && 
        c1.literals.length === 2;
    },{});

    runTest("Clause-multiple literal repeat unsorted-success", () => {
        let c1 : Clause = new Clause([p_x, q_x, p_x]);
        return c1.toString() === '{p(X), q(X)}' && 
        c1.literals.length === 2;
    },{});

    runTest("Clause-complex-success", () => {
        let c1 : Clause = new Clause([neg_s_xy, s_xy, p_x, neg_s_xy_repeat, p_x, q_x, p_x]);
        return c1.toString() === '{~s(X, Y), p(X), q(X), s(X, Y)}' && 
        c1.literals.length === 4;
    },{});

}

export {
    runTests
}
