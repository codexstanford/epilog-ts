import { CQContainmentTester } from "../cq-containment.js";
import { Predicate } from "../epilog-ts/classes/Predicate.js";
import { ConjunctiveQuery } from "../epilog-ts/classes/Query.js";
import { StrToTS } from "../epilog-ts/parsing/string-to-epilog-ts.js";
import { printTestingMessage_Start, runTest } from "../testing/testing.js";
// Unit tests for containment testing files
function runTests() {
    runCQContainmentTesterTests();
}
function runCQContainmentTesterTests() {
    printTestingMessage_Start("CQ Containment Tester");
    runTest("CQContainment-reflexive-true", () => {
        let cqTester = new CQContainmentTester();
        let q1 = new ConjunctiveQuery(new Predicate("q"), StrToTS.parseRule("q(X,Y) :- a(X,Z) & b(Y) & c(hosp2)"));
        return cqTester.containedWithin(q1, q1);
    }, {});
    runTest("CQContainment-ground-true", () => {
        let cqTester = new CQContainmentTester();
        let q1 = new ConjunctiveQuery(new Predicate("q"), StrToTS.parseRule("q() :- person.name(bob, \"Robert\")"));
        let q2 = new ConjunctiveQuery(new Predicate("q"), StrToTS.parseRule("q() :- person.name(bob, \"Robert\") & person.spouse(bob, susan)"));
        return cqTester.containedWithin(q2, q1);
    }, {});
    runTest("CQContainment-ground-false", () => {
        let cqTester = new CQContainmentTester();
        let q1 = new ConjunctiveQuery(new Predicate("q"), StrToTS.parseRule("q() :- person.name(bob, \"Robert\")"));
        let q2 = new ConjunctiveQuery(new Predicate("q"), StrToTS.parseRule("q() :- person.name(bob, \"Robert\") & person.spouse(bob, susan)"));
        return !cqTester.containedWithin(q1, q2);
    }, {});
    runTest("CQContainment-simple-1-true", () => {
        let cqTester = new CQContainmentTester();
        let q1 = new ConjunctiveQuery(new Predicate("q"), StrToTS.parseRule("q(X,Y) :- a(X,Z) & b(Y) & c(hosp2)"));
        let q2 = new ConjunctiveQuery(new Predicate("q"), StrToTS.parseRule("q(X,Y) :- a(X,Z) & b(Y)"));
        return cqTester.containedWithin(q1, q2);
    }, {});
    runTest("CQContainment-simple-1-false", () => {
        let cqTester = new CQContainmentTester();
        let q1 = new ConjunctiveQuery(new Predicate("q"), StrToTS.parseRule("q(X,Y) :- a(X,Z) & b(Y) & c(hosp2)"));
        let q2 = new ConjunctiveQuery(new Predicate("q"), StrToTS.parseRule("q(X,Y) :- a(X,Z) & b(Y)"));
        return !cqTester.containedWithin(q2, q1);
    }, {});
    runTest("CQContainment-simple-2-true", () => {
        let cqTester = new CQContainmentTester();
        let q1 = new ConjunctiveQuery(new Predicate("q"), StrToTS.parseRule("q(X,Y) :- b1(X,Y)"));
        let q2 = new ConjunctiveQuery(new Predicate("q"), StrToTS.parseRule("q(X,Y) :- b1(X,Y) &  b1(X,X)"));
        return cqTester.containedWithin(q2, q1);
    }, {});
    runTest("CQContainment-simple-2-false", () => {
        let cqTester = new CQContainmentTester();
        let q1 = new ConjunctiveQuery(new Predicate("q"), StrToTS.parseRule("q(X,Y) :- b1(X,Y)"));
        let q2 = new ConjunctiveQuery(new Predicate("q"), StrToTS.parseRule("q(X,Y) :- b1(X,Y) &  b1(X,X)"));
        return !cqTester.containedWithin(q1, q2);
    }, {});
    runTest("CQContainment-simple-3-true", () => {
        let cqTester = new CQContainmentTester();
        let q1 = new ConjunctiveQuery(new Predicate("p"), StrToTS.parseRule("p(X,Y) :- r(X,Y) & r(Y,X) & b1(X) & b3()"));
        let q2 = new ConjunctiveQuery(new Predicate("p"), StrToTS.parseRule("p(X,Y) :- r(X,Y) & r(Y,Z)"));
        return cqTester.containedWithin(q1, q2);
    }, {});
    runTest("CQContainment-simple-3-false", () => {
        let cqTester = new CQContainmentTester();
        let q1 = new ConjunctiveQuery(new Predicate("p"), StrToTS.parseRule("p(X,Y) :- r(X,Y) & r(Y,X) & b1(X) & b3()"));
        let q2 = new ConjunctiveQuery(new Predicate("p"), StrToTS.parseRule("p(X,Y) :- r(X,Y) & r(Y,Z)"));
        return !cqTester.containedWithin(q2, q1);
    }, {});
    runTest("CQContainment-simple-4a-false", () => {
        let cqTester = new CQContainmentTester();
        let q1 = new ConjunctiveQuery(new Predicate("p"), StrToTS.parseRule("p(X,Y,Z) :- r1(X,Y,Z) & q(Z,Z)"));
        let q2 = new ConjunctiveQuery(new Predicate("p"), StrToTS.parseRule("p(X,Y,Z) :- r1(X,Y,Z) & q(Z,Y)"));
        return !cqTester.containedWithin(q1, q2);
    }, {});
    runTest("CQContainment-simple-4b-false", () => {
        let cqTester = new CQContainmentTester();
        let q1 = new ConjunctiveQuery(new Predicate("p"), StrToTS.parseRule("p(X,Y,Z) :- r1(X,Y,Z) & q(Z,Z)"));
        let q2 = new ConjunctiveQuery(new Predicate("p"), StrToTS.parseRule("p(X,Y,Z) :- r1(X,Y,Z) & q(Z,Y)"));
        return !cqTester.containedWithin(q2, q1);
    }, {});
    runTest("CQContainment-simple-5-true", () => {
        let cqTester = new CQContainmentTester();
        let q1 = new ConjunctiveQuery(new Predicate("p"), StrToTS.parseRule("p(X,Y,Z) :- r1(X,Y,Z) & q(Z,Z)"));
        let q2 = new ConjunctiveQuery(new Predicate("p"), StrToTS.parseRule("p(X,Y,Z) :- r1(X,Y,Z) & q(Z,W)"));
        return cqTester.containedWithin(q1, q2);
    }, {});
    runTest("CQContainment-simple-5-false", () => {
        let cqTester = new CQContainmentTester();
        let q1 = new ConjunctiveQuery(new Predicate("p"), StrToTS.parseRule("p(X,Y,Z) :- r1(X,Y,Z) & q(Z,Z)"));
        let q2 = new ConjunctiveQuery(new Predicate("p"), StrToTS.parseRule("p(X,Y,Z) :- r1(X,Y,Z) & q(Z,W)"));
        return !cqTester.containedWithin(q2, q1);
    }, {});
}
export { runTests };
//# sourceMappingURL=containment-testers.js.map