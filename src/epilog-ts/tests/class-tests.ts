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

import { Substitution } from "../classes/Substitution.js";

import { printTestingMessage_Start, runTest } from "../../testing/testing.js";

// Unit tests for epilog-ts/classes files
function runTests() : void {

    runSubstitutionTests();
    
    runSymbolTests();

    runVariableTests();

    runConstructorTests();

    runCompoundTermTests();

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

function runSubstitutionTests() : void {

    printTestingMessage_Start("Substitutions")

    runTest("Subst-empty-success", () => {
        let newSub = new Substitution();
        return newSub.toString() === "{\n\n}";
    },{});

    runTest("Subst-single-sub-success", () => {
        let newSub = new Substitution(new Map([['V', new Symbol('2')]]));
        return newSub.toString() === "{\n\tV ⟶ 2\n}";
    },{});

    runTest("Subst-single-sub-var-1-success", () => {
        let newSub = new Substitution(new Map([['V', new Variable('X')]]));
        return newSub.toString() === "{\n\tV ⟶ X\n}";
    },{});

    runTest("Subst-single-sub-var-2-success", () => {
        let newSub = new Substitution(new Map([['V', new Variable('V')]]));
        return newSub.toString() === "{\n\tV ⟶ V\n}";
    },{});

    runTest("Subst-single-sub-compoundterm-success", () => {
        let newSub = new Substitution(new Map([['V', new CompoundTerm(new Constructor('f'), [new Variable('X'), new Symbol('t')])]]));
        return newSub.toString() === "{\n\tV ⟶ f(X, t)\n}";
    },{});

    runTest("Subst-multiple-subs-success", () => {
        let newSub = new Substitution(new Map([['V', new Symbol('2')], ['X23', new Symbol('c23')]]));
        return newSub.toString() === "{\n\tV ⟶ 2, \n\tX23 ⟶ c23\n}";
    },{});

    runTest("Subst-nonvar-domain-elem-failure", () => {
        let newSub = new Substitution(new Map([['not_a_var', new Symbol('2')], ['X23', new Symbol('c23')]]));
        return newSub.toString() === "{\n\n}";
    },{});

    runTest("Subst-anonymous-var-failure", () => {
        let newSub = new Substitution(new Map([['V', new Symbol('string')], ['_', new Symbol('c23')]]));
        return newSub.toString() === "{\n\n}";
    },{});

    runTest("Subst-overlapping-domain-range-warning", () => {
        let newSub = new Substitution(new Map([['V', new Variable('X23')], ['X23', new Symbol('c23')]]));
        return newSub.toString() === "{\n\tV ⟶ X23, \n\tX23 ⟶ c23\n}";
    },{});

    runTest("Subst-get-success", () => {
        let newSub = new Substitution(new Map([['V', new Symbol('2')], ['X23', new Symbol('c23')]]));
        return newSub.getSub('V').toString() === '2' && newSub.getSub('X23').toString() === 'c23';
    },{});

    runTest("Subst-get-failure", () => {
        let newSub = new Substitution(new Map([['V', new Symbol('2')], ['X23', new Symbol('c23')]]));
        return newSub.getSub('Absentvar').toString() === 'error';
    },{});

    runTest("Subst-set-success", () => {
        let newSub = new Substitution(new Map([['V', new Symbol('2')], ['X23', new Symbol('c23')]]));
        newSub.setSub('V', new Symbol('string'));
        newSub.setSub('Newvar', new Symbol('"symbol that is a string"'));
        return newSub.getSub('V').toString() !== '2' &&
            newSub.getSub('V').toString() === 'string' &&
            newSub.getSub('Newvar').toString() === '"symbol that is a string"' &&
            newSub.getSub('X23').toString() === 'c23';
    },{});

    runTest("Subst-set-failure", () => {
        let newSub = new Substitution(new Map([['V', new Symbol('2')], ['X23', new Symbol('c23')]]));
        newSub.setSub('_', new Symbol('string'));
        newSub.setSub('_Newvar', new Symbol('"symbol that is a string"'));
        newSub.setSub('newvar', new Symbol('"symbol that is a string"'));
        return newSub.getSub('V').toString() === '2' &&
            newSub.getSub('_').toString() === 'error' &&
            newSub.getSub('_Newvar').toString() === 'error' &&
            newSub.getSub('newvar').toString() === 'error' &&
            newSub.getSub('X23').toString() === 'c23';
    },{});

    // Applying substitutions
        /*console.log(cq.toString());
    console.log(frozenCQ.toString());

    console.log(frozenCQ.rule.head.args[0] === freezingSub.getSub('X'));*/
}

function runSymbolTests() : void {
    printTestingMessage_Start("Symbols")

    runTest("Symbol-string-success", () => {
        let newSym : Symbol = new Symbol("\"suspicious symbol\"");
        return newSym.name === "\"suspicious symbol\"";
    },{});

    runTest("Symbol-letter-success", () => {
        let newSym : Symbol = new Symbol("bob");
        return newSym.name === "bob";
    },{});

    runTest("Symbol-underscore-success", () => {
        let newSym : Symbol = new Symbol("test_");
        return newSym.name === "test_";
    },{});

    runTest("Symbol-number-success", () => {
        let newSym : Symbol = new Symbol("314159");
        return newSym.name === "314159";
    },{});

    runTest("Symbol-period-success", () => {
        let newSym : Symbol = new Symbol("3.14159");
        return newSym.name === "3.14159";
    },{});

    runTest("Symbol-complex-success", () => {
        let newSym : Symbol = new Symbol("3._1aslk9._");
        return newSym.name === "3._1aslk9._";
    },{});


    runTest("Symbol-underscore-1-failure", () => {
        let newSym : Symbol = new Symbol("_");
        return newSym.name === "error";
    },{});

    runTest("Symbol-underscore-2-failure", () => {
        let newSym : Symbol = new Symbol("___");
        return newSym.name === "error";
    },{});

    runTest("Symbol-underscore-3-failure", () => {
        let newSym : Symbol = new Symbol("__3");
        return newSym.name === "error";
    },{});

    runTest("Symbol-string-failure", () => {
        let newSym : Symbol = new Symbol("3\"test");
        return newSym.name === "error";
    },{});

    runTest("Symbol-variable-1-failure", () => {
        let newSym : Symbol = new Symbol("X");
        return newSym.name === "error";
    },{});

    runTest("Symbol-variable-2-failure", () => {
        let newSym : Symbol = new Symbol("Hospital");
        return newSym.name === "error";
    },{});

    runTest("Symbol-getVars-validSym", () => {
        let newSym : Symbol = new Symbol("3._1aslk9._");
        return newSym.getVars().size === 0;
    },{});

    runTest("Symbol-getVars-invalidSym", () => {
        let newSym : Symbol = new Symbol("Hospital");
        return newSym.getVars().size === 0;
    },{});

}

function runVariableTests() : void {

    printTestingMessage_Start("Variables")

    runTest("Var-anonymous-success", () => {
        let newVar : Variable = new Variable("_");
        return newVar.name === "_" && newVar.isAnonymous();
    },{});

    runTest("Var-caps-success", () => {
        let newVar : Variable = new Variable("X23");
        return newVar.name === "X23"&& !newVar.isAnonymous();
    },{}); 

    runTest("Var-underscores-failure", () => {
        let newVar : Variable = new Variable("__");
        return newVar.name === "error" && !newVar.isAnonymous();
    },{});

    runTest("Var-digits-failure", () => {
        let newVar : Variable = new Variable("23X");
        return newVar.name === "error" && !newVar.isAnonymous();
    },{});

    runTest("Var-lowercase-failure", () => {
        let newVar : Variable = new Variable("x23");
        return newVar.name === "error" && !newVar.isAnonymous();
    },{});

    runTest("Var-period-failure", () => {
        let newVar : Variable = new Variable(".");
        return newVar.name === "error" && !newVar.isAnonymous();
    },{});
    
    runTest("Var-getVars-anonymous", () => {
        let newVar : Variable = new Variable("_");
        return newVar.getVars().size === 1 && newVar.getVars().has("_") && newVar.isAnonymous();
    },{});

    runTest("Var-getVars-caps", () => {
        let newVar : Variable = new Variable("X23");
        return newVar.getVars().size === 1 && newVar.getVars().has("X23") && !newVar.isAnonymous();
    },{}); 

    runTest("Var-getVars-invalidVar", () => {
        let newVar : Variable = new Variable("__");
        return newVar.getVars().size === 0 && !newVar.isAnonymous();
    },{});
}

function runCompoundTermTests() : void {

    printTestingMessage_Start("CompoundTerms")

    runTest("CompoundTerm-empty-success", () => {
        let newConstructor = new Constructor("f");
        let compoundTerm : CompoundTerm = new CompoundTerm(newConstructor, []);
        return compoundTerm.toString() === "f()";
    },{});

    runTest("CompoundTerm-anonymousVar-success", () => {
        let newConstructor = new Constructor("f");
        let newVar : Variable = new Variable("_");
        let compoundTerm : CompoundTerm = new CompoundTerm(newConstructor, [newVar]);
        return compoundTerm.toString() === "f(_)";
    },{});

    runTest("CompoundTerm-namedVar-success", () => {
        let newConstructor = new Constructor("f");
        let newVar : Variable = new Variable("X");
        let compoundTerm : CompoundTerm = new CompoundTerm(newConstructor, [newVar]);
        return compoundTerm.toString() === "f(X)";
    },{});

    runTest("CompoundTerm-symbol-success", () => {
        let newConstructor = new Constructor("f");
        let newSym : Symbol = new Symbol("bob");
        let compoundTerm : CompoundTerm = new CompoundTerm(newConstructor, [newSym]);
        return compoundTerm.toString() === "f(bob)";
    },{});

    runTest("CompoundTerm-many-args-success", () => {
        let newConstructor = new Constructor("g");
        let newSym : Symbol = new Symbol("bob");
        let newVar1 : Variable = new Variable("X");
        let newVar2 : Variable = new Variable("_");
        let compoundTerm : CompoundTerm = new CompoundTerm(newConstructor, [newSym, newVar1, newVar2]);
        return compoundTerm.toString() === "g(bob, X, _)";
    },{});

    runTest("CompoundTerm-nested-success", () => {
        let newConstructor1 = new Constructor("builder");
        let newConstructor2 = new Constructor("f");
        let newConstructor3 = new Constructor("g");
        let newConstructor4 = new Constructor("cons");
        let newSym1 : Symbol = new Symbol("major_test");
        let newSym2 : Symbol = new Symbol("nil");
        let newVar1 : Variable = new Variable("X");
        let newVar2 : Variable = new Variable("_");
        //args(f(g(X)), minor_test, [Y])
        let compoundTerm1 : CompoundTerm = new CompoundTerm(newConstructor3, [newVar1]); // g(X)
        let compoundTerm2 : CompoundTerm = new CompoundTerm(newConstructor2, [compoundTerm1]); // f(g(X))
        let compoundTerm3 : CompoundTerm = new CompoundTerm(newConstructor4, [newVar2, newSym2]); // cons(_, nil)
        let compoundTerm4 : CompoundTerm = new CompoundTerm(newConstructor1, [compoundTerm2, newSym1, compoundTerm3]); // builder(f(g(X)), major_test, cons(_, nil))
        return compoundTerm4.toString() === "builder(f(g(X)), major_test, cons(_, nil))";
    },{});

    runTest("CompoundTerm-getVars-novars-empty", () => {
        let newConstructor = new Constructor("f");
        let compoundTerm : CompoundTerm = new CompoundTerm(newConstructor, []);
        return compoundTerm.getVars().size === 0;
    },{});

    runTest("CompoundTerm-getVars-namedVar", () => {
        let newConstructor = new Constructor("f");
        let newVar : Variable = new Variable("X");
        let compoundTerm : CompoundTerm = new CompoundTerm(newConstructor, [newVar]);
        return compoundTerm.getVars().size === 1 && compoundTerm.getVars().has("X");
    },{});

    runTest("CompoundTerm-getVars-anonymousVar", () => {
        let newConstructor = new Constructor("f");
        let newVar : Variable = new Variable("_");
        let compoundTerm : CompoundTerm = new CompoundTerm(newConstructor, [newVar]);
        return compoundTerm.getVars().size === 1 && compoundTerm.getVars().has("_");
    },{});

    runTest("CompoundTerm-getVars-novars-symbol", () => {
        let newConstructor = new Constructor("f");
        let newSym : Symbol = new Symbol("bob");
        let compoundTerm : CompoundTerm = new CompoundTerm(newConstructor, [newSym]);
        return compoundTerm.getVars().size === 0;
    },{});

    runTest("CompoundTerm-getVars-many-args", () => {
        let newConstructor = new Constructor("g");
        let newSym : Symbol = new Symbol("bob");
        let newVar1 : Variable = new Variable("X");
        let newVar2 : Variable = new Variable("_");
        let compoundTerm : CompoundTerm = new CompoundTerm(newConstructor, [newSym, newVar1, newVar2]);
        return compoundTerm.getVars().size === 2 && compoundTerm.getVars().has("X") && compoundTerm.getVars().has("_");
    },{});

    runTest("CompoundTerm-getVars-many-underscores", () => {
        let newConstructor = new Constructor("g");
        let newSym : Symbol = new Symbol("bob");
        let newVar1 : Variable = new Variable("_");
        let newVar2 : Variable = new Variable("_");
        let compoundTerm : CompoundTerm = new CompoundTerm(newConstructor, [newSym, newVar1, newVar2]);
        return compoundTerm.getVars().size === 1 && compoundTerm.getVars().has("_");
    },{});

    runTest("CompoundTerm-getVars-many-namedVars", () => {
        let newConstructor = new Constructor("h");
        let newSym : Symbol = new Symbol("bob");
        let newVar1 : Variable = new Variable("X");
        let newVar2 : Variable = new Variable("Y");
        let newVar3 : Variable = new Variable("Z");
        let compoundTerm : CompoundTerm = new CompoundTerm(newConstructor, [newSym, newVar1, newVar2, newVar3]);
        return compoundTerm.getVars().size === 3 && 
            compoundTerm.getVars().has("X") && 
            compoundTerm.getVars().has("Y") && 
            compoundTerm.getVars().has("Z");
    },{});

}

function runTermTests() : void {

}

function runConstructorTests() : void {
    printTestingMessage_Start("Constructors")

    runTest("Constructor-string-success", () => {
        let newConstr : Constructor = new Constructor("\"suspicious symbol\"");
        return newConstr.name === "\"suspicious symbol\"";
    },{});

    runTest("Constructor-letter-success", () => {
        let newConstr : Constructor = new Constructor("bob");
        return newConstr.name === "bob";
    },{});

    runTest("Constructor-underscore-success", () => {
        let newConstr : Constructor = new Constructor("test_");
        return newConstr.name === "test_";
    },{});

    runTest("Constructor-number-success", () => {
        let newConstr : Constructor = new Constructor("314159");
        return newConstr.name === "314159";
    },{});

    runTest("Constructor-period-success", () => {
        let newConstr : Constructor = new Constructor("3.14159");
        return newConstr.name === "3.14159";
    },{});

    runTest("Constructor-complex-success", () => {
        let newConstr : Constructor = new Constructor("3._1aslk9._");
        return newConstr.name === "3._1aslk9._";
    },{});


    runTest("Constructor-underscore-1-failure", () => {
        let newConstr : Constructor = new Constructor("_");
        return newConstr.name === "error";
    },{});

    runTest("Constructor-underscore-2-failure", () => {
        let newConstr : Constructor = new Constructor("___");
        return newConstr.name === "error";
    },{});

    runTest("Constructor-underscore-3-failure", () => {
        let newConstr : Constructor = new Constructor("__3");
        return newConstr.name === "error";
    },{});

    runTest("Constructor-string-failure", () => {
        let newConstr : Constructor = new Constructor("3\"test");
        return newConstr.name === "error";
    },{});

    runTest("Constructor-variable-1-failure", () => {
        let newConstr : Constructor = new Constructor("X");
        return newConstr.name === "error";
    },{});

    runTest("Constructor-variable-2-failure", () => {
        let newConstr : Constructor = new Constructor("Hospital");
        return newConstr.name === "error";
    },{});

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

    //console.log(StrToTS.parseRule("ans(W) :- test(W) & test2(c, X)").getVars());
    //console.log(StrToTS.parseRule("g(X,Z) :- p(X,Y) & p(Y,Z)").getVars());

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