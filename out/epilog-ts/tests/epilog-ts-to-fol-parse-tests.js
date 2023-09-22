import { Biconditional } from "../../first-order-logic/classes/Biconditional.js";
import { Conjunction } from "../../first-order-logic/classes/Conjunction.js";
import { ERROR_FORMULA } from "../../first-order-logic/classes/Formula.js";
import { QuantifiedFormula } from "../../first-order-logic/classes/QuantifiedFormula.js";
import { printTestingMessage_Start, runTest } from "../../testing/testing.js";
import { EpilogJSToTS } from "../parsing/epilog-js-to-epilog-ts.js";
import { EpilogTSToFOL } from "../parsing/epilog-ts-to-fol.js";
// Unit tests for epilog-ts/parsing/epilog-ts-to-fol
function runTests() {
    runRuleListTests();
}
function runRuleListTests() {
    printTestingMessage_Start("Rule List - Single Rule");
    runTest("Rule List-empty-success", () => {
        let f = EpilogTSToFOL.parseRuleList([]);
        return f.toString() === '(true())' &&
            f instanceof Conjunction;
    }, {});
    // 1 rule, no body and no args
    runTest("Rule List-single rule, no body no args no-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p()'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1]);
        return ruleAsFOL.toString() === '(p() ⇔ ((true())))' &&
            ruleAsFOL instanceof Biconditional;
    }, {});
    // 1 rule, no args
    runTest("Rule List-single rule, no args-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p() :- q()'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1]);
        return ruleAsFOL.toString() === '(p() ⇔ ((q())))' &&
            ruleAsFOL instanceof Biconditional;
    }, {});
    // 1 rule, with 1 head var
    runTest("Rule List-single rule, 1 head var-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(X) :- q(X)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1]);
        return ruleAsFOL.toString() === '∀V0.((p(V0) ⇔ ((q(V0)))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    // 1 rule, with 2 head vars
    runTest("Rule List-single rule, 2 head var-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(X, Y) :- q(Y)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1]);
        return ruleAsFOL.toString() === '∀V0.(∀V1.((p(V0, V1) ⇔ ((q(V1))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    // 1 rule, with 3 head vars, two of which are the same
    runTest("Rule List-single rule, 3 head var, two identical-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(X, Y, X) :- q(Y, X)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1]);
        return ruleAsFOL.toString() === '∀V0.(∀V1.(∀V2.((p(V0, V1, V2) ⇔ ((q(V1, V0) ∧ same(V2, V0)))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    // 1 rule, with 1 head constant
    runTest("Rule List-single rule, 1 head constant-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(c) :- q(c)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1]);
        return ruleAsFOL.toString() === '∀V0.((p(V0) ⇔ ((q(c) ∧ same(V0, c)))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    // 1 rule, with 1 head compound term
    runTest("Rule List-single rule, 1 head compound term-1-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(f(X)) :- q(X)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1]);
        return ruleAsFOL.toString() === '∀V0.((p(V0) ⇔ (∃EV0.((q(EV0) ∧ same(V0, f(EV0)))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    runTest("Rule List-single rule, 1 head compound term-2-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(f(X, Y)) :- q(X)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1]);
        return ruleAsFOL.toString() === '∀V0.((p(V0) ⇔ (∃EV1.(∃EV0.((q(EV0) ∧ same(V0, f(EV0, EV1))))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    runTest("Rule List-single rule, 1 head compound term, 1 head var-1-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(f(X, Y), X) :- q(X)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1]);
        return ruleAsFOL.toString() === '∀V0.(∀V1.((p(V0, V1) ⇔ (∃EV0.((q(V1) ∧ same(V0, f(V1, EV0))))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    runTest("Rule List-single rule, 1 head compound term, 1 head var-2-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(X, f(X, Y)) :- q(X)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1]);
        return ruleAsFOL.toString() === '∀V0.(∀V1.((p(V0, V1) ⇔ (∃EV0.((q(V0) ∧ same(V1, f(V0, EV0))))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    // 1 rule, with 3 args, 1 of each different type of term
    runTest("Rule List-single rule, 3 head args of different types-1-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(f(X), X, c) :- q(X)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1]);
        return ruleAsFOL.toString() === '∀V0.(∀V1.(∀V2.((p(V0, V1, V2) ⇔ ((q(V1) ∧ same(V0, f(V1)) ∧ same(V2, c)))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    runTest("Rule List-single rule, 3 head args of different types-2-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(X, f(X), c) :- q(X)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1]);
        return ruleAsFOL.toString() === '∀V0.(∀V1.(∀V2.((p(V0, V1, V2) ⇔ ((q(V0) ∧ same(V1, f(V0)) ∧ same(V2, c)))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    // 1 rule, no body and with 3 head args, 1 of each different type of term
    runTest("Rule List-single rule, 3 head args of different types, no body-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(f(X), X, c, X)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1]);
        return ruleAsFOL.toString() === '∀V0.(∀V1.(∀V2.(∀V3.((p(V0, V1, V2, V3) ⇔ ((same(V0, f(V1)) ∧ same(V2, c) ∧ same(V3, V1))))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    // 1 rule, with no head vars and 1 body var
    runTest("Rule List-single rule, no head args, 1 body var-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p() :- q(X)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1]);
        return ruleAsFOL.toString() === '(p() ⇔ (∃EV0.((q(EV0)))))' &&
            ruleAsFOL instanceof Biconditional;
    }, {});
    // 1 rule, with no head vars and multiple body vars
    runTest("Rule List-single rule, no head args, multiple body var-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p() :- q(f(X), X, c, X) & r(Y)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1]);
        return ruleAsFOL.toString() === '(p() ⇔ (∃EV1.(∃EV0.((q(f(EV0), EV0, c, EV0) ∧ r(EV1))))))' &&
            ruleAsFOL instanceof Biconditional;
    }, {});
    // 1 rule, with multiple head and existential vars
    runTest("Rule List-single rule, multiple head args, multiple body var-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(X, Y, X) :- q(f(Z), Z, c, Z) & r(W)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1]);
        return ruleAsFOL.toString() === '∀V0.(∀V1.(∀V2.((p(V0, V1, V2) ⇔ (∃EV1.(∃EV0.((q(f(EV0), EV0, c, EV0) ∧ r(EV1) ∧ same(V2, V0)))))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    // 1 rule, with multiple head and existential vars, and two of each are the same
    runTest("Rule List-single rule, multiple head args, multiple body var, multiple same-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(X, Y, f(X), S, S, T) :- q(f(Z), Z, c, Z) & r(W) & r(S) & t(T)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1]);
        return ruleAsFOL.toString() === '∀V0.(∀V1.(∀V2.(∀V3.(∀V4.(∀V5.((p(V0, V1, V2, V3, V4, V5) ⇔ (∃EV1.(∃EV0.((q(f(EV0), EV0, c, EV0) ∧ r(EV1) ∧ r(V3) ∧ t(V5) ∧ same(V2, f(V0)) ∧ same(V4, V3))))))))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    printTestingMessage_Start("Rule List - Multiple Rules");
    // 2 rules, different head predicates
    runTest("Rule List-two rules, different head predicates-1-failure", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p()'));
        let rule2 = EpilogJSToTS.parseRule(read('q()'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === ERROR_FORMULA.toString();
    }, {});
    runTest("Rule List-two rules, different head predicates-2-failure", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p() :- q()'));
        let rule2 = EpilogJSToTS.parseRule(read('q() :- p()'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === ERROR_FORMULA.toString();
    }, {});
    runTest("Rule List-two rules, different head predicates-3-failure", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p()'));
        let rule2 = EpilogJSToTS.parseRule(read('q() :- p()'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === ERROR_FORMULA.toString();
    }, {});
    runTest("Rule List-two rules, different head predicates-4-failure", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p() :- q()'));
        let rule2 = EpilogJSToTS.parseRule(read('q()'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === ERROR_FORMULA.toString();
    }, {});
    // 2 rules, with no args, one with no body
    runTest("Rule List-two rules, no head args, one with no body-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p() :- q()'));
        let rule2 = EpilogJSToTS.parseRule(read('p()'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === '(p() ⇔ ((q()) ∨ (true())))' &&
            ruleAsFOL instanceof Biconditional;
    }, {});
    // 2 rules, with no head var
    runTest("Rule List-two rules, no head args-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p() :- q()'));
        let rule2 = EpilogJSToTS.parseRule(read('p() :- r()'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === '(p() ⇔ ((q()) ∨ (r())))' &&
            ruleAsFOL instanceof Biconditional;
    }, {});
    // 2 rules, with 1 head var, same between both
    runTest("Rule List-two rules, 1 head var, same in each-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(X) :- q(X)'));
        let rule2 = EpilogJSToTS.parseRule(read('p(X) :- r()'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === '∀V0.((p(V0) ⇔ ((q(V0)) ∨ (r()))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    // 2 rules, with 1 head var, different between both
    runTest("Rule List-two rules, 1 head var, different in each-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(X) :- q(X)'));
        let rule2 = EpilogJSToTS.parseRule(read('p(Y) :- r(Y)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === '∀V0.((p(V0) ⇔ ((q(V0)) ∨ (r(V0)))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    // 2 rules, 1 with head var and 1 with constant
    runTest("Rule List-two rules, 1 with head var, 1 with head constant-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(c) :- q(X)'));
        let rule2 = EpilogJSToTS.parseRule(read('p(Y) :- r(Y)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === '∀V0.((p(V0) ⇔ (∃EV0.((q(EV0) ∧ same(V0, c))) ∨ (r(V0)))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    // 2 rules, each with different constant
    runTest("Rule List-two rules, each with different constant-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(c) :- q(X)'));
        let rule2 = EpilogJSToTS.parseRule(read('p(d) :- r(Y)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === '∀V0.((p(V0) ⇔ (∃EV0.((q(EV0) ∧ same(V0, c))) ∨ ∃EV0.((r(EV0) ∧ same(V0, d))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    // 2 rules, each with same constant
    runTest("Rule List-two rules, each with same constant-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(c) :- q(X)'));
        let rule2 = EpilogJSToTS.parseRule(read('p(c) :- r(Y)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === '∀V0.((p(V0) ⇔ (∃EV0.((q(EV0) ∧ same(V0, c))) ∨ ∃EV0.((r(EV0) ∧ same(V0, c))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    // 2 rules, 1 with head var and 1 with compound term
    runTest("Rule List-two rules, 1 with head var, 1 with compound term-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(X) :- q(X)'));
        let rule2 = EpilogJSToTS.parseRule(read('p(f(X,Y)) :- r(Y)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === '∀V0.((p(V0) ⇔ ((q(V0)) ∨ ∃EV1.(∃EV0.((r(EV0) ∧ same(V0, f(EV1, EV0))))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    // 2 rules, 1 with compound term and 1 with constant
    runTest("Rule List-two rules, 1 with compound term, 1 with constant-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(f(X,Y)) :- r(Y)'));
        let rule2 = EpilogJSToTS.parseRule(read('p(c) :- r(Y)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === '∀V0.((p(V0) ⇔ (∃EV1.(∃EV0.((r(EV0) ∧ same(V0, f(EV1, EV0))))) ∨ ∃EV0.((r(EV0) ∧ same(V0, c))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    // 2 rules, both with compound terms
    runTest("Rule List-two rules, both with compound term-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(f(X, Y)) :- q(X)'));
        let rule2 = EpilogJSToTS.parseRule(read('p(f(X,Y)) :- r(Y)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === '∀V0.((p(V0) ⇔ (∃EV1.(∃EV0.((q(EV0) ∧ same(V0, f(EV0, EV1))))) ∨ ∃EV1.(∃EV0.((r(EV0) ∧ same(V0, f(EV1, EV0))))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    // Two complex rules
    runTest("Rule List-two rules, complex-1-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(c,X,d) :- q(X)'));
        let rule2 = EpilogJSToTS.parseRule(read('p(X,Y,Y) :- r(X) & s(Y) & t(Y)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === '∀V0.(∀V1.(∀V2.((p(V0, V1, V2) ⇔ ((q(V1) ∧ same(V0, c) ∧ same(V2, d)) ∨ (r(V0) ∧ s(V1) ∧ t(V1) ∧ same(V2, V1)))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    runTest("Rule List-two rules, complex-2-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(c,X,d) :- q(X)'));
        let rule2 = EpilogJSToTS.parseRule(read('p(X,Y,f(Y)) :- r(X) & s(Y) & t(f(Y))'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === '∀V0.(∀V1.(∀V2.((p(V0, V1, V2) ⇔ ((q(V1) ∧ same(V0, c) ∧ same(V2, d)) ∨ (r(V0) ∧ s(V1) ∧ t(f(V1)) ∧ same(V2, f(V1))))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    runTest("Rule List-two rules, complex-3-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(c,X,d) :- q(X)'));
        let rule2 = EpilogJSToTS.parseRule(read('p(X,Y,f(Y)) :- r(X) & s(Z) & t(W,4)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === '∀V0.(∀V1.(∀V2.((p(V0, V1, V2) ⇔ ((q(V1) ∧ same(V0, c) ∧ same(V2, d)) ∨ ∃EV1.(∃EV0.((r(V0) ∧ s(EV0) ∧ t(EV1, 4) ∧ same(V2, f(V1))))))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    runTest("Rule List-two rules, complex-4-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('ans(c)'));
        let rule2 = EpilogJSToTS.parseRule(read('ans(W) :- q(X,W)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === '∀V0.((ans(V0) ⇔ ((same(V0, c)) ∨ ∃EV0.((q(EV0, V0))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    runTest("Rule List-two rules, complex-5-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('ans(c, d)'));
        let rule2 = EpilogJSToTS.parseRule(read('ans(W, f(Z)) :- q(X,W)'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2]);
        return ruleAsFOL.toString() === '∀V0.(∀V1.((ans(V0, V1) ⇔ ((same(V0, c) ∧ same(V1, d)) ∨ ∃EV1.(∃EV0.((q(EV0, V0) ∧ same(V1, f(EV1)))))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
    // Many complex rules
    runTest("Rule List-multiple rules, complex-success", () => {
        let rule1 = EpilogJSToTS.parseRule(read('p(f(X), c)'));
        let rule2 = EpilogJSToTS.parseRule(read('p(X, f(X))'));
        let rule3 = EpilogJSToTS.parseRule(read('p(f(X), X)'));
        let rule4 = EpilogJSToTS.parseRule(read('p(f(X,Y), X)'));
        let rule5 = EpilogJSToTS.parseRule(read('p(Y, f(X,Y))'));
        let ruleAsFOL = EpilogTSToFOL.parseRuleList([rule1, rule2, rule3, rule4, rule5]);
        return ruleAsFOL.toString() === '∀V0.(∀V1.((p(V0, V1) ⇔ (∃EV0.((same(V0, f(EV0)) ∧ same(V1, c))) ∨ (same(V1, f(V0))) ∨ (same(V0, f(V1))) ∨ ∃EV0.((same(V0, f(V1, EV0)))) ∨ ∃EV0.((same(V1, f(EV0, V0))))))))' &&
            ruleAsFOL instanceof QuantifiedFormula;
    }, {});
}
export { runTests };
//# sourceMappingURL=epilog-ts-to-fol-parse-tests.js.map