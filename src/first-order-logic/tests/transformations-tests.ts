import { Atom } from "../../epilog-ts/classes/Atom.js";
import { FALSE_LITERAL, Literal, TRUE_LITERAL } from "../../epilog-ts/classes/Literal.js";
import { Predicate } from "../../epilog-ts/classes/Predicate.js";
import { Variable } from "../../epilog-ts/classes/Term.js";
import { printTestingMessage_Start, runTest } from "../../testing/testing.js";
import { Biconditional } from "../classes/Biconditional.js";
import { Conjunction } from "../classes/Conjunction.js";
import { Disjunction } from "../classes/Disjunction.js";
import { ERROR_FORMULA, Formula } from "../classes/Formula.js";
import { Implication } from "../classes/Implication.js";
import { Negation } from "../classes/Negation.js";
import { QuantifiedFormula, Quantifier } from "../classes/QuantifiedFormula.js";
import { makeNegationsAtomic, rewriteWithoutBiconditionalsAndImplications } from "../transformations/nnf.js";
import { Symbol } from "../../epilog-ts/classes/Term.js";
import { standardizeVarNames } from "../utils/standardize.js";
import { bindFreeVars } from "../transformations/general.js";
import { skolemize } from "../transformations/skolemize.js";

// Unit tests for {first-order-log/transformations} files
function runTests() : void {
    runNNFTests();

    runSkolemizeTests();
}

function runNNFTests() : void {
    printTestingMessage_Start("NNF");

    runRewriteWithoutBiconditionalsAndImplicationsTests();

    runMakeNegationsAtomicTests();

    runNNFIntegrationTests();
}

