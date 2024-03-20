
import { printTestingMessage_Start, runTest } from "../../testing/testing.js";
import { Literal } from "../classes/Literal.js";
import { Rule } from "../classes/Rule.js";
import { Substitution } from "../classes/Substitution.js";
import { CompoundTerm, Symbol, Variable } from "../classes/Term.js";
import { EpilogJSToTS } from "../parsing/epilog-js-to-epilog-ts.js";
import { standardizeRuleVars } from "../utils/standardize.js";
import { tryGetMGU } from "../utils/unify.js";

// Unit tests for {epilog-ts-core/utils} files
function runTests() : void {
    runStandardizeTests();

    runUnifyTests();
}

function runStandardizeTests() : void {
    printTestingMessage_Start("Standardizing")

    runTest("Standardize-rule-vars-success", () => {
        let strToRead : string = "p(X, Y, Z) :- q(X, A) & r(Z, Y) & s(B) & t(C, d)";
        let epilogJSRule : Rule = EpilogJSToTS.parseRule(read(strToRead));
        return standardizeRuleVars(epilogJSRule).toString() === "p(V0, V1, V2) :- q(V0, EV0) & r(V2, V1) & s(EV1) & t(EV2, d)";
    },{});
}

function runUnifyTests() {
    printTestingMessage_Start("Unification");

    printTestingMessage_Start("Unification of Terms");

    let sym1 : Symbol = new Symbol("c1");
    let sym2 : Symbol = new Symbol("c2");

    let varX : Variable = new Variable("X");
    let varY : Variable = new Variable("Y");
    let varZ : Variable = new Variable("Z");

    let compoundTerm1 : CompoundTerm = EpilogJSToTS.parseCompoundTerm(read("f(c1)"));
    let compoundTerm2 : CompoundTerm = EpilogJSToTS.parseCompoundTerm(read("f(c2)"));
    let compoundTerm3 : CompoundTerm = EpilogJSToTS.parseCompoundTerm(read("f(X)"));
    let compoundTerm3_b : CompoundTerm = EpilogJSToTS.parseCompoundTerm(read("f(Y)"));
    let compoundTerm4 : CompoundTerm = EpilogJSToTS.parseCompoundTerm(read("g(f(X))"));
    let compoundTerm5 : CompoundTerm = EpilogJSToTS.parseCompoundTerm(read("g(c1)"));
    let compoundTerm6 : CompoundTerm = EpilogJSToTS.parseCompoundTerm(read("h(X, X)"));
    let compoundTerm7 : CompoundTerm = EpilogJSToTS.parseCompoundTerm(read("h(Y, Y)"));
    let compoundTerm8 : CompoundTerm = EpilogJSToTS.parseCompoundTerm(read("f(Y, Y)"));
    let compoundTerm9 : CompoundTerm = EpilogJSToTS.parseCompoundTerm(read("h(c1, c2)"));
    let compoundTerm10 : CompoundTerm = EpilogJSToTS.parseCompoundTerm(read("h(f(Z), Z)"));
    let compoundTerm11 : CompoundTerm = EpilogJSToTS.parseCompoundTerm(read("h(Z, f(Z))"));
    let compoundTerm12 : CompoundTerm = EpilogJSToTS.parseCompoundTerm(read("h(Y, f(Y))"));
    

    // Same constants
    runTest("Unification-same constants-success", () => {
        let result1 = tryGetMGU(sym1,sym1);
        let result2 = tryGetMGU(sym2,sym2);

        return result1 instanceof Substitution && result1.getDomain().size === 0 &&
        result2 instanceof Substitution && result2.getDomain().size === 0;
    },{});

    // Different constants
    runTest("Unification-different constants-failure", () => {
        return tryGetMGU(sym1,sym2) === false && tryGetMGU(sym2, sym1) === false;
    },{});

    // Constant and compoundterm
    runTest("Unification-constant and compound term-1-failure", () => {
        return tryGetMGU(sym1,compoundTerm1) === false && tryGetMGU(compoundTerm1, sym1) === false;
    },{});

    runTest("Unification-constant and compound term-2-failure", () => {
        return tryGetMGU(sym1,compoundTerm3) === false && tryGetMGU(compoundTerm3, sym1) === false;
    },{});

    runTest("Unification-constant and compound term-3-failure", () => {
        return tryGetMGU(sym2,compoundTerm3) === false && tryGetMGU(compoundTerm3, sym2) === false;
    },{});

    // Same variable, failure
    runTest("Unification-same variable-1-failure", () => {
        return tryGetMGU(varX,varX) === false && tryGetMGU(varY, varY) === false;
    },{});

    runTest("Unification-same variable-2-failure", () => {
        return tryGetMGU(varX,compoundTerm6) === false && tryGetMGU(compoundTerm6, varX) === false;
    },{});

    runTest("Unification-same variable-3-failure", () => {
        return tryGetMGU(compoundTerm3,compoundTerm4) === false && tryGetMGU(compoundTerm4,compoundTerm3) === false;
    },{});

    runTest("Unification-same variable-4-failure", () => {
        return tryGetMGU(compoundTerm3,compoundTerm6) === false && tryGetMGU(compoundTerm6,compoundTerm3) === false;
    },{});
    
    // Same variable as a result of the algorithm, success
    runTest("Unification-same variable due to algorithm-success", () => {
        let result1 = tryGetMGU(compoundTerm6,compoundTerm7);
        let result2 = tryGetMGU(compoundTerm7,compoundTerm6);

        return result1 instanceof Substitution && result1.getDomain().size === 1 &&
        result2 instanceof Substitution && result2.getDomain().size === 1;
    },{});

    // Variable and another expression (left and right)
        // Another var
    runTest("Unification-variable and another variable-success", () => {
        let result1 = tryGetMGU(varX,varY);
        let result2 = tryGetMGU(varY,varX);

        return result1 instanceof Substitution && result1.getDomain().size === 1 &&
        result2 instanceof Substitution && result2.getDomain().size === 1;
    },{});
        // A symbol
    runTest("Unification-variable and a constant-success", () => {
        let result1 = tryGetMGU(varX,sym1);
        let result2 = tryGetMGU(sym1,varX);

        return result1 instanceof Substitution && result1.getDomain().size === 1 &&
        result2 instanceof Substitution && result2.getDomain().size === 1;
    },{});
        // A compound term
    runTest("Unification-variable and a compound term-1-success", () => {
        let result1 = tryGetMGU(varX,compoundTerm1);
        let result2 = tryGetMGU(compoundTerm1,varX);

        return result1 instanceof Substitution && result1.getDomain().size === 1 &&
        result2 instanceof Substitution && result2.getDomain().size === 1;
    },{});

    runTest("Unification-variable and a compound term-2-success", () => {
        let result1 = tryGetMGU(varX,compoundTerm7);
        let result2 = tryGetMGU(compoundTerm7,varX);

        return result1 instanceof Substitution && result1.getDomain().size === 1 &&
        result2 instanceof Substitution && result2.getDomain().size === 1;
    },{});

    // CompoundTerms with different Constructor
    runTest("Unification-compound terms with different constructors-failure", () => {
        return tryGetMGU(compoundTerm1,compoundTerm5) === false && tryGetMGU(compoundTerm5,compoundTerm1) === false;
    },{});
    
    // CompoundTerms with different arity
    runTest("Unification-compound terms with different arities-failure", () => {
        return tryGetMGU(compoundTerm1,compoundTerm8) === false && tryGetMGU(compoundTerm8,compoundTerm1) === false;
    },{});

    // CompoundTerms with same constructor and arity
    runTest("Unification-compound terms with same constructor and arity-1-failure", () => {
        return tryGetMGU(compoundTerm1,compoundTerm2) === false && tryGetMGU(compoundTerm2,compoundTerm1) === false;
    },{});

    runTest("Unification-compound terms with same constructor and arity-2-failure", () => {
        return tryGetMGU(compoundTerm7,compoundTerm9) === false && tryGetMGU(compoundTerm9,compoundTerm7) === false;
    },{});

    // CompoundTerms with same constructor and arity, but different structure
    runTest("Unification-compound terms with same constructor and arity, different structure-1-failure", () => {
        return tryGetMGU(compoundTerm7,compoundTerm10) === false && tryGetMGU(compoundTerm10,compoundTerm7) === false;
    },{});

    runTest("Unification-compound terms with same constructor and arity, different structure-2-failure", () => {
        return tryGetMGU(compoundTerm7,compoundTerm11) === false && tryGetMGU(compoundTerm11,compoundTerm7) === false;
    },{});

    // CompoundTerms that are unifiable 
    runTest("Unification-compound terms with same constructor and arity-1-success", () => {
        let result1 = tryGetMGU(compoundTerm1,compoundTerm1);
        let result2 = tryGetMGU(compoundTerm3,compoundTerm3_b);
        let result2_b = tryGetMGU(compoundTerm3_b,compoundTerm3);

        return result1 instanceof Substitution && result1.getDomain().size === 0 &&
        result2 instanceof Substitution && result2.getDomain().size === 1 &&
        result2_b instanceof Substitution && result2.getDomain().size === 1;
    },{});

    runTest("Unification-compound terms with same constructor and arity-2-success", () => {
        let result1 = tryGetMGU(compoundTerm11,compoundTerm12);
        let result2 = tryGetMGU(compoundTerm12,compoundTerm11);

        return result1 instanceof Substitution && result1.getDomain().size === 1 &&
        result2 instanceof Substitution && result2.getDomain().size === 1;
    },{});

    printTestingMessage_Start("Unification of Literals");
    
    let p_c1 : Literal = EpilogJSToTS.parseLiteral(read("p(c1)"));
    let p_c2 : Literal = EpilogJSToTS.parseLiteral(read("p(c2)"));
    let p_X : Literal = EpilogJSToTS.parseLiteral(read("p(X)"));
    let p_Y : Literal = EpilogJSToTS.parseLiteral(read("p(Y)"));
    let p_X_Y : Literal = EpilogJSToTS.parseLiteral(read("p(X, Y)"));
    let p_Z_W : Literal = EpilogJSToTS.parseLiteral(read("p(Z, W)"));
    let p_c1_c2 : Literal = EpilogJSToTS.parseLiteral(read("p(c1, c2)"));
    let neg_p_c1 : Literal = EpilogJSToTS.parseLiteral(read("~p(c1)"));
    let neg_p_c2 : Literal = EpilogJSToTS.parseLiteral(read("~p(c2)"));
    let neg_p_X : Literal = EpilogJSToTS.parseLiteral(read("~p(X)"));
    let neg_p_Y : Literal = EpilogJSToTS.parseLiteral(read("~p(Y)"));
    
    let p_X_fX : Literal = EpilogJSToTS.parseLiteral(read("p(X, f(X))"));
    let p_Y_Y : Literal = EpilogJSToTS.parseLiteral(read("p(Y, Y)"));


    let q_c1 = EpilogJSToTS.parseLiteral(read("q(c1)"));
    let q_X_hXY = EpilogJSToTS.parseLiteral(read("q(X, h(X, Y))"));
    let q_Z_hc1gc2 = EpilogJSToTS.parseLiteral(read("q(Z, h(c1, g(c2)))"));

    // Same ground Literal
    runTest("Unification-same ground literals-1-success", () => {
        let result1 = tryGetMGU(p_c1,p_c1);
        let result2 = tryGetMGU(p_c2,p_c2);

        return result1 instanceof Substitution && result1.getDomain().size === 0 &&
        result2 instanceof Substitution && result2.getDomain().size === 0;
    },{});

    runTest("Unification-same ground literals-2-success", () => {
        let result1 = tryGetMGU(neg_p_c1,neg_p_c1);
        let result2 = tryGetMGU(neg_p_c2,neg_p_c2);

        return result1 instanceof Substitution && result1.getDomain().size === 0 &&
        result2 instanceof Substitution && result2.getDomain().size === 0;
    },{});

    // Different polarity
    runTest("Unification-different polarity literals-failure", () => {
        return tryGetMGU(p_c1,neg_p_c1) === false && tryGetMGU(neg_p_c1,p_c1) === false;
    },{});

    // Different predicate
    runTest("Unification-different predicate literals-failure", () => {
        return tryGetMGU(p_c1,q_c1) === false && tryGetMGU(q_c1,p_c1) === false;
    },{});

    // Different arity
    runTest("Unification-different arity literals-failure", () => {
        return tryGetMGU(p_c1,p_c1_c2) === false && tryGetMGU(p_c1_c2,p_c1) === false;
    },{});

    // Easily unifiable
    runTest("Unification-easily unifiable-1-success", () => {
        let result1 = tryGetMGU(p_X,p_c1);
        let result2 = tryGetMGU(p_c1,p_X);

        return result1 instanceof Substitution && result1.getDomain().size === 1 &&
        result2 instanceof Substitution && result2.getDomain().size === 1;
    },{});

    runTest("Unification-easily unifiable-2-success", () => {
        let result1 = tryGetMGU(p_X_Y,p_Z_W);
        let result2 = tryGetMGU(p_Z_W,p_X_Y);

        return result1 instanceof Substitution && result1.getDomain().size === 2 &&
        result2 instanceof Substitution && result2.getDomain().size === 2;
    },{});

    runTest("Unification-easily unifiable-3-success", () => {
        let result1 = tryGetMGU(p_X_fX,p_Z_W);
        let result2 = tryGetMGU(p_Z_W,p_X_fX);

        return result1 instanceof Substitution && result1.getDomain().size === 2 &&
        result2 instanceof Substitution && result2.getDomain().size === 2;
    },{});

    runTest("Unification-easily unifiable-4-success", () => {
        let result1 = tryGetMGU(q_X_hXY,q_Z_hc1gc2);
        let result2 = tryGetMGU(q_Z_hc1gc2,q_X_hXY);

        return result1 instanceof Substitution && result1.getDomain().size === 3 &&
        result2 instanceof Substitution && result2.getDomain().size === 3;
    },{});

    // Occurs check
    runTest("Unification-occurs check-failure", () => {
        let result1 = tryGetMGU(p_X_fX,p_Y_Y);
        let result2 = tryGetMGU(p_Y_Y,p_X_fX);

        return result1 === false && result2 === false;
    },{});

    // Different structure
    runTest("Unification-different structure-failure", () => {
        let result1 = tryGetMGU(p_X_fX,p_Y_Y);
        let result2 = tryGetMGU(p_Y_Y,p_X_fX);

        return result1 === false && result2 === false;
    },{});


    // Terms and Literals cannot be unified with one another
    runTest("Unification-term and literal-failure", () => {
        let result1 = tryGetMGU(sym1,p_c1);
        let result1_b = tryGetMGU(sym1,p_c1);
        let result2 = tryGetMGU(q_Z_hc1gc2,compoundTerm12);
        let result2_b = tryGetMGU(q_Z_hc1gc2,compoundTerm12);

        return result1 === false && result1_b === false && result2 === false && result2_b === false;
    },{});
}


export {
    runTests
}