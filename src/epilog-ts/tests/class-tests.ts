import { Symbol, Variable, CompoundTerm, Term } from "../classes/Term.js";

import { Constructor } from "../classes/Constructor.js";

import { Predicate } from "../classes/Predicate.js";

import { Atom } from "../classes/Atom.js";

import { Dataset } from "../classes/Dataset.js";

import { Literal } from "../classes/Literal.js";

import { Rule } from "../classes/Rule.js";

import { Ruleset } from "../classes/Ruleset.js";

import { CQ, ConjunctiveQuery, Query } from "../classes/Query.js";
import { CLP, ClosedLogicProgram } from "../classes/ClosedLogicProgram.js";

import { runTest } from "../../testing/testing.js";

// Unit tests for epilog-ts/classes files
function runTests() : void {

    runVariableTests();

    /*
    let newPred : Predicate = new Predicate("\"suspicious pred\"");
    let newPred2 : Predicate = new Predicate("r1");

    let newConstructor = new Constructor("f");

    let compoundTerm1 : CompoundTerm = new CompoundTerm(newConstructor, [newSym, newSym2]);
    console.log(compoundTerm1.isGround());

    let compoundTerm2 : CompoundTerm = new CompoundTerm(newConstructor, [newSym, newVar]);
    console.log(compoundTerm2.isGround());

    let compoundTerm3 : CompoundTerm = new CompoundTerm(newConstructor, []);
    console.log(compoundTerm3.toString() + " " +  compoundTerm3.isGround());

    let newAtom : Atom = new Atom(newPred, []);
    let newAtom2 : Atom = new Atom(newPred2, [newSym, newVar]);
    let newAtom3 : Atom = new Atom(newPred2, [newSym2]);
    let newAtom4 : Atom = new Atom(newPred2, [newSym2]);
    
    console.log(newAtom.toString(), " ", newAtom.isGround());
    console.log(newAtom2.toString(), " ", newAtom2.isGround());
    console.log(newAtom3.toString(), " ", newAtom3.isGround());
    
    let newDataset : Dataset = new Dataset([newAtom, newAtom2, newAtom3, newAtom3, newAtom4])
    console.log(newDataset.toString());
    let newDataset2 : Dataset = new Dataset([newAtom, newAtom3, newAtom4])
    console.log(newDataset2.toString());
    
    console.log(readdata(newDataset2.toEpilogString()));
    
    let newLiteral = new Literal(newAtom, true);
    console.log(newLiteral.toString());
    let newLiteral2 = new Literal(newAtom2, true);
    console.log(newLiteral2.toString());
    let newLiteral3 = new Literal(newAtom2, false);
    console.log(newLiteral3.toString());
    
    let head : Atom = new Atom(new Predicate("g"), [new Variable("X"), new Variable("Z")]);
    let subgoal1 : Atom = new Atom(new Predicate("p"), [new Variable("X"), new Variable("Y")]);
    let subgoal2 : Atom = new Atom(new Predicate("p"), [new Variable("Y"), new Variable("Z")]);
    let subgoal3 : Literal = new Literal(new Atom(new Predicate("p"), [new Variable("X"), new Variable("Z")]), true);
    let rule : Rule = new Rule(head, [subgoal1, subgoal2, subgoal3]);
    console.log(rule.toString());
    console.log(rule.isGround());

    let rule2 : Rule = new Rule(subgoal1, []);
    console.log(rule2.toString());
    console.log(rule2.isGround());

    let rule3 : Rule = new Rule(newAtom3,[newAtom]);
    console.log(rule3.toString());
    console.log(rule3.isGround());

    let ruleset = new Ruleset([rule, rule2, rule3])
    console.log(ruleset.toString());
    console.log("Ruleset as Epilog:",readdata(ruleset.toEpilogString()));

    let cq1 : CQ = new ConjunctiveQuery(new Predicate("g"), new Rule(head, [subgoal1, subgoal2]));
    console.log(cq1.toString());

    let clp1 : CLP = new ClosedLogicProgram(newDataset2, ruleset);
    console.log(clp1.toString());*/

}

function runSymbolTests() : void {
    /*let newSym : Symbol = new Symbol("\"suspicious symbol\"");
    console.log(newSym.toString());
    let newSym2 : Symbol = new Symbol("test_");
    console.log(newSym2.toString());*/
}

function runVariableTests() : void {

    runTest("Var-success-anonymous", () => {
        let newVar : Variable = new Variable("_");
        return newVar.name === "";
    },{});

    runTest("Var-success-caps", () => {
        let newVar : Variable = new Variable("X23");
        return newVar.name === "X23";
    },{});

    runTest("Var-failure-underscores", () => {
        let newVar : Variable = new Variable("__");
        return newVar.name === "error";
    },{});

    runTest("Var-failure-digits", () => {
        let newVar : Variable = new Variable("23X");
        return newVar.name === "error";
    },{});

    runTest("Var-failure-lowercase", () => {
        let newVar : Variable = new Variable("x23");
        return newVar.name === "error";
    },{});

    runTest("Var-failure-period", () => {
        let newVar : Variable = new Variable(".");
        return newVar.name === "error";
    },{});
}

function runCompoundTermTests() : void {

}

function runTermTests() : void {

}

function runConstructorTests() : void {

}

function runPredicateTests() : void {

}

function runAtomTests() : void {

}

function runDatasetTests() : void {

}

function runLiteralTests() : void {

}

function runRuleTests() : void {

}

function runRulesetTests() : void {

}

function runQueryTests() : void {

}

function runCLPTests() : void {

}


export { 
    runTests
 }