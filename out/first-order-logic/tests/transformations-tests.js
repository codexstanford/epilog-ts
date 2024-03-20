import { Atom } from "../../epilog-ts-core/classes/Atom.js";
import { ERROR_LITERAL, FALSE_LITERAL, Literal, TRUE_LITERAL } from "../../epilog-ts-core/classes/Literal.js";
import { Predicate } from "../../epilog-ts-core/classes/Predicate.js";
import { Variable } from "../../epilog-ts-core/classes/Term.js";
import { printTestingMessage_Start, runTest } from "../../testing/testing.js";
import { Biconditional } from "../classes/Biconditional.js";
import { Conjunction } from "../classes/Conjunction.js";
import { Disjunction } from "../classes/Disjunction.js";
import { ERROR_FORMULA } from "../classes/Formula.js";
import { Implication } from "../classes/Implication.js";
import { Negation } from "../classes/Negation.js";
import { QuantifiedFormula, Quantifier } from "../classes/QuantifiedFormula.js";
import { makeNegationsAtomic, rewriteWithoutBiconditionalsAndImplications, toNNF } from "../transformations/nnf.js";
import { Symbol } from "../../epilog-ts-core/classes/Term.js";
import { standardizeVarNames } from "../utils/standardize.js";
import { bindFreeVars } from "../transformations/general.js";
import { skolemize } from "../transformations/skolemize.js";
import { toCNF } from "../transformations/cnf.js";
// Unit tests for {first-order-log/transformations} files
function runTests() {
    //runNNFTests();
    //runSkolemizeTests();
    runCNFTests();
}
function runNNFTests() {
    printTestingMessage_Start("NNF");
    runRewriteWithoutBiconditionalsAndImplicationsTests();
    runMakeNegationsAtomicTests();
    runNNFIntegrationTests();
}
function runRewriteWithoutBiconditionalsAndImplicationsTests() {
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
        let initialFormula = b1;
        let result = rewriteWithoutBiconditionalsAndImplications(initialFormula);
        return result.toString() === "((a1() ∧ a2()) ∨ (¬a1() ∧ ¬a2()))";
    }, {});
    runTest("Rewrite-bicond-and-impl-Biconditional-nested-success", () => {
        let initialFormula = new Biconditional(impl1, impl1);
        let result = rewriteWithoutBiconditionalsAndImplications(initialFormula);
        return result.toString() === "(((¬a1() ∨ a2()) ∧ (¬a1() ∨ a2())) ∨ (¬(¬a1() ∨ a2()) ∧ ¬(¬a1() ∨ a2())))";
    }, {});
    runTest("Rewrite-bicond-and-impl-Implication-simple-success", () => {
        let initialFormula = impl1;
        let result = rewriteWithoutBiconditionalsAndImplications(initialFormula);
        return result.toString() === "(¬a1() ∨ a2())";
    }, {});
    runTest("Rewrite-bicond-and-impl-Implication-nested-success", () => {
        let initialFormula = new Implication(impl1, impl1);
        let result = rewriteWithoutBiconditionalsAndImplications(initialFormula);
        return result.toString() === "(¬(¬a1() ∨ a2()) ∨ (¬a1() ∨ a2()))";
    }, {});
    runTest("Rewrite-bicond-and-impl-Literal-simple-1-success", () => {
        let initialFormula = l1;
        let result = rewriteWithoutBiconditionalsAndImplications(initialFormula);
        return result.toString() === "a1()";
    }, {});
    runTest("Rewrite-bicond-and-impl-Literal-simple-2-success", () => {
        let initialFormula = n1;
        let result = rewriteWithoutBiconditionalsAndImplications(initialFormula);
        return result.toString() === "~a1()";
    }, {});
    runTest("Rewrite-bicond-and-impl-Negation-simple-1-success", () => {
        let initialFormula = new Negation(l1);
        let result = rewriteWithoutBiconditionalsAndImplications(initialFormula);
        return result.toString() === "¬a1()";
    }, {});
    runTest("Rewrite-bicond-and-impl-Negation-simple-2-success", () => {
        let initialFormula = new Negation(n1);
        let result = rewriteWithoutBiconditionalsAndImplications(initialFormula);
        return result.toString() === "¬~a1()";
    }, {});
    runTest("Rewrite-bicond-and-impl-Negation-nested-bicon-success", () => {
        let initialFormula = new Negation(b1);
        let result = rewriteWithoutBiconditionalsAndImplications(initialFormula);
        return result.toString() === "¬((a1() ∧ a2()) ∨ (¬a1() ∧ ¬a2()))";
    }, {});
    runTest("Rewrite-bicond-and-impl-Negation-nested-impl-success", () => {
        let initialFormula = new Negation(impl1);
        let result = rewriteWithoutBiconditionalsAndImplications(initialFormula);
        return result.toString() === "¬(¬a1() ∨ a2())";
    }, {});
    runTest("Rewrite-bicond-and-impl-Universal-simple-success", () => {
        let initialFormula = new QuantifiedFormula(Quantifier.Universal, new Variable('X'), l1);
        let result = rewriteWithoutBiconditionalsAndImplications(initialFormula);
        return result.toString() === "∀X.(a1())";
    }, {});
    runTest("Rewrite-bicond-and-impl-Universal-nested-success", () => {
        let initialFormula = new QuantifiedFormula(Quantifier.Universal, new Variable('X'), impl1);
        let result = rewriteWithoutBiconditionalsAndImplications(initialFormula);
        return result.toString() === "∀X.((¬a1() ∨ a2()))";
    }, {});
    runTest("Rewrite-bicond-and-impl-Existential-simple-success", () => {
        let initialFormula = new QuantifiedFormula(Quantifier.Existential, new Variable('X'), l1);
        let result = rewriteWithoutBiconditionalsAndImplications(initialFormula);
        return result.toString() === "∃X.(a1())";
    }, {});
    runTest("Rewrite-bicond-and-impl-Existential-nested-success", () => {
        let initialFormula = new QuantifiedFormula(Quantifier.Existential, new Variable('X'), impl1);
        let result = rewriteWithoutBiconditionalsAndImplications(initialFormula);
        return result.toString() === "∃X.((¬a1() ∨ a2()))";
    }, {});
    runTest("Rewrite-bicond-and-impl-Conjunction-simple-success", () => {
        let initialFormula = new Conjunction([l1, n1]);
        let result = rewriteWithoutBiconditionalsAndImplications(initialFormula);
        return result.toString() === "(a1() ∧ ~a1())";
    }, {});
    runTest("Rewrite-bicond-and-impl-Conjunction-nested-success", () => {
        let initialFormula = new Conjunction([impl1, impl1]);
        let result = rewriteWithoutBiconditionalsAndImplications(initialFormula);
        return result.toString() === "((¬a1() ∨ a2()) ∧ (¬a1() ∨ a2()))";
    }, {});
    runTest("Rewrite-bicond-and-impl-Disjunction-simple-success", () => {
        let initialFormula = new Disjunction([l1, n1]);
        let result = rewriteWithoutBiconditionalsAndImplications(initialFormula);
        return result.toString() === "(a1() ∨ ~a1())";
    }, {});
    runTest("Rewrite-bicond-and-impl-Disjunction-nested-success", () => {
        let initialFormula = new Disjunction([impl1, impl1]);
        let result = rewriteWithoutBiconditionalsAndImplications(initialFormula);
        return result.toString() === "((¬a1() ∨ a2()) ∨ (¬a1() ∨ a2()))";
    }, {});
}
function runMakeNegationsAtomicTests() {
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
        let initialFormula = l1;
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "a1()";
    }, {});
    runTest("MakeNegAtomic-Literal-simple-2-success", () => {
        let initialFormula = n1;
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "~a1()";
    }, {});
    // QuantifiedFormula
    runTest("MakeNegAtomic-QuantifiedFormula-Universal-simple-success", () => {
        let initialFormula = new QuantifiedFormula(Quantifier.Universal, new Variable('X'), l1);
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "∀X.(a1())";
    }, {});
    runTest("MakeNegAtomic-QuantifiedFormula-Universal-nested-success", () => {
        let initialFormula = new QuantifiedFormula(Quantifier.Universal, new Variable('X'), not_true);
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "∀X.(false())";
    }, {});
    runTest("MakeNegAtomic-QuantifiedFormula-Existential-simple-success", () => {
        let initialFormula = new QuantifiedFormula(Quantifier.Existential, new Variable('X'), l1);
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "∃X.(a1())";
    }, {});
    runTest("MakeNegAtomic-QuantifiedFormula-Existential-nested-success", () => {
        let initialFormula = new QuantifiedFormula(Quantifier.Existential, new Variable('X'), not_true);
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "∃X.(false())";
    }, {});
    // Biconditional
    runTest("MakeNegAtomic-Biconditional-simple-success", () => {
        let initialFormula = b1;
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "(a1() ⇔ a2())";
    }, {});
    runTest("MakeNegAtomic-Biconditional-nested-success", () => {
        let initialFormula = new Biconditional(not_true, not_false);
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "(false() ⇔ true())";
    }, {});
    // Implication
    runTest("MakeNegAtomic-Implication-simple-success", () => {
        let initialFormula = impl1;
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "(a1() ⇒ a2())";
    }, {});
    runTest("MakeNegAtomic-Implication-nested-success", () => {
        let initialFormula = new Implication(not_true, not_false);
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "(false() ⇒ true())";
    }, {});
    // Conjunction
    runTest("MakeNegAtomic-Conjunction-simple-success", () => {
        let initialFormula = new Conjunction([TRUE_LITERAL, FALSE_LITERAL, l2, n3]);
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "(true() ∧ false() ∧ a2() ∧ ~a3())";
    }, {});
    runTest("MakeNegAtomic-Conjunction-nested-success", () => {
        let initialFormula = new Conjunction([not_true, not_false, l2, n3]);
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "(false() ∧ true() ∧ a2() ∧ ~a3())";
    }, {});
    // Disjunction
    runTest("MakeNegAtomic-Disjunction-simple-success", () => {
        let initialFormula = new Disjunction([TRUE_LITERAL, FALSE_LITERAL, l2, n3]);
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "(true() ∨ false() ∨ a2() ∨ ~a3())";
    }, {});
    runTest("MakeNegAtomic-Disjunction-nested-success", () => {
        let initialFormula = new Disjunction([not_true, not_false, l2, n3]);
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "(false() ∨ true() ∨ a2() ∨ ~a3())";
    }, {});
    // Negation
    runTest("MakeNegAtomic-Negation-Literal-simple-success", () => {
        let initialFormula = new Negation(l1);
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "¬a1()";
    }, {});
    runTest("MakeNegAtomic-Negation-Literal-negated-success", () => {
        let initialFormula = new Negation(n1);
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "a1()";
    }, {});
    runTest("MakeNegAtomic-Negation-Literal-TRUE_LITERAL-success", () => {
        let initialFormula = not_true;
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "false()";
    }, {});
    runTest("MakeNegAtomic-Negation-Literal-FALSE_LITERAL-success", () => {
        let initialFormula = not_false;
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "true()";
    }, {});
    runTest("MakeNegAtomic-Negation-QuantifiedFormula-Universal-success", () => {
        let initialFormula = new Negation(new QuantifiedFormula(Quantifier.Universal, new Variable('X'), l1));
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "∃X.(¬a1())";
    }, {});
    runTest("MakeNegAtomic-Negation-QuantifiedFormula-Existential-success", () => {
        let initialFormula = new Negation(new QuantifiedFormula(Quantifier.Existential, new Variable('X'), l1));
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "∀X.(¬a1())";
    }, {});
    // Biconditional
    runTest("MakeNegAtomic-Negation-Biconditional-success", () => {
        let initialFormula = new Negation(new Biconditional(l1, l2));
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "((¬a1() ∨ ¬a2()) ∧ (a1() ∨ a2()))";
    }, {});
    // Implication
    runTest("MakeNegAtomic-Negation-Implication-success", () => {
        let initialFormula = new Negation(new Implication(l1, l2));
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "(a1() ∧ ¬a2())";
    }, {});
    // Conjunction
    runTest("MakeNegAtomic-Negation-Conjunction-success", () => {
        let initialFormula = new Negation(new Conjunction([l1, l2]));
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "(¬a1() ∨ ¬a2())";
    }, {});
    // Disjunction
    runTest("MakeNegAtomic-Negation-Disjunction-success", () => {
        let initialFormula = new Negation(new Disjunction([l1, l2]));
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "(¬a1() ∧ ¬a2())";
    }, {});
    // Double negation
    runTest("MakeNegAtomic-Negation-double-negation-explicit-success", () => {
        let initialFormula = new Negation(new Negation(new Disjunction([l1, l2])));
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "(a1() ∨ a2())";
    }, {});
    // Double negation, implicitly
    runTest("MakeNegAtomic-Negation-double-negation-implicit-success", () => {
        let initialFormula = new Negation(new Conjunction([impl1, new Implication(l2, n1)]));
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "((a1() ∧ ¬a2()) ∨ (a2() ∧ a1()))";
    }, {});
}
function runNNFIntegrationTests() {
    printTestingMessage_Start("NNF Integration");
    let x_var = new Variable('X');
    let y_var = new Variable('Y');
    let z_var = new Variable('Z');
    let p_xy = new Literal(new Atom(new Predicate('p'), [x_var, y_var]), false);
    let p_xz = new Literal(new Atom(new Predicate('p'), [x_var, z_var]), false);
    let calc_of_comp_example_2_27 = new Disjunction([
        new QuantifiedFormula(Quantifier.Universal, x_var, new Negation(new QuantifiedFormula(Quantifier.Existential, y_var, new Conjunction([p_xy, p_xz])))),
        new QuantifiedFormula(Quantifier.Existential, y_var, p_xy)
    ]);
    // Literal
    runTest("NNFIntegration-Calc_of_Comp_example_2.27-success", () => {
        let initialFormula = calc_of_comp_example_2_27;
        let result = makeNegationsAtomic(initialFormula);
        return result.toString() === "(∀X.(∀Y.((¬p(X, Y) ∨ ¬p(X, Z)))) ∨ ∃Y.(p(X, Y)))";
    }, {});
}
function runSkolemizeTests() {
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
        let initialFormula = p_x;
        let result = skolemize(initialFormula);
        return result.toString() === ERROR_FORMULA.toString();
    }, {});
    runTest("skolemize-name collisions-failure", () => {
        let initialFormula = bindFreeVars(new Conjunction([p_x, bindFreeVars(p_x)]));
        let result = skolemize(initialFormula);
        return result.toString() === ERROR_FORMULA.toString();
    }, {});
    runTest("skolemize-free vars and name collisions-failure", () => {
        let initialFormula = new Conjunction([p_x, bindFreeVars(p_x)]);
        let result = skolemize(initialFormula);
        return result.toString() === ERROR_FORMULA.toString();
    }, {});
    runTest("skolemize-simple-skolem constant-success", () => {
        let initialFormula = new QuantifiedFormula(Quantifier.Existential, x_var, p_x);
        let result = skolemize(initialFormula);
        return result.toString() === "p(skolemfunc0())";
    }, {});
    runTest("skolemize-complex-1-universal and disjunction-success", () => {
        let initialFormula = f3;
        let result = skolemize(initialFormula);
        return result.toString() === "∀V0.((~p(V0) ∨ p(skolemfunc0(V0))))";
    }, {});
    runTest("skolemize-complex-2-negation, universal, and disjunction-success", () => {
        let initialFormula = nf4;
        let result = skolemize(initialFormula);
        return result.toString() === "¬∀V0.((~p(V0) ∨ p(skolemfunc0(V0))))";
    }, {});
    runTest("skolemize-complex-3-multiple existential-success", () => {
        let initialFormula = f5;
        let result = skolemize(initialFormula);
        return result.toString() === "∀V0.((p(skolemfunc0(V0)) ∨ p(skolemfunc1(V0))))";
    }, {});
    runTest("skolemize-complex-4-implication, conjunction, disjunction, nested and branching universals, with existentials in each branch-success", () => {
        let initialFormula = f6;
        let result = skolemize(initialFormula);
        return result.toString() === "∀V0.((∀V1.((p(skolemfunc0(V0, V1)) ∨ p(skolemfunc1(V0, V1)))) ⇒ ∀V4.((q(V4) ∧ p(skolemfunc2(V0, V4))))))";
    }, {});
    runTest("skolemize-complex-5-biconditional, conjunction, disjunction, nested and branching universals (with flipped order), with existentials in each branch-success", () => {
        let initialFormula = f7;
        let result = skolemize(initialFormula);
        return result.toString() === "∀V0.((∀V1.((q(V1) ∧ p(skolemfunc0(V0, V1)))) ⇔ ∀V3.((p(skolemfunc1(V0, V3)) ∨ p(skolemfunc2(V0, V3))))))";
    }, {});
    runTest("skolemize-complex-6-alternating quantifier types, and function arity-success", () => {
        let initialFormula = new QuantifiedFormula(Quantifier.Existential, x_var, new Conjunction([f8, p_x]));
        let result = skolemize(initialFormula);
        return result.toString() === "(∀V0.((~p(skolemfunc1(V0)) ∧ ∀V2.((q(V2) ∧ p(skolemfunc2(V0, V2)))))) ∧ p(skolemfunc0()))";
    }, {});
}
function runCNFTests() {
    printTestingMessage_Start("toCNF");
    let c_const = new Symbol("c");
    let x_var = new Variable('X');
    let y_var = new Variable('Y');
    let z_var = new Variable('Z');
    let p_pred = new Predicate('p');
    let q_pred = new Predicate('q');
    let s_pred = new Predicate('s');
    let p_c = new Literal(new Atom(p_pred, [c_const]), false);
    let p_x = new Literal(new Atom(p_pred, [x_var]), false);
    let p_y = new Literal(new Atom(p_pred, [y_var]), true);
    let q_x = new Literal(new Atom(q_pred, [x_var]), false);
    let q_y = new Literal(new Atom(q_pred, [y_var]), true);
    let s_xyz = new Literal(new Atom(s_pred, [x_var, y_var, z_var]), false);
    let s_zyxx = new Literal(new Atom(s_pred, [z_var, y_var, x_var, x_var]), false);
    let np_x = new Negation(p_x);
    let nq_x = new Negation(q_x);
    let impl1_unsafe = new Implication(np_x, p_x);
    let b1_unsafe = new Biconditional(np_x, p_x);
    let f1_unsafe = new Conjunction([new QuantifiedFormula(Quantifier.Existential, x_var, p_x), q_x]);
    let f2_unsafe = new Conjunction([q_x, new QuantifiedFormula(Quantifier.Existential, x_var, p_x)]);
    let f3_unsafe = new Disjunction([p_x, new QuantifiedFormula(Quantifier.Existential, x_var, p_x)]);
    let f4_unsafe = new QuantifiedFormula(Quantifier.Universal, x_var, new Disjunction([p_x, new QuantifiedFormula(Quantifier.Existential, x_var, p_x)]));
    let impl1 = standardizeVarNames(bindFreeVars(new Implication(np_x, p_y)));
    let b1 = standardizeVarNames(bindFreeVars(new Biconditional(np_x, p_y)));
    let f1 = standardizeVarNames(bindFreeVars(new Conjunction([new QuantifiedFormula(Quantifier.Existential, x_var, p_x), q_x])));
    let f2 = standardizeVarNames(bindFreeVars(new Conjunction([q_x, new QuantifiedFormula(Quantifier.Existential, x_var, p_x)])));
    let f3 = standardizeVarNames(bindFreeVars(new Disjunction([p_y, new QuantifiedFormula(Quantifier.Existential, x_var, p_x)])));
    let f4 = standardizeVarNames(bindFreeVars(new QuantifiedFormula(Quantifier.Universal, y_var, new Disjunction([p_y, new QuantifiedFormula(Quantifier.Existential, x_var, p_x)]))));
    let f5 = standardizeVarNames(bindFreeVars(new QuantifiedFormula(Quantifier.Universal, y_var, new Disjunction([new QuantifiedFormula(Quantifier.Existential, x_var, p_x), new QuantifiedFormula(Quantifier.Existential, x_var, p_x)]))));
    let f6 = standardizeVarNames(new QuantifiedFormula(Quantifier.Universal, x_var, new Implication(f5, f2)));
    let f7 = standardizeVarNames(new QuantifiedFormula(Quantifier.Universal, x_var, new Biconditional(f2, f5)));
    let nf4 = new Negation(f4);
    let quant_p_x = standardizeVarNames(bindFreeVars(p_x));
    let quant_q_x = standardizeVarNames(bindFreeVars(q_x));
    let impl2 = standardizeVarNames(new Implication(quant_p_x, quant_q_x));
    let b2 = standardizeVarNames(new Biconditional(quant_p_x, quant_q_x));
    const ERROR_CONJUNCTION = new Conjunction([ERROR_FORMULA]);
    printTestingMessage_Start("Invalid and Unit Inputs");
    runTest("toCNF-non-QF formula-failure", () => {
        let initialFormula = f1;
        let result = toCNF(initialFormula);
        return result.toString() === ERROR_CONJUNCTION.toString();
    }, {});
    runTest("toCNF-non-NNF formula-failure", () => {
        let initialFormula = impl1_unsafe;
        let result = toCNF(initialFormula);
        return result.toString() === ERROR_CONJUNCTION.toString();
    }, {});
    runTest("toCNF-single positive unit clause-success", () => {
        let initialFormula = p_x;
        let result = toCNF(initialFormula);
        return result.toString() === new Conjunction([p_x]).toString();
    }, {});
    runTest("toCNF-single negative unit clause-success", () => {
        let initialFormula = p_y;
        let result = toCNF(initialFormula);
        return result.toString() === new Conjunction([p_y]).toString();
    }, {});
    runTest("toCNF-single negated unit clause-success", () => {
        let initialFormula = np_x;
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ ¬p(X))".toString();
    }, {});
    // Conjunction
    printTestingMessage_Start("Conjunction");
    runTest("toCNF-flat empty Conjunction-success", () => {
        let initialFormula = new Conjunction([]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (¬tseitinvar0() ∨ true()) ∧ (tseitinvar0() ∨ ¬true()))".toString();
    }, {});
    runTest("toCNF-non-flat empty Conjunction-success", () => {
        let initialFormula = new Conjunction([new Conjunction([])]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (¬tseitinvar0() ∨ tseitinvar1()) ∧ (tseitinvar0() ∨ ¬tseitinvar1()) ∧ (¬tseitinvar1() ∨ true()) ∧ (tseitinvar1() ∨ ¬true()))".toString();
    }, {});
    runTest("toCNF-flat positive unit Conjunction-success", () => {
        let initialFormula = new Conjunction([p_x]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (¬tseitinvar0() ∨ p(X)) ∧ (tseitinvar0() ∨ ¬p(X)))".toString();
    }, {});
    runTest("toCNF-flat negative unit Conjunction-success", () => {
        let initialFormula = new Conjunction([p_y]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (¬tseitinvar0() ∨ ~p(Y)) ∧ (tseitinvar0() ∨ p(Y)))".toString();
    }, {});
    runTest("toCNF-flat negated unit Conjunction-success", () => {
        let initialFormula = new Conjunction([np_x]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (¬tseitinvar0() ∨ ¬p(X)) ∧ (tseitinvar0() ∨ p(X)))".toString();
    }, {});
    runTest("toCNF-flat wide Conjunction-success", () => {
        let initialFormula = new Conjunction([p_x, p_y, np_x]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (¬tseitinvar0() ∨ p(X)) ∧ (¬tseitinvar0() ∨ ~p(Y)) ∧ (¬tseitinvar0() ∨ ¬p(X)) ∧ (tseitinvar0() ∨ ¬p(X) ∨ p(Y) ∨ p(X)))".toString();
    }, {});
    runTest("toCNF-non-flat narrow Conjunction-success", () => {
        let initialFormula = new Conjunction([new Conjunction([new Conjunction([p_x])])]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (¬tseitinvar0() ∨ tseitinvar1()) ∧ (tseitinvar0() ∨ ¬tseitinvar1()) ∧ (¬tseitinvar1() ∨ tseitinvar2()) ∧ (tseitinvar1() ∨ ¬tseitinvar2()) ∧ (¬tseitinvar2() ∨ p(X)) ∧ (tseitinvar2() ∨ ¬p(X)))".toString();
    }, {});
    runTest("toCNF-non-flat wide Conjunction-success", () => {
        let initialFormula = new Conjunction([new Conjunction([p_x, q_x]), new Conjunction([p_y, q_y]), new Conjunction([np_x, nq_x])]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (¬tseitinvar0() ∨ tseitinvar1()) ∧ (¬tseitinvar0() ∨ tseitinvar2()) ∧ (¬tseitinvar0() ∨ tseitinvar3()) ∧ (tseitinvar0() ∨ ¬tseitinvar1() ∨ ¬tseitinvar2() ∨ ¬tseitinvar3()) ∧ (¬tseitinvar1() ∨ p(X)) ∧ (¬tseitinvar1() ∨ q(X)) ∧ (tseitinvar1() ∨ ¬p(X) ∨ ¬q(X)) ∧ (¬tseitinvar2() ∨ ~p(Y)) ∧ (¬tseitinvar2() ∨ ~q(Y)) ∧ (tseitinvar2() ∨ p(Y) ∨ q(Y)) ∧ (¬tseitinvar3() ∨ ¬p(X)) ∧ (¬tseitinvar3() ∨ ¬q(X)) ∧ (tseitinvar3() ∨ p(X) ∨ q(X)))".toString();
    }, {});
    runTest("toCNF-variable depth Conjunction-success", () => {
        let initialFormula = new Conjunction([p_x, new Conjunction([new Conjunction([p_y, q_y]), q_x]), new Conjunction([np_x, nq_x])]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (¬tseitinvar0() ∨ p(X)) ∧ (¬tseitinvar0() ∨ tseitinvar1()) ∧ (¬tseitinvar0() ∨ tseitinvar3()) ∧ (tseitinvar0() ∨ ¬p(X) ∨ ¬tseitinvar1() ∨ ¬tseitinvar3()) ∧ (¬tseitinvar1() ∨ tseitinvar2()) ∧ (¬tseitinvar1() ∨ q(X)) ∧ (tseitinvar1() ∨ ¬tseitinvar2() ∨ ¬q(X)) ∧ (¬tseitinvar2() ∨ ~p(Y)) ∧ (¬tseitinvar2() ∨ ~q(Y)) ∧ (tseitinvar2() ∨ p(Y) ∨ q(Y)) ∧ (¬tseitinvar3() ∨ ¬p(X)) ∧ (¬tseitinvar3() ∨ ¬q(X)) ∧ (tseitinvar3() ∨ p(X) ∨ q(X)))".toString();
    }, {});
    // Disjunction
    printTestingMessage_Start("Disjunction");
    runTest("toCNF-flat empty Disjunction-success", () => {
        let initialFormula = new Disjunction([]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (tseitinvar0() ∨ ¬false()) ∧ (¬tseitinvar0() ∨ false()))".toString();
    }, {});
    runTest("toCNF-non-flat empty Disjunction-success", () => {
        let initialFormula = new Disjunction([new Disjunction([])]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (tseitinvar0() ∨ ¬tseitinvar1()) ∧ (¬tseitinvar0() ∨ tseitinvar1()) ∧ (tseitinvar1() ∨ ¬false()) ∧ (¬tseitinvar1() ∨ false()))".toString();
    }, {});
    runTest("toCNF-flat positive unit Disjunction-success", () => {
        let initialFormula = new Disjunction([p_x]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (tseitinvar0() ∨ ¬p(X)) ∧ (¬tseitinvar0() ∨ p(X)))".toString();
    }, {});
    runTest("toCNF-flat negative unit Disjunction-success", () => {
        let initialFormula = new Disjunction([p_y]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (tseitinvar0() ∨ p(Y)) ∧ (¬tseitinvar0() ∨ ~p(Y)))".toString();
    }, {});
    runTest("toCNF-flat negated unit Disjunction-success", () => {
        let initialFormula = new Disjunction([np_x]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (tseitinvar0() ∨ p(X)) ∧ (¬tseitinvar0() ∨ ¬p(X)))".toString();
    }, {});
    runTest("toCNF-flat wide Disjunction-success", () => {
        let initialFormula = new Disjunction([p_x, p_y, np_x]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (tseitinvar0() ∨ ¬p(X)) ∧ (tseitinvar0() ∨ p(Y)) ∧ (tseitinvar0() ∨ p(X)) ∧ (¬tseitinvar0() ∨ p(X) ∨ ~p(Y) ∨ ¬p(X)))".toString();
    }, {});
    runTest("toCNF-non-flat narrow Disjunction-success", () => {
        let initialFormula = new Disjunction([new Disjunction([new Disjunction([p_x])])]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (tseitinvar0() ∨ ¬tseitinvar1()) ∧ (¬tseitinvar0() ∨ tseitinvar1()) ∧ (tseitinvar1() ∨ ¬tseitinvar2()) ∧ (¬tseitinvar1() ∨ tseitinvar2()) ∧ (tseitinvar2() ∨ ¬p(X)) ∧ (¬tseitinvar2() ∨ p(X)))".toString();
    }, {});
    runTest("toCNF-non-flat wide Disjunction-success", () => {
        let initialFormula = new Disjunction([new Disjunction([p_x, q_x]), new Disjunction([p_y, q_y]), new Disjunction([np_x, nq_x])]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (tseitinvar0() ∨ ¬tseitinvar1()) ∧ (tseitinvar0() ∨ ¬tseitinvar2()) ∧ (tseitinvar0() ∨ ¬tseitinvar3()) ∧ (¬tseitinvar0() ∨ tseitinvar1() ∨ tseitinvar2() ∨ tseitinvar3()) ∧ (tseitinvar1() ∨ ¬p(X)) ∧ (tseitinvar1() ∨ ¬q(X)) ∧ (¬tseitinvar1() ∨ p(X) ∨ q(X)) ∧ (tseitinvar2() ∨ p(Y)) ∧ (tseitinvar2() ∨ q(Y)) ∧ (¬tseitinvar2() ∨ ~p(Y) ∨ ~q(Y)) ∧ (tseitinvar3() ∨ p(X)) ∧ (tseitinvar3() ∨ q(X)) ∧ (¬tseitinvar3() ∨ ¬p(X) ∨ ¬q(X)))".toString();
    }, {});
    runTest("toCNF-variable depth Disjunction-success", () => {
        let initialFormula = new Disjunction([p_x, new Disjunction([new Disjunction([p_y, q_y]), q_x]), new Disjunction([np_x, nq_x])]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (tseitinvar0() ∨ ¬p(X)) ∧ (tseitinvar0() ∨ ¬tseitinvar1()) ∧ (tseitinvar0() ∨ ¬tseitinvar3()) ∧ (¬tseitinvar0() ∨ p(X) ∨ tseitinvar1() ∨ tseitinvar3()) ∧ (tseitinvar1() ∨ ¬tseitinvar2()) ∧ (tseitinvar1() ∨ ¬q(X)) ∧ (¬tseitinvar1() ∨ tseitinvar2() ∨ q(X)) ∧ (tseitinvar2() ∨ p(Y)) ∧ (tseitinvar2() ∨ q(Y)) ∧ (¬tseitinvar2() ∨ ~p(Y) ∨ ~q(Y)) ∧ (tseitinvar3() ∨ p(X)) ∧ (tseitinvar3() ∨ q(X)) ∧ (¬tseitinvar3() ∨ ¬p(X) ∨ ¬q(X)))".toString();
    }, {});
    // Integration
    printTestingMessage_Start("Integration");
    runTest("toCNF-non-flat Conjunction with Disjunction-success", () => {
        let initialFormula = new Conjunction([new Disjunction([p_x, q_x]), new Disjunction([p_y, q_y]), new Disjunction([np_x, nq_x])]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (¬tseitinvar0() ∨ tseitinvar1()) ∧ (¬tseitinvar0() ∨ tseitinvar2()) ∧ (¬tseitinvar0() ∨ tseitinvar3()) ∧ (tseitinvar0() ∨ ¬tseitinvar1() ∨ ¬tseitinvar2() ∨ ¬tseitinvar3()) ∧ (tseitinvar1() ∨ ¬p(X)) ∧ (tseitinvar1() ∨ ¬q(X)) ∧ (¬tseitinvar1() ∨ p(X) ∨ q(X)) ∧ (tseitinvar2() ∨ p(Y)) ∧ (tseitinvar2() ∨ q(Y)) ∧ (¬tseitinvar2() ∨ ~p(Y) ∨ ~q(Y)) ∧ (tseitinvar3() ∨ p(X)) ∧ (tseitinvar3() ∨ q(X)) ∧ (¬tseitinvar3() ∨ ¬p(X) ∨ ¬q(X)))".toString();
    }, {});
    runTest("toCNF-non-flat wide Disjunction with Conjunction-success", () => {
        let initialFormula = new Disjunction([new Conjunction([p_x, q_x]), new Conjunction([p_y, q_y]), new Conjunction([np_x, nq_x])]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (tseitinvar0() ∨ ¬tseitinvar1()) ∧ (tseitinvar0() ∨ ¬tseitinvar2()) ∧ (tseitinvar0() ∨ ¬tseitinvar3()) ∧ (¬tseitinvar0() ∨ tseitinvar1() ∨ tseitinvar2() ∨ tseitinvar3()) ∧ (¬tseitinvar1() ∨ p(X)) ∧ (¬tseitinvar1() ∨ q(X)) ∧ (tseitinvar1() ∨ ¬p(X) ∨ ¬q(X)) ∧ (¬tseitinvar2() ∨ ~p(Y)) ∧ (¬tseitinvar2() ∨ ~q(Y)) ∧ (tseitinvar2() ∨ p(Y) ∨ q(Y)) ∧ (¬tseitinvar3() ∨ ¬p(X)) ∧ (¬tseitinvar3() ∨ ¬q(X)) ∧ (tseitinvar3() ∨ p(X) ∨ q(X)))".toString();
    }, {});
    runTest("toCNF-variable depth Conjunction with Disjunction-success", () => {
        let initialFormula = new Conjunction([p_x, new Disjunction([new Disjunction([p_y, q_y]), q_x]), new Disjunction([np_x, nq_x])]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (¬tseitinvar0() ∨ p(X)) ∧ (¬tseitinvar0() ∨ tseitinvar1()) ∧ (¬tseitinvar0() ∨ tseitinvar3()) ∧ (tseitinvar0() ∨ ¬p(X) ∨ ¬tseitinvar1() ∨ ¬tseitinvar3()) ∧ (tseitinvar1() ∨ ¬tseitinvar2()) ∧ (tseitinvar1() ∨ ¬q(X)) ∧ (¬tseitinvar1() ∨ tseitinvar2() ∨ q(X)) ∧ (tseitinvar2() ∨ p(Y)) ∧ (tseitinvar2() ∨ q(Y)) ∧ (¬tseitinvar2() ∨ ~p(Y) ∨ ~q(Y)) ∧ (tseitinvar3() ∨ p(X)) ∧ (tseitinvar3() ∨ q(X)) ∧ (¬tseitinvar3() ∨ ¬p(X) ∨ ¬q(X)))".toString();
    }, {});
    runTest("toCNF-variable depth Disjunction with Conjunction-success", () => {
        let initialFormula = new Disjunction([p_x, new Conjunction([new Conjunction([p_y, q_y]), q_x]), new Conjunction([np_x, nq_x])]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (tseitinvar0() ∨ ¬p(X)) ∧ (tseitinvar0() ∨ ¬tseitinvar1()) ∧ (tseitinvar0() ∨ ¬tseitinvar3()) ∧ (¬tseitinvar0() ∨ p(X) ∨ tseitinvar1() ∨ tseitinvar3()) ∧ (¬tseitinvar1() ∨ tseitinvar2()) ∧ (¬tseitinvar1() ∨ q(X)) ∧ (tseitinvar1() ∨ ¬tseitinvar2() ∨ ¬q(X)) ∧ (¬tseitinvar2() ∨ ~p(Y)) ∧ (¬tseitinvar2() ∨ ~q(Y)) ∧ (tseitinvar2() ∨ p(Y) ∨ q(Y)) ∧ (¬tseitinvar3() ∨ ¬p(X)) ∧ (¬tseitinvar3() ∨ ¬q(X)) ∧ (tseitinvar3() ∨ p(X) ∨ q(X)))".toString();
    }, {});
    runTest("toCNF-variable depth Conjunction with both-success", () => {
        let initialFormula = new Conjunction([p_x, new Disjunction([new Disjunction([p_y, q_y]), q_x]), new Conjunction([np_x, nq_x])]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (¬tseitinvar0() ∨ p(X)) ∧ (¬tseitinvar0() ∨ tseitinvar1()) ∧ (¬tseitinvar0() ∨ tseitinvar3()) ∧ (tseitinvar0() ∨ ¬p(X) ∨ ¬tseitinvar1() ∨ ¬tseitinvar3()) ∧ (tseitinvar1() ∨ ¬tseitinvar2()) ∧ (tseitinvar1() ∨ ¬q(X)) ∧ (¬tseitinvar1() ∨ tseitinvar2() ∨ q(X)) ∧ (tseitinvar2() ∨ p(Y)) ∧ (tseitinvar2() ∨ q(Y)) ∧ (¬tseitinvar2() ∨ ~p(Y) ∨ ~q(Y)) ∧ (¬tseitinvar3() ∨ ¬p(X)) ∧ (¬tseitinvar3() ∨ ¬q(X)) ∧ (tseitinvar3() ∨ p(X) ∨ q(X)))".toString();
    }, {});
    runTest("toCNF-variable depth Disjunction with both-success", () => {
        let initialFormula = new Disjunction([p_x, new Disjunction([new Disjunction([p_y, q_y]), q_x]), new Conjunction([np_x, nq_x])]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (tseitinvar0() ∨ ¬p(X)) ∧ (tseitinvar0() ∨ ¬tseitinvar1()) ∧ (tseitinvar0() ∨ ¬tseitinvar3()) ∧ (¬tseitinvar0() ∨ p(X) ∨ tseitinvar1() ∨ tseitinvar3()) ∧ (tseitinvar1() ∨ ¬tseitinvar2()) ∧ (tseitinvar1() ∨ ¬q(X)) ∧ (¬tseitinvar1() ∨ tseitinvar2() ∨ q(X)) ∧ (tseitinvar2() ∨ p(Y)) ∧ (tseitinvar2() ∨ q(Y)) ∧ (¬tseitinvar2() ∨ ~p(Y) ∨ ~q(Y)) ∧ (¬tseitinvar3() ∨ ¬p(X)) ∧ (¬tseitinvar3() ∨ ¬q(X)) ∧ (tseitinvar3() ∨ p(X) ∨ q(X)))".toString();
    }, {});
    // Lecture and textbook examples
    let p_list = [ERROR_LITERAL];
    for (let i = 1; i <= 5; i++) {
        p_list.push(new Literal(new Atom(new Predicate("p" + i), []), false));
    }
    runTest("toCNF-Decision Procedures example 1.21-success", () => {
        let initialFormula = toNNF(new Implication(p_list[1], new Conjunction([p_list[2], p_list[3]])));
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (tseitinvar0() ∨ p1()) ∧ (tseitinvar0() ∨ ¬tseitinvar1()) ∧ (¬tseitinvar0() ∨ ¬p1() ∨ tseitinvar1()) ∧ (¬tseitinvar1() ∨ p2()) ∧ (¬tseitinvar1() ∨ p3()) ∧ (tseitinvar1() ∨ ¬p2() ∨ ¬p3()))".toString();
    }, {});
    runTest("toCNF-Decision Procedures example 1.29a-success", () => {
        let initialFormula = new Conjunction([p_list[2], p_list[3], p_list[4], p_list[5]]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (¬tseitinvar0() ∨ p2()) ∧ (¬tseitinvar0() ∨ p3()) ∧ (¬tseitinvar0() ∨ p4()) ∧ (¬tseitinvar0() ∨ p5()) ∧ (tseitinvar0() ∨ ¬p2() ∨ ¬p3() ∨ ¬p4() ∨ ¬p5()))".toString();
    }, {});
    runTest("toCNF-CS257 Fall 2022 Lecture 1 example-success", () => {
        let initialFormula = new Disjunction([new Conjunction([p_list[4], new Conjunction([p_list[1], p_list[2]])]), new Conjunction([new Conjunction([p_list[1], p_list[2]]), new Negation(p_list[3])])]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (tseitinvar0() ∨ ¬tseitinvar1()) ∧ (tseitinvar0() ∨ ¬tseitinvar3()) ∧ (¬tseitinvar0() ∨ tseitinvar1() ∨ tseitinvar3()) ∧ (¬tseitinvar1() ∨ p4()) ∧ (¬tseitinvar1() ∨ tseitinvar2()) ∧ (tseitinvar1() ∨ ¬p4() ∨ ¬tseitinvar2()) ∧ (¬tseitinvar2() ∨ p1()) ∧ (¬tseitinvar2() ∨ p2()) ∧ (tseitinvar2() ∨ ¬p1() ∨ ¬p2()) ∧ (¬tseitinvar3() ∨ tseitinvar4()) ∧ (¬tseitinvar3() ∨ ¬p3()) ∧ (tseitinvar3() ∨ ¬tseitinvar4() ∨ p3()) ∧ (¬tseitinvar4() ∨ p1()) ∧ (¬tseitinvar4() ∨ p2()) ∧ (tseitinvar4() ∨ ¬p1() ∨ ¬p2()))".toString();
    }, {});
    // These tests are disabled by default, as they only work properly when the checks in toCNF for QF and NNF formulae are disabled. 
    //runToCNF_helperTests();
}
// Tests for toCNF_helper. 
// These tests are disabled by default, as they only work properly when the checks in toCNF for QF and NNF formulae are disabled. 
function runToCNF_helperTests() {
    printTestingMessage_Start("toCNF_helper");
    let x_var = new Variable('X');
    let y_var = new Variable('Y');
    let p_pred = new Predicate('p');
    let p_x = new Literal(new Atom(p_pred, [x_var]), false);
    let p_y = new Literal(new Atom(p_pred, [y_var]), true);
    runTest("toCNF_helper-nonatomic negation-failure", () => {
        let initialFormula = new Negation(new Negation(p_x));
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ error())".toString();
    }, {});
    runTest("toCNF_helper-double negation-failure", () => {
        let initialFormula = new Negation(p_y);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ error())".toString();
    }, {});
    runTest("toCNF_helper-nonatomic negation as conjunct-failure", () => {
        let initialFormula = new Conjunction([new Negation(new Negation(p_x))]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ error())".toString();
    }, {});
    runTest("toCNF_helper-double negation as conjunct-failure", () => {
        let initialFormula = new Conjunction([new Negation(p_y)]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ error())".toString();
    }, {});
    runTest("toCNF_helper-nonatomic negation as disjunct-failure", () => {
        let initialFormula = new Disjunction([new Negation(new Negation(p_x))]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ error())".toString();
    }, {});
    runTest("toCNF_helper-double negation as disjunct-failure", () => {
        let initialFormula = new Disjunction([new Negation(p_y)]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ error())".toString();
    }, {});
    runTest("toCNF_helper-Implication-failure", () => {
        let initialFormula = new Implication(p_x, p_x);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ error())".toString();
    }, {});
    runTest("toCNF_helper-Implication as conjunct-failure", () => {
        let initialFormula = new Conjunction([new Implication(p_x, p_x)]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (¬tseitinvar0() ∨ tseitinvar1()) ∧ (tseitinvar0() ∨ ¬tseitinvar1()) ∧ error())".toString();
    }, {});
    runTest("toCNF_helper-Implication as disjunct-failure", () => {
        let initialFormula = new Disjunction([new Implication(p_x, p_x)]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (tseitinvar0() ∨ ¬tseitinvar1()) ∧ (¬tseitinvar0() ∨ tseitinvar1()) ∧ error())".toString();
    }, {});
    runTest("toCNF_helper-Biconditional-failure", () => {
        let initialFormula = new Biconditional(p_x, p_x);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ error())".toString();
    }, {});
    runTest("toCNF_helper-Biconditional as conjunct-failure", () => {
        let initialFormula = new Conjunction([new Biconditional(p_x, p_x)]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (¬tseitinvar0() ∨ tseitinvar1()) ∧ (tseitinvar0() ∨ ¬tseitinvar1()) ∧ error())".toString();
    }, {});
    runTest("toCNF_helper-Biconditional as disjunct-failure", () => {
        let initialFormula = new Disjunction([new Biconditional(p_x, p_x)]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (tseitinvar0() ∨ ¬tseitinvar1()) ∧ (¬tseitinvar0() ∨ tseitinvar1()) ∧ error())".toString();
    }, {});
    runTest("toCNF_helper-QuantifiedFormula-failure", () => {
        let initialFormula = bindFreeVars(new Implication(p_x, p_x));
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ error())".toString();
    }, {});
    runTest("toCNF_helper-QuantifiedFormula as conjunct-failure", () => {
        let initialFormula = new Conjunction([bindFreeVars(new Implication(p_x, p_x))]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (¬tseitinvar0() ∨ tseitinvar1()) ∧ (tseitinvar0() ∨ ¬tseitinvar1()) ∧ error())".toString();
    }, {});
    runTest("toCNF_helper-QuantifiedFormula as disjunct-failure", () => {
        let initialFormula = new Disjunction([bindFreeVars(new Implication(p_x, p_x))]);
        let result = toCNF(initialFormula);
        return result.toString() === "(tseitinvar0() ∧ (tseitinvar0() ∨ ¬tseitinvar1()) ∧ (¬tseitinvar0() ∨ tseitinvar1()) ∧ error())".toString();
    }, {});
}
export { runTests };
//# sourceMappingURL=transformations-tests.js.map