function runRewriteWithoutBiconditionalsAndImplicationsTests() : void {
    
    printTestingMessage_Start("Rewriting without biconditionals and implications");

    let a1 = new Atom(new Predicate("a1"), []);
    let a2 = new Atom(new Predicate("a2"), []);
    let a3 = new Atom(new Predicate("a3"), []);

    let l1 = new Literal(a1, false);
    let l2 = new Literal(a2, false);
    let l3 = new Literal(a3, false);

    let n1 = new Literal(a1, true);
    let n2 = new Literal(a2, true);
    let n3 = new Literal(a3, true);

    let b1 = new Biconditional(l1, l2);
    let impl1 = new Implication(l1, l2);

    runTest("Rewrite-bicond-and-impl-Biconditional-simple-success", () => {
        let initialFormula : Formula = b1;
        let result : Formula = rewriteWithoutBiconditionalsAndImplications(initialFormula);

        return result.toString() === "((a1() ∧ a2()) ∨ (¬a1() ∧ ¬a2()))";
    },{});

    runTest("Rewrite-bicond-and-impl-Biconditional-nested-success", () => {
        let initialFormula : Formula = new Biconditional(impl1, impl1);
        let result : Formula = rewriteWithoutBiconditionalsAndImplications(initialFormula);

        return result.toString() === "(((¬a1() ∨ a2()) ∧ (¬a1() ∨ a2())) ∨ (¬(¬a1() ∨ a2()) ∧ ¬(¬a1() ∨ a2())))";
    },{});

    runTest("Rewrite-bicond-and-impl-Implication-simple-success", () => {
        let initialFormula : Formula = impl1;
        let result : Formula = rewriteWithoutBiconditionalsAndImplications(initialFormula);

        return result.toString() === "(¬a1() ∨ a2())";
    },{});

    runTest("Rewrite-bicond-and-impl-Implication-nested-success", () => {
        let initialFormula : Formula = new Implication(impl1, impl1);
        let result : Formula = rewriteWithoutBiconditionalsAndImplications(initialFormula);

        return result.toString() === "(¬(¬a1() ∨ a2()) ∨ (¬a1() ∨ a2()))";
    },{});

    runTest("Rewrite-bicond-and-impl-Literal-simple-1-success", () => {
        let initialFormula : Formula = l1;
        let result : Formula = rewriteWithoutBiconditionalsAndImplications(initialFormula);

        return result.toString() === "a1()";
    },{});

    runTest("Rewrite-bicond-and-impl-Literal-simple-2-success", () => {
        let initialFormula : Formula = n1;
        let result : Formula = rewriteWithoutBiconditionalsAndImplications(initialFormula);

        return result.toString() === "~a1()";
    },{});

    runTest("Rewrite-bicond-and-impl-Negation-simple-1-success", () => {
        let initialFormula : Formula = new Negation(l1);
        let result : Formula = rewriteWithoutBiconditionalsAndImplications(initialFormula);

        return result.toString() === "¬a1()";
    },{});

    runTest("Rewrite-bicond-and-impl-Negation-simple-2-success", () => {
        let initialFormula : Formula = new Negation(n1);
        let result : Formula = rewriteWithoutBiconditionalsAndImplications(initialFormula);

        return result.toString() === "¬~a1()";
    },{});

    runTest("Rewrite-bicond-and-impl-Negation-nested-bicon-success", () => {
        let initialFormula : Formula = new Negation(b1);
        let result : Formula = rewriteWithoutBiconditionalsAndImplications(initialFormula);

        return result.toString() === "¬((a1() ∧ a2()) ∨ (¬a1() ∧ ¬a2()))";
    },{});

    runTest("Rewrite-bicond-and-impl-Negation-nested-impl-success", () => {
        let initialFormula : Formula = new Negation(impl1);
        let result : Formula = rewriteWithoutBiconditionalsAndImplications(initialFormula);

        return result.toString() === "¬(¬a1() ∨ a2())";
    },{});
    
    runTest("Rewrite-bicond-and-impl-Universal-simple-success", () => {
        let initialFormula : Formula = new QuantifiedFormula(Quantifier.Universal, new Variable('X'), l1);
        let result : Formula = rewriteWithoutBiconditionalsAndImplications(initialFormula);

        return result.toString() === "∀X.(a1())";
    },{});

    runTest("Rewrite-bicond-and-impl-Universal-nested-success", () => {
        let initialFormula : Formula = new QuantifiedFormula(Quantifier.Universal, new Variable('X'), impl1);
        let result : Formula = rewriteWithoutBiconditionalsAndImplications(initialFormula);

        return result.toString() === "∀X.((¬a1() ∨ a2()))";
    },{});

    runTest("Rewrite-bicond-and-impl-Existential-simple-success", () => {
        let initialFormula : Formula = new QuantifiedFormula(Quantifier.Existential, new Variable('X'), l1);
        let result : Formula = rewriteWithoutBiconditionalsAndImplications(initialFormula);

        return result.toString() === "∃X.(a1())";
    },{});

    runTest("Rewrite-bicond-and-impl-Existential-nested-success", () => {
        let initialFormula : Formula = new QuantifiedFormula(Quantifier.Existential, new Variable('X'), impl1);
        let result : Formula = rewriteWithoutBiconditionalsAndImplications(initialFormula);

        return result.toString() === "∃X.((¬a1() ∨ a2()))";
    },{});

    runTest("Rewrite-bicond-and-impl-Conjunction-simple-success", () => {
        let initialFormula : Formula = new Conjunction([l1, n1]);
        let result : Formula = rewriteWithoutBiconditionalsAndImplications(initialFormula);

        return result.toString() === "(a1() ∧ ~a1())";
    },{});

    runTest("Rewrite-bicond-and-impl-Conjunction-nested-success", () => {
        let initialFormula : Formula = new Conjunction([impl1, impl1]);
        let result : Formula = rewriteWithoutBiconditionalsAndImplications(initialFormula);

        return result.toString() === "((¬a1() ∨ a2()) ∧ (¬a1() ∨ a2()))";
    },{});

    runTest("Rewrite-bicond-and-impl-Disjunction-simple-success", () => {
        let initialFormula : Formula = new Disjunction([l1, n1]);
        let result : Formula = rewriteWithoutBiconditionalsAndImplications(initialFormula);

        return result.toString() === "(a1() ∨ ~a1())";
    },{});

    runTest("Rewrite-bicond-and-impl-Disjunction-nested-success", () => {
        let initialFormula : Formula = new Disjunction([impl1, impl1]);
        let result : Formula = rewriteWithoutBiconditionalsAndImplications(initialFormula);

        return result.toString() === "((¬a1() ∨ a2()) ∨ (¬a1() ∨ a2()))";
    },{});
}

