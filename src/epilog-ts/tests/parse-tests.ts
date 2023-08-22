import { EpilogJSToTS } from "../parsing/epilog-js-to-epilog-ts.js";

import { runTest } from "../../testing/testing.js";
import { ERROR_ATOM } from "../classes/Atom.js";
import { ERROR_LITERAL } from "../classes/Literal.js";
import { ERROR_RULE } from "../classes/Rule.js";

// Unit tests for epilog-ts/parsing files
function runTests() : void {
    runEpilogJSToTSTests();
}

function runEpilogJSToTSTests() : void {
    runEpilogJSToTS_AtomAndLiteralTests();
    runEpilogJSToTS_RuleTests();
}

// Atom and term parsing
function runEpilogJSToTS_AtomAndLiteralTests() {
    console.log("    ===== Simple Atoms ====")

    runTest("JStoTS-atom-errorstring-error", () => {
        return EpilogJSToTS.parseAtom("error") === ERROR_ATOM;
    },{});
    
    runTest("JStoTS-atom-blankargs-error", () => {
        let strToRead : string = "noargs( , )";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom) === ERROR_ATOM;
    },{});
    
    runTest("JStoTS-atom-noargs-success", () => {
        let strToRead : string = "noargs()";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === strToRead;
    },{});

    runTest("JStoTS-atom-noargs-noparens-success", () => {
        let strToRead : string = "noargs";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === strToRead+"()";
    },{});

    runTest("JStoTS-atom-single-simple-arg-success", () => {
        let strToRead : string = "args(simple_term)";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === strToRead;
    },{});

    runTest("JStoTS-atom-multiple-simple-args-success", () => {
        let strToRead : string = "args(term1, term2, term3, term4)";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === strToRead;
    },{});
    
    runTest("JStoTS-atom-single-complex-arg-success", () => {
        let strToRead : string = "args(a_function_constant(singlearg))";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === strToRead;
    },{});
    
    runTest("JStoTS-atom-multiple-complex-arg-success", () => {
        let strToRead : string = "args(f(), g(f()), h(g(simple), simple))";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === strToRead;
    },{});
    
    console.log("    ===== Atoms with Lists ====")

    // List parsing
    runTest("JStoTS-atom-list-empty-success", () => {
        let strToRead : string = "args([])";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === "args(nil)";
    },{});
    
    runTest("JStoTS-atom-list-single-simple-term-success", () => {
        let strToRead : string = "args([oneterm])";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === "args(cons(oneterm, nil))";
    },{});
    
    runTest("JStoTS-atom-list-single-complex-term-success", () => {
        let strToRead : string = "args([f(complex(term))])";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === "args(cons(f(complex(term)), nil))";
    },{});
    

    runTest("JStoTS-atom-list-multiple-terms-success", () => {
        let strToRead : string = "args([f(complex(term)), simple_term, h(g(simple), simple)])";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === "args(cons(f(complex(term)), cons(simple_term, cons(h(g(simple), simple), nil))))";
    },{});

    // Variable parsing

    console.log("    ===== Atoms with Vars ====")

    runTest("JStoTS-atom-single-variable-success", () => {
        let strToRead : string = "args(X)";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === strToRead;
    },{});

    runTest("JStoTS-atom-multiple-variables-success", () => {
        let strToRead : string = "args(X, minor_test, Y)";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === strToRead;
    },{});

    runTest("JStoTS-atom-nested-variables-success", () => {
        let strToRead : string = "args(f(g(X)), minor_test, [Y])";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === "args(f(g(X)), minor_test, cons(Y, nil))";
    },{});

    runTest("JStoTS-atom-multiple-variables-complex-success", () => {
        let strToRead : string = "args([f(complex(X)), simple_term, h(g(simple), C)])";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === "args(cons(f(complex(X)), cons(simple_term, cons(h(g(simple), C), nil))))";
    },{});
    

    // Literal parsing
    console.log("    ===== Literals ====")

    runTest("JStoTS-literal-errorstring-error", () => {
        return EpilogJSToTS.parseLiteral("error") === ERROR_LITERAL;
    },{});

    runTest("JStoTS-literal-blankargs-error", () => {
        let strToRead : string = "noargs( , )";
        let epilogJSLiteral = read(strToRead);
        return EpilogJSToTS.parseLiteral(epilogJSLiteral) === ERROR_LITERAL;
    },{});

    runTest("JStoTS-literal-negated-success", () => {
        let strToRead : string = "~args([f(complex(term)), simple_term, h(g(simple), simple)])";
        let epilogJSLiteral = read(strToRead);
        return EpilogJSToTS.parseLiteral(epilogJSLiteral).toString() === "~args(cons(f(complex(term)), cons(simple_term, cons(h(g(simple), simple), nil))))";
    },{});

    runTest("JStoTS-literal-nonnegated-success", () => {
        let strToRead : string = "args([f(complex(term)), simple_term, h(g(simple), simple)])";
        let epilogJSLiteral = read(strToRead);
        return EpilogJSToTS.parseLiteral(epilogJSLiteral).toString() === "args(cons(f(complex(term)), cons(simple_term, cons(h(g(simple), simple), nil))))";
    },{});
}

function runEpilogJSToTS_RuleTests() {
    console.log("    ===== Rules ====");

    runTest("JStoTS-rule-errorstring-error", () => {
        return EpilogJSToTS.parseRule("error") === ERROR_RULE;
    },{});

    runTest("JStoTS-rule-blankbody-error", () => {
        let strToRead : string = "r1() :-";
        let epilogJSRule = read(strToRead);
        return EpilogJSToTS.parseRule(epilogJSRule) === ERROR_RULE;
    },{});

    runTest("JStoTS-rule-noargs-noparens-success", () => {
        let strToRead : string = "boolean_intensional_pred";
        let epilogJSRule = read(strToRead);
        return EpilogJSToTS.parseRule(epilogJSRule).toString() === strToRead+"()";
    },{});

    runTest("JStoTS-rule-nosubgoals-success", () => {
        let strToRead : string = "ans(W)";
        let epilogJSRule = read(strToRead);
        return EpilogJSToTS.parseRule(epilogJSRule).toString() === strToRead;
    },{});

    runTest("JStoTS-rule-single-subgoal-success", () => {
        let strToRead : string = "ans(W) :- r1(X)";
        let epilogJSRule = read(strToRead);
        return EpilogJSToTS.parseRule(epilogJSRule).toString() === strToRead;
    },{});

    runTest("JStoTS-rule-multiple-subgoal-success", () => {
        let strToRead : string = "ans(W) :- r1(X) & p1(f(W), some_sym)";
        let epilogJSRule = read(strToRead);
        return EpilogJSToTS.parseRule(epilogJSRule).toString() === strToRead;
    },{});

    runTest("JStoTS-rule-boolean-subgoal-success", () => {
        let strToRead : string = "ans(W) :- r1(X) & some_bool";
        let epilogJSRule = read(strToRead);
        return EpilogJSToTS.parseRule(epilogJSRule).toString() === "ans(W) :- r1(X) & some_bool()";
    },{});

}

export {
    runTests
}