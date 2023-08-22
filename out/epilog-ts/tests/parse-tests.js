import { EpilogJSToTS } from "../parsing/epilog-js-to-epilog-ts.js";
import { runTest } from "../../testing/testing.js";
import { ERROR_ATOM } from "../classes/Atom.js";
import { ERROR_LITERAL } from "../classes/Literal.js";
// Unit tests for epilog-ts/parsing files
function runTests() {
    runEpilogJSToTSTests();
}
function runEpilogJSToTSTests() {
    runEpilogJSToTS_AtomAndLiteralTests();
}
// Atom and term parsing
function runEpilogJSToTS_AtomAndLiteralTests() {
    console.log("    ===== Simple Atoms ====");
    runTest("JStoTS-noargs-success", () => {
        let strToRead = "noargs()";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === strToRead;
    }, {});
    runTest("JStoTS-errorstring-error", () => {
        return EpilogJSToTS.parseAtom("error") === ERROR_ATOM;
    }, {});
    runTest("JStoTS-blankargs-error", () => {
        let strToRead = "noargs( , )";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom) === ERROR_ATOM;
    }, {});
    runTest("JStoTS-single-simple-arg-success", () => {
        let strToRead = "args(simple_term)";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === strToRead;
    }, {});
    runTest("JStoTS-multiple-simple-args-success", () => {
        let strToRead = "args(term1, term2, term3, term4)";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === strToRead;
    }, {});
    runTest("JStoTS-single-complex-arg-success", () => {
        let strToRead = "args(a_function_constant(singlearg))";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === strToRead;
    }, {});
    runTest("JStoTS-multiple-complex-arg-success", () => {
        let strToRead = "args(f(), g(f()), h(g(simple), simple))";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === strToRead;
    }, {});
    console.log("    ===== Atoms with Lists ====");
    // List parsing
    runTest("JStoTS-list-empty-success", () => {
        let strToRead = "args([])";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === "args(nil)";
    }, {});
    runTest("JStoTS-list-single-simple-term-success", () => {
        let strToRead = "args([oneterm])";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === "args(cons(oneterm, nil))";
    }, {});
    runTest("JStoTS-list-single-complex-term-success", () => {
        let strToRead = "args([f(complex(term))])";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === "args(cons(f(complex(term)), nil))";
    }, {});
    runTest("JStoTS-list-multiple-terms-success", () => {
        let strToRead = "args([f(complex(term)), simple_term, h(g(simple), simple)])";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === "args(cons(f(complex(term)), cons(simple_term, cons(h(g(simple), simple), nil))))";
    }, {});
    // Variable parsing
    console.log("    ===== Atoms with Vars ====");
    runTest("JStoTS-single-variable-success", () => {
        let strToRead = "args(X)";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === strToRead;
    }, {});
    runTest("JStoTS-multiple-variables-success", () => {
        let strToRead = "args(X, minor_test, Y)";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === strToRead;
    }, {});
    runTest("JStoTS-nested-variables-success", () => {
        let strToRead = "args(f(g(X)), minor_test, [Y])";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === "args(f(g(X)), minor_test, cons(Y, nil))";
    }, {});
    runTest("JStoTS-multiple-variables-complex-success", () => {
        let strToRead = "args([f(complex(X)), simple_term, h(g(simple), C)])";
        let epilogJSAtom = read(strToRead);
        return EpilogJSToTS.parseAtom(epilogJSAtom).toString() === "args(cons(f(complex(X)), cons(simple_term, cons(h(g(simple), C), nil))))";
    }, {});
    // Literal parsing
    console.log("    ===== Literals ====");
    runTest("JStoTS-literal-errorstring-error", () => {
        return EpilogJSToTS.parseLiteral("error") === ERROR_LITERAL;
    }, {});
    runTest("JStoTS-literal-blankargs-error", () => {
        let strToRead = "noargs( , )";
        let epilogJSLiteral = read(strToRead);
        return EpilogJSToTS.parseLiteral(epilogJSLiteral) === ERROR_LITERAL;
    }, {});
    runTest("JStoTS-negated-success", () => {
        let strToRead = "~args([f(complex(term)), simple_term, h(g(simple), simple)])";
        let epilogJSLiteral = read(strToRead);
        return EpilogJSToTS.parseLiteral(epilogJSLiteral).toString() === "~args(cons(f(complex(term)), cons(simple_term, cons(h(g(simple), simple), nil))))";
    }, {});
    runTest("JStoTS-nonnegated-success", () => {
        let strToRead = "args([f(complex(term)), simple_term, h(g(simple), simple)])";
        let epilogJSLiteral = read(strToRead);
        return EpilogJSToTS.parseLiteral(epilogJSLiteral).toString() === "args(cons(f(complex(term)), cons(simple_term, cons(h(g(simple), simple), nil))))";
    }, {});
}
export { runTests };
//# sourceMappingURL=parse-tests.js.map