function runMakeNegationsAtomicTests() : void {
    

    printTestingMessage_Start("Rewriting without biconditionals and implications");

    let a1 = new Atom(new Predicate("a1"), []);
    let a2 = new Atom(new Predicate("a2"), []);
    let a3 = new Atom(new Predicate("a3"), []);

    let l1 = new Literal(a1, false);
    let l2 = new Literal(a2, false);
    let l3 = new Literal(a3, false);

    let n1 = new Literal(a1, true);
    let n2 = new Literal(a2, true);
    let n3 = new Literal(a3, true);

    let b1 = new Biconditional(l1, l2);
    let impl1 = new Implication(l1, l2);

    let not_true = new Negation(TRUE_LITERAL);
    let not_false = new Negation(FALSE_LITERAL);

    // Literal
    runTest("MakeNegAtomic-Literal-simple-1-success", () => {
        let initialFormula : Formula = l1;
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "a1()";
    },{});

    runTest("MakeNegAtomic-Literal-simple-2-success", () => {
        let initialFormula : Formula = n1;
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "~a1()";
    },{});

    // QuantifiedFormula
    runTest("MakeNegAtomic-QuantifiedFormula-Universal-simple-success", () => {
        let initialFormula : Formula = new QuantifiedFormula(Quantifier.Universal, new Variable('X'), l1);
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "∀X.(a1())";
    },{});

    runTest("MakeNegAtomic-QuantifiedFormula-Universal-nested-success", () => {
        let initialFormula : Formula = new QuantifiedFormula(Quantifier.Universal, new Variable('X'), not_true);
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "∀X.(false())";
    },{});

    runTest("MakeNegAtomic-QuantifiedFormula-Existential-simple-success", () => {
        let initialFormula : Formula = new QuantifiedFormula(Quantifier.Existential, new Variable('X'), l1);
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "∃X.(a1())";
    },{});

    runTest("MakeNegAtomic-QuantifiedFormula-Existential-nested-success", () => {
        let initialFormula : Formula = new QuantifiedFormula(Quantifier.Existential, new Variable('X'), not_true);
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "∃X.(false())";
    },{});

    // Biconditional
    runTest("MakeNegAtomic-Biconditional-simple-success", () => {
        let initialFormula : Formula = b1;
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "(a1() ⇔ a2())";
    },{});

    runTest("MakeNegAtomic-Biconditional-nested-success", () => {
        let initialFormula : Formula = new Biconditional(not_true, not_false);
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "(false() ⇔ true())";
    },{});

    // Implication
    runTest("MakeNegAtomic-Implication-simple-success", () => {
        let initialFormula : Formula = impl1;
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "(a1() ⇒ a2())";
    },{});

    runTest("MakeNegAtomic-Implication-nested-success", () => {
        let initialFormula : Formula = new Implication(not_true, not_false);
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "(false() ⇒ true())";
    },{});

    // Conjunction
    runTest("MakeNegAtomic-Conjunction-simple-success", () => {
        let initialFormula : Formula = new Conjunction([TRUE_LITERAL, FALSE_LITERAL, l2, n3]);
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "(true() ∧ false() ∧ a2() ∧ ~a3())";
    },{});

    runTest("MakeNegAtomic-Conjunction-nested-success", () => {
        let initialFormula : Formula = new Conjunction([not_true, not_false, l2, n3]);
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "(false() ∧ true() ∧ a2() ∧ ~a3())";
    },{});

    // Disjunction
    runTest("MakeNegAtomic-Disjunction-simple-success", () => {
        let initialFormula : Formula = new Disjunction([TRUE_LITERAL, FALSE_LITERAL, l2, n3]);
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "(true() ∨ false() ∨ a2() ∨ ~a3())";
    },{});

    runTest("MakeNegAtomic-Disjunction-nested-success", () => {
        let initialFormula : Formula = new Disjunction([not_true, not_false, l2, n3]);
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "(false() ∨ true() ∨ a2() ∨ ~a3())";
    },{});
    
    // Negation
    runTest("MakeNegAtomic-Negation-Literal-simple-success", () => {
        let initialFormula : Formula = new Negation(l1);
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "¬a1()";
    },{});

    runTest("MakeNegAtomic-Negation-Literal-negated-success", () => {
        let initialFormula : Formula = new Negation(n1);
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "a1()";
    },{});

    runTest("MakeNegAtomic-Negation-Literal-TRUE_LITERAL-success", () => {
        let initialFormula : Formula = not_true;
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "false()";
    },{});

    runTest("MakeNegAtomic-Negation-Literal-FALSE_LITERAL-success", () => {
        let initialFormula : Formula = not_false;
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "true()";
    },{});

    runTest("MakeNegAtomic-Negation-QuantifiedFormula-Universal-success", () => {
        let initialFormula : Formula = new Negation(new QuantifiedFormula(Quantifier.Universal, new Variable('X'), l1));
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "∃X.(¬a1())";
    },{});

    runTest("MakeNegAtomic-Negation-QuantifiedFormula-Existential-success", () => {
        let initialFormula : Formula = new Negation(new QuantifiedFormula(Quantifier.Existential, new Variable('X'), l1));
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "∀X.(¬a1())";
    },{});


    // Biconditional
    runTest("MakeNegAtomic-Negation-Biconditional-success", () => {
        let initialFormula : Formula = new Negation(new Biconditional(l1, l2));
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "((¬a1() ∨ ¬a2()) ∧ (a1() ∨ a2()))";
    },{});

    // Implication
    runTest("MakeNegAtomic-Negation-Implication-success", () => {
        let initialFormula : Formula = new Negation(new Implication(l1, l2));
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "(a1() ∧ ¬a2())";
    },{});

    // Conjunction
    runTest("MakeNegAtomic-Negation-Conjunction-success", () => {
        let initialFormula : Formula = new Negation(new Conjunction([l1, l2]));
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "(¬a1() ∨ ¬a2())";
    },{});

    // Disjunction
    runTest("MakeNegAtomic-Negation-Disjunction-success", () => {
        let initialFormula : Formula = new Negation(new Disjunction([l1, l2]));
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "(¬a1() ∧ ¬a2())";
    },{});

    // Double negation
    runTest("MakeNegAtomic-Negation-double-negation-explicit-success", () => {
        let initialFormula : Formula = new Negation(new Negation(new Disjunction([l1, l2])));
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "(a1() ∨ a2())";
    },{});

    // Double negation, implicitly
    runTest("MakeNegAtomic-Negation-double-negation-implicit-success", () => {
        let initialFormula : Formula = new Negation(new Conjunction([impl1,new Implication(l2, n1)]));
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "((a1() ∧ ¬a2()) ∨ (a2() ∧ a1()))";
    },{});
}

