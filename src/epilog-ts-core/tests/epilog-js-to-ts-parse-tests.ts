import { EpilogJSToTS } from "../parsing/epilog-js-to-epilog-ts.js";

import { printTestingMessage_Start, runTest } from "../../testing/testing.js";
import { ERROR_ATOM } from "../classes/Atom.js";
import { ERROR_LITERAL } from "../classes/Literal.js";
import { ERROR_RULE } from "../classes/Rule.js";

import { STRESS_TEST_DATASET_INPUT, STRESS_TEST_DATASET_OUTPUT, STRESS_TEST_RULESET_INPUT, STRESS_TEST_RULESET_OUTPUT } from "./stress-inputs-outputs.js";

// Unit tests for epilog-ts-core/parsing/epilog-js-to-epilog-ts
function runTests() : void {
    runEpilogJSToTSTests();
}

function runEpilogJSToTSTests() : void {
    runEpilogJSToTS_AtomAndLiteralTests();
    runEpilogJSToTS_RuleTests();
    runEpilogJSToTS_DatasetTests();
    runEpilogJSToTS_RulesetTests();
}

// Atom and term parsing
function runEpilogJSToTS_AtomAndLiteralTests() : void {
    printTestingMessage_Start("Simple Atoms")

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
    
    printTestingMessage_Start("Atoms with Lists");

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

    printTestingMessage_Start("Atoms with Vars")

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
    printTestingMessage_Start("Literals");

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

function runEpilogJSToTS_RuleTests() : void {
    printTestingMessage_Start("Rules")

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
    
    /*runTest("JStoTS-rule-anonymousVar-success", () => {
        let strToRead : string = "ans(W) :- r1(X) & q(_,X)";
        let epilogJSRule = read(strToRead);
        return EpilogJSToTS.parseRule(epilogJSRule).toString() === "ans(W) :- r1(X) & some_bool()";
    },{});*/

}

function runEpilogJSToTS_DatasetTests() : void {
    printTestingMessage_Start("Datasets")

    runTest("JStoTS-dataset-readdata-nonground-error", () => {
        let strToRead : string = "p(a) g(X)";
        let epilogJSDataset = readdata(strToRead);
        return EpilogJSToTS.parseDataset(epilogJSDataset).toEpilogString() === "error()";
    },{});

    runTest("JStoTS-dataset-read-single-fact-success", () => {
        let strToRead : string = "p(a)";
        let epilogJSDataset = [read(strToRead)];
        return EpilogJSToTS.parseDataset(epilogJSDataset).toEpilogString() === strToRead;
    },{});

    runTest("JStoTS-dataset-readdata-single-fact-success", () => {
        let strToRead : string = "p(a)";
        let epilogJSDataset = readdata(strToRead);
        return EpilogJSToTS.parseDataset(epilogJSDataset).toEpilogString() === strToRead;
    },{});

    runTest("JStoTS-dataset-readdata-many-facts-success", () => {
        let strToRead : string = "p(a) p(b)";
        let epilogJSDataset = readdata(strToRead);
        return EpilogJSToTS.parseDataset(epilogJSDataset).toEpilogString() === strToRead;
    },{});

    runTest("JStoTS-dataset-readdata-many-facts-with-boolean-pred-success", () => {
        let strToRead : string = "p(a) p(b) true g(c)";
        let epilogJSDataset = readdata(strToRead);
        return EpilogJSToTS.parseDataset(epilogJSDataset).toEpilogString() === "p(a) p(b) true() g(c)";
    },{});

    runTest("JStoTS-dataset-readdata-listarg-success", () => {
        let strToRead : string = "p([a, b, c])";
        let epilogJSDataset = readdata(strToRead);
        return EpilogJSToTS.parseDataset(epilogJSDataset).toEpilogString() === "p(cons(a, cons(b, cons(c, nil))))";
    },{});

    runTest("JStoTS-dataset-stresstest-success", () => {
        let strToRead : string = STRESS_TEST_DATASET_INPUT;
        let epilogJSDataset = readdata(strToRead);
        return EpilogJSToTS.parseDataset(epilogJSDataset).toEpilogString() === STRESS_TEST_DATASET_OUTPUT;
    },{});
}

function runEpilogJSToTS_RulesetTests() : void {
    printTestingMessage_Start("Rulesets");
    
    runTest("JStoTS-ruleset-read-single-rule-success", () => {
        let strToRead : string = "r1() :- goal1 & goal2() & goal3(X,Y) & ~goal4(X)";
        let epilogJSRuleset = [read(strToRead)];
        //console.log(EpilogJSToTS.parseRuleset(epilogJSRuleset).toEpilogString());
        return EpilogJSToTS.parseRuleset(epilogJSRuleset).toEpilogString() === "r1() :- goal1() & goal2() & goal3(X, Y) & ~goal4(X)";
    },{});

    runTest("JStoTS-ruleset-readdata-single-rule-success", () => {
        let strToRead : string = "r1() :- goal1 & goal2() & goal3(X,Y) & ~goal4(X)";
        let epilogJSRuleset = readdata(strToRead);
        return EpilogJSToTS.parseRuleset(epilogJSRuleset).toEpilogString() === "r1() :- goal1() & goal2() & goal3(X, Y) & ~goal4(X)";
    },{});

    runTest("JStoTS-ruleset-readdata-many-rules-success", () => {
        let strToRead : string = "r1() :- goal1 & goal2() & goal3(X, Y) & ~goal4(X) r2(Z) :- goal2(Z) bool_pred another_bool_pred ans(W) bool_head :- still_has_goal(X)";
        let epilogJSRuleset = readdata(strToRead);
        return EpilogJSToTS.parseRuleset(epilogJSRuleset).toEpilogString() === "r1() :- goal1() & goal2() & goal3(X, Y) & ~goal4(X)\nr2(Z) :- goal2(Z)\nbool_pred()\nanother_bool_pred()\nans(W)\nbool_head() :- still_has_goal(X)";
    },{});

    // With definitions

    runTest("JStoTS-ruleset-readdata-with-single-definition-success", () => {
        let strToRead : string = 'parsedate(DATE) := map(readstring,tail(matches(stringify(DATE),"(....)_(..)_(..)")))';
        let epilogJSRuleset = readdata(strToRead);
        return EpilogJSToTS.parseRuleset(epilogJSRuleset).toEpilogString() === "";
    },{});

    runTest("JStoTS-ruleset-readdata-with-many-definitions-success", () => {
        let strToRead : string = "r1() :- goal1 & goal2() & goal3(X,Y) & ~goal4(X) parsedate(DATE) := map(readstring,tail(matches(stringify(DATE),\"(....)_(..)_(..)\"))) head(X!L) := X tail(X!L) := L";
        let epilogJSRuleset = readdata(strToRead);
        return EpilogJSToTS.parseRuleset(epilogJSRuleset).toEpilogString() === "r1() :- goal1() & goal2() & goal3(X, Y) & ~goal4(X)";
    },{});

    runTest("JStoTS-ruleset-readdata-with-definition-preds-1-success", () => {
        let strToRead : string = 'definition()';
        let epilogJSRuleset = readdata(strToRead);
        return EpilogJSToTS.parseRuleset(epilogJSRuleset).toEpilogString() === "";
    },{});

    runTest("JStoTS-ruleset-readdata-with-definition-preds-2-success", () => {
        let strToRead : string = 'definition';
        let epilogJSRuleset = readdata(strToRead);
        return EpilogJSToTS.parseRuleset(epilogJSRuleset).toEpilogString() === "definition()";
    },{});

    runTest("JStoTS-ruleset-readdata-with-definition-preds-3-success", () => {
        // The first and third rules are parsed, the second is ignored
        let strToRead : string = 'definition definition() definition(X) :- p1(X)';
        let epilogJSRuleset = readdata(strToRead);
        return EpilogJSToTS.parseRuleset(epilogJSRuleset).toEpilogString() === "definition()\ndefinition(X) :- p1(X)";
    },{});

    // Stresstest

    runTest("JStoTS-ruleset-readdata-stresstest-success", () => {
        let strToRead : string = STRESS_TEST_RULESET_INPUT;
        let epilogJSRuleset = readdata(strToRead);
        //console.log(EpilogJSToTS.parseRuleset(epilogJSRuleset).toEpilogString());
        //console.log(STRESS_TEST_RULESET_OUTPUT);


        return EpilogJSToTS.parseRuleset(epilogJSRuleset).toEpilogString() === STRESS_TEST_RULESET_OUTPUT;
    },{});

}

export {
    runTests
}