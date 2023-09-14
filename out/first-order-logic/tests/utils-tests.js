import { Atom } from "../../epilog-ts/classes/Atom.js";
import { Literal } from "../../epilog-ts/classes/Literal.js";
import { Predicate } from "../../epilog-ts/classes/Predicate.js";
import { Symbol, Variable } from "../../epilog-ts/classes/Term.js";
import { printTestingMessage_Start, runTest } from "../../testing/testing.js";
import { Biconditional } from "../classes/Biconditional.js";
import { Conjunction } from "../classes/Conjunction.js";
import { Disjunction } from "../classes/Disjunction.js";
import { ERROR_FORMULA } from "../classes/Formula.js";
import { Implication } from "../classes/Implication.js";
import { Negation } from "../classes/Negation.js";
import { QuantifiedFormula, Quantifier } from "../classes/QuantifiedFormula.js";
import { bindFreeVars } from "../transformations/general.js";
import { isInNNF } from "../utils/general.js";
import { standardizeVarNames } from "../utils/standardize.js";
// Unit tests for {first-order-log/utils} files
function runTests() {
    runGeneralTests();
    runStandardizeTests();
}
function runGeneralTests() {
    printTestingMessage_Start("General Utils");
    runIsInNNFTests();
}
function runIsInNNFTests() {
    let x_var = new Variable('X');
    let y_var = new Variable('Y');
    let p_pred = new Predicate('p');
    let q_pred = new Predicate('q');
    let p_x = new Literal(new Atom(p_pred, [x_var]), false);
    let p_y = new Literal(new Atom(p_pred, [y_var]), true);
    let q_x = new Literal(new Atom(q_pred, [x_var]), false);
    let f2 = bindFreeVars(new Conjunction([q_x, new QuantifiedFormula(Quantifier.Existential, x_var, p_x)]));
    let f5 = bindFreeVars(new QuantifiedFormula(Quantifier.Universal, y_var, new Disjunction([new QuantifiedFormula(Quantifier.Existential, x_var, p_x), new QuantifiedFormula(Quantifier.Existential, x_var, p_x)])));
    runTest("isInNNF-positive Literal-success", () => {
        return isInNNF(p_x);
    }, {});
    runTest("isInNNF-negative Literal-success", () => {
        return isInNNF(p_y);
    }, {});
    runTest("isInNNF-negated negative Literal-failure", () => {
        return !isInNNF(new Negation(p_y));
    }, {});
    runTest("isInNNF-negated positive Literal-success", () => {
        return isInNNF(new Negation(p_x));
    }, {});
    runTest("isInNNF-negated Conjunction-failure", () => {
        return !isInNNF(new Negation(new Conjunction([q_x, new QuantifiedFormula(Quantifier.Existential, x_var, p_x)])));
    }, {});
    runTest("isInNNF-Conjunction-success", () => {
        return isInNNF(new Conjunction([q_x, new QuantifiedFormula(Quantifier.Existential, x_var, p_x)]));
    }, {});
    runTest("isInNNF-Disjunction-success", () => {
        return isInNNF(new Disjunction([q_x, new QuantifiedFormula(Quantifier.Existential, x_var, p_x)]));
    }, {});
    runTest("isInNNF-QuantifiedFormula-success", () => {
        return isInNNF(new QuantifiedFormula(Quantifier.Universal, x_var, (new Conjunction([q_x, new QuantifiedFormula(Quantifier.Existential, x_var, p_x)]))));
    }, {});
    runTest("isInNNF-Implication-failure", () => {
        return !isInNNF(new Implication(f5, f2));
    }, {});
    runTest("isInNNF-Biconditional-failure", () => {
        return !isInNNF(new Biconditional(f5, f2));
    }, {});
}
function runStandardizeTests() {
    printTestingMessage_Start("Standardize");
    runStandardizeVarNamesTests();
}
function runStandardizeVarNamesTests() {
    printTestingMessage_Start("Standardize Variable Names");
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
    let s_xyz = new Literal(new Atom(s_pred, [x_var, y_var, z_var]), false);
    let s_zyxx = new Literal(new Atom(s_pred, [z_var, y_var, x_var, x_var]), false);
    let np_x = new Negation(p_x);
    let f1 = new Conjunction([new QuantifiedFormula(Quantifier.Existential, x_var, p_x), q_x]);
    let f2 = new Conjunction([q_x, new QuantifiedFormula(Quantifier.Existential, x_var, p_x)]);
    let f3 = new Disjunction([p_y, new QuantifiedFormula(Quantifier.Existential, x_var, p_x)]);
    let f4 = new QuantifiedFormula(Quantifier.Universal, y_var, new Disjunction([p_y, new QuantifiedFormula(Quantifier.Existential, x_var, p_x)]));
    // A free var
    runTest("Standardize-Var-Names-free-var-failure", () => {
        let initialFormula = p_x;
        let result = standardizeVarNames(initialFormula);
        return result.toString() === ERROR_FORMULA.toString();
    }, {});
    // Literal, which can't be top-level while containing a variable
    runTest("Standardize-Var-Names-Literal-without-var-success", () => {
        let initialFormula = p_c;
        let result = standardizeVarNames(bindFreeVars(initialFormula));
        return result.toString() === "p(c)";
    }, {});
    runTest("Standardize-Var-Names-Literal-with-var-success", () => {
        let initialFormula = p_x;
        let result = standardizeVarNames(bindFreeVars(initialFormula));
        return result.toString() === "∀V0.(p(V0))";
    }, {});
    // Negation
    runTest("Standardize-Var-Names-Negation-top-level-success", () => {
        let initialFormula = np_x;
        let result = standardizeVarNames(bindFreeVars(initialFormula));
        return result.toString() === "∀V0.(¬p(V0))";
    }, {});
    // Conjunction
    runTest("Standardize-Var-Names-Conjunction-top-level-success", () => {
        let initialFormula = new Conjunction([np_x, p_x, s_xyz]);
        let result = standardizeVarNames(bindFreeVars(initialFormula));
        return result.toString() === "∀V0.(∀V1.(∀V2.((¬p(V0) ∧ p(V0) ∧ s(V0, V1, V2)))))";
    }, {});
    // Disjunction
    runTest("Standardize-Var-Names-Disjunction-top-level-success", () => {
        let initialFormula = new Disjunction([np_x, p_x, s_xyz]);
        let result = standardizeVarNames(bindFreeVars(initialFormula));
        return result.toString() === "∀V0.(∀V1.(∀V2.((¬p(V0) ∨ p(V0) ∨ s(V0, V1, V2)))))";
    }, {});
    // Implication
    runTest("Standardize-Var-Names-Implication-top-level-success", () => {
        let initialFormula = new Implication(np_x, s_xyz);
        let result = standardizeVarNames(bindFreeVars(initialFormula));
        return result.toString() === "∀V0.(∀V1.(∀V2.((¬p(V0) ⇒ s(V0, V1, V2)))))";
    }, {});
    // Biconditional
    runTest("Standardize-Var-Names-Biconditional-top-level-success", () => {
        let initialFormula = new Biconditional(np_x, s_xyz);
        let result = standardizeVarNames(bindFreeVars(initialFormula));
        return result.toString() === "∀V0.(∀V1.(∀V2.((¬p(V0) ⇔ s(V0, V1, V2)))))";
    }, {});
    // QuantifiedFormula
    // Nested simply, no collisions
    runTest("Standardize-Var-Names-Quantifiers-nested-no-collision-success", () => {
        let initialFormula = f4;
        let result = standardizeVarNames(bindFreeVars(initialFormula));
        return result.toString() === "∀V0.((~p(V0) ∨ ∃V1.(p(V1))))";
    }, {});
    // Name collisions
    // Nested leftly
    runTest("Standardize-Var-Names-Quantifiers-nested-left-collision-success", () => {
        let initialFormula = f1;
        let result = standardizeVarNames(bindFreeVars(initialFormula));
        return result.toString() === "∀V0.((∃V1.(p(V1)) ∧ q(V0)))";
    }, {});
    // Nested rightly
    runTest("Standardize-Var-Names-Quantifiers-nested-right-collision-success", () => {
        let initialFormula = f2;
        let result = standardizeVarNames(bindFreeVars(initialFormula));
        return result.toString() === "∀V0.((q(V0) ∧ ∃V1.(p(V1))))";
    }, {});
}
export { runTests };
//# sourceMappingURL=utils-tests.js.map