function runNNFIntegrationTests() : void {
    printTestingMessage_Start("NNF Integration");

    let x_var = new Variable('X');
    let y_var = new Variable('Y');
    let z_var = new Variable('Z');

    let p_xy = new Literal(new Atom(new Predicate('p'), [x_var, y_var]), false);
    let p_xz = new Literal(new Atom(new Predicate('p'), [x_var, z_var]), false);

    let calc_of_comp_example_2_27 = new Disjunction([
        new QuantifiedFormula(Quantifier.Universal, x_var, new Negation(new QuantifiedFormula(Quantifier.Existential, y_var,
            new Conjunction([p_xy, p_xz])))), 
        new QuantifiedFormula(Quantifier.Existential, y_var, p_xy)]);

    // Literal
    runTest("NNFIntegration-Calc_of_Comp_example_2.27-success", () => {
        let initialFormula : Formula = calc_of_comp_example_2_27;
        let result : Formula = makeNegationsAtomic(initialFormula);

        return result.toString() === "(∀X.(∀Y.((¬p(X, Y) ∨ ¬p(X, Z)))) ∨ ∃Y.(p(X, Y)))";
    },{});
}

function runSkolemizeTests() : void {
    printTestingMessage_Start("Skolemize");

    let x_var = new Variable('X');
    let y_var = new Variable('Y');

    let p_pred = new Predicate('p');
    let q_pred = new Predicate('q');
    let p_x = new Literal(new Atom(p_pred, [x_var]), false);
    let p_y = new Literal(new Atom(p_pred, [y_var]), true);
    let q_x = new Literal(new Atom(q_pred, [x_var]), false);

    let f2 = standardizeVarNames(bindFreeVars(new Conjunction([q_x, new QuantifiedFormula(Quantifier.Existential, x_var, p_x)])));
    let f3 = standardizeVarNames(bindFreeVars(new Disjunction([p_y, new QuantifiedFormula(Quantifier.Existential, x_var, p_x)])));
    let f4 = standardizeVarNames(bindFreeVars(new QuantifiedFormula(Quantifier.Universal, y_var, new Disjunction([p_y, new QuantifiedFormula(Quantifier.Existential, x_var, p_x)]))));
    let f5 = standardizeVarNames(bindFreeVars(new QuantifiedFormula(Quantifier.Universal, y_var, new Disjunction([new QuantifiedFormula(Quantifier.Existential, x_var, p_x), new QuantifiedFormula(Quantifier.Existential, x_var, p_x)]))));
    let f6 = standardizeVarNames(new QuantifiedFormula(Quantifier.Universal, x_var, new Implication(f5, f2)));
    let f7 = standardizeVarNames(new QuantifiedFormula(Quantifier.Universal, x_var, new Biconditional(f2, f5)));

    let f8 = standardizeVarNames(new QuantifiedFormula(Quantifier.Universal, x_var, new Conjunction([new QuantifiedFormula(Quantifier.Existential, y_var, p_y), f2])));

    let nf4 = new Negation(f4);

    runTest("skolemize-free vars-failure", () => {
        let initialFormula : Formula = p_x;
        let result : Formula = skolemize(initialFormula);

        return result.toString() === ERROR_FORMULA.toString();
    },{});

    runTest("skolemize-name collisions-failure", () => {
        let initialFormula : Formula = bindFreeVars(new Conjunction([p_x, bindFreeVars(p_x)]));
        let result : Formula = skolemize(initialFormula);

        return result.toString() === ERROR_FORMULA.toString();
    },{});

    runTest("skolemize-free vars and name collisions-failure", () => {
        let initialFormula : Formula = new Conjunction([p_x, bindFreeVars(p_x)]);
        let result : Formula = skolemize(initialFormula);

        return result.toString() === ERROR_FORMULA.toString();
    },{});

    runTest("skolemize-simple-skolem constant-success", () => {
        let initialFormula : Formula = new QuantifiedFormula(Quantifier.Existential, x_var, p_x);
        let result : Formula = skolemize(initialFormula);

        return result.toString() === "p(skolemfunc0())";
    },{});

    runTest("skolemize-complex-1-universal and disjunction-success", () => {
        let initialFormula : Formula = f3;
        let result : Formula = skolemize(initialFormula);

        return result.toString() === "∀V0.((~p(V0) ∨ p(skolemfunc0(V0))))";
    },{});

    runTest("skolemize-complex-2-negation, universal, and disjunction-success", () => {
        let initialFormula : Formula = nf4;
        let result : Formula = skolemize(initialFormula);

        return result.toString() === "¬∀V0.((~p(V0) ∨ p(skolemfunc0(V0))))";
    },{});

    runTest("skolemize-complex-3-multiple existential-success", () => {
        let initialFormula : Formula = f5;
        let result : Formula = skolemize(initialFormula);

        return result.toString() === "∀V0.((p(skolemfunc0(V0)) ∨ p(skolemfunc1(V0))))";
    },{});

    runTest("skolemize-complex-4-implication, conjunction, disjunction, nested and branching universals, with existentials in each branch-success", () => {
        let initialFormula : Formula = f6;
        let result : Formula = skolemize(initialFormula);

        return result.toString() === "∀V0.((∀V1.((p(skolemfunc0(V0, V1)) ∨ p(skolemfunc1(V0, V1)))) ⇒ ∀V4.((q(V4) ∧ p(skolemfunc2(V0, V4))))))";
    },{});

    runTest("skolemize-complex-5-biconditional, conjunction, disjunction, nested and branching universals (with flipped order), with existentials in each branch-success", () => {
        let initialFormula : Formula = f7;
        let result : Formula = skolemize(initialFormula);

        return result.toString() === "∀V0.((∀V1.((q(V1) ∧ p(skolemfunc0(V0, V1)))) ⇔ ∀V3.((p(skolemfunc1(V0, V3)) ∨ p(skolemfunc2(V0, V3))))))";
    },{});

    runTest("skolemize-complex-6-alternating quantifier types, and function arity-success", () => {
        let initialFormula : Formula = new QuantifiedFormula(Quantifier.Existential, x_var, new Conjunction([f8, p_x]));
        let result : Formula = skolemize(initialFormula);

        return result.toString() === "(∀V0.((~p(skolemfunc1(V0)) ∧ ∀V2.((q(V2) ∧ p(skolemfunc2(V0, V2)))))) ∧ p(skolemfunc0()))";
    },{});

}

export {
    runTests
}
