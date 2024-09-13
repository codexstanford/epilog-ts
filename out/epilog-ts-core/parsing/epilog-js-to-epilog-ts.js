import { Symbol, Variable, CompoundTerm, ERROR_TERM } from "../classes/Term.js";
import { Constructor } from "../classes/Constructor.js";
import { Predicate } from "../classes/Predicate.js";
import { Atom, ERROR_ATOM } from "../classes/Atom.js";
import { Literal, ERROR_LITERAL } from "../classes/Literal.js";
import { ERROR_RULE, Rule } from "../classes/Rule.js";
import { Dataset } from "../classes/Dataset.js";
import { isEpilogConstant, isEpilogVariable } from "../utils/string-utils.js";
import { Ruleset } from "../classes/Ruleset.js";
var EpilogJSToTS;
(function (EpilogJSToTS) {
    function parseCompoundTerm(epilogJSCompoundTerm) {
        let constr = new Constructor(epilogJSCompoundTerm[0]);
        let argList = [];
        for (let i = 1; i < epilogJSCompoundTerm.length; i++) {
            let currTerm = epilogJSCompoundTerm[i];
            argList.push(parseTerm(currTerm));
        }
        return new CompoundTerm(constr, argList);
    }
    EpilogJSToTS.parseCompoundTerm = parseCompoundTerm;
    function parseConstant(epilogJSConstant) {
        if (isEpilogConstant(epilogJSConstant)) {
            return new Symbol(epilogJSConstant);
        }
        console.error("Parse error - could not parse epilog.js constant. Is not a symbol:", epilogJSConstant);
        return new Symbol('error');
    }
    EpilogJSToTS.parseConstant = parseConstant;
    function parseTerm(epilogJSTerm) {
        // Is a compound term
        if (typeof epilogJSTerm === "object") {
            return parseCompoundTerm(epilogJSTerm);
        }
        // Otherwise, it is either a symbol or a variable (i.e. a string)
        if (isEpilogConstant(epilogJSTerm)) {
            return new Symbol(epilogJSTerm);
        }
        if (isEpilogVariable(epilogJSTerm)) {
            return new Variable(epilogJSTerm);
        }
        // Handle the case when it is an anonymous variable, in the form used internally in epilog.js
        // Internally in epilog.js, anonymous variables are represented as a string of length >= 1 beginning with "_" and ending in a number
        if (epilogJSTerm.length >= 1 && epilogJSTerm[0] === "_") {
            return new Variable("_");
        }
        console.error("Parse error - could not parse epilog.js term. Is not a symbol, variable or compound term:", epilogJSTerm);
        return ERROR_TERM;
    }
    function parseAtom(epilogJSAtom) {
        // Handle error case
        if (typeof epilogJSAtom === "string" && epilogJSAtom === "error") {
            return ERROR_ATOM;
        }
        // Handle when it is just a 0-ary predicate without parens
        if (typeof epilogJSAtom === "string") {
            let pred = new Predicate(epilogJSAtom);
            return new Atom(pred, []);
        }
        // Must be a well-formed atom now, which is a list
        let pred = new Predicate(epilogJSAtom[0]);
        let argList = [];
        // Parse the args
        for (let i = 1; i < epilogJSAtom.length; i++) {
            let currTerm = epilogJSAtom[i];
            argList.push(parseTerm(currTerm));
        }
        let newAtom = new Atom(pred, argList);
        return newAtom;
    }
    EpilogJSToTS.parseAtom = parseAtom;
    function parseLiteral(epilogJSLiteral) {
        // Handle error case
        if (typeof epilogJSLiteral === "string" && epilogJSLiteral === "error") {
            return ERROR_LITERAL;
        }
        if (epilogJSLiteral[0] === "not") {
            return new Literal(parseAtom(epilogJSLiteral[1]), true);
        }
        return new Literal(parseAtom(epilogJSLiteral), false);
    }
    EpilogJSToTS.parseLiteral = parseLiteral;
    function parseRule(epilogJSRule) {
        // Handle error case
        if (typeof epilogJSRule === "string" && epilogJSRule === "error") {
            return ERROR_RULE;
        }
        // Handle when it is just a 0-ary predicate without parens
        if (typeof epilogJSRule === "string") {
            return new Rule(parseAtom(epilogJSRule), []);
        }
        // Main case: explicitly specified as a rule
        // Note: Assumes that "rule" is not a predicate constant 
        if (epilogJSRule[0] === "rule") {
            let head = parseAtom(epilogJSRule[1]);
            let body = [];
            for (let i = 2; i < epilogJSRule.length; i++) {
                body.push(parseLiteral(epilogJSRule[i]));
            }
            return new Rule(head, body);
        }
        // Case where no subgoals are provided - just an atom
        return new Rule(parseAtom(epilogJSRule), []);
    }
    EpilogJSToTS.parseRule = parseRule;
    function parseDataset(epilogJSDataset) {
        let factList = [];
        for (let fact of epilogJSDataset) {
            factList.push(parseAtom(fact));
        }
        return new Dataset(factList);
    }
    EpilogJSToTS.parseDataset = parseDataset;
    // Removes definitions from the ruleset
    // Note: assumes no body-free rule with head predicate "definition" (unless the predicate is a boolean predicate without parens)
    function cleanEpilogJSRuleset(epilogJSRuleset) {
        let cleanRuleset = [];
        for (let elem of epilogJSRuleset) {
            // Is fine if a string
            if (typeof elem === "string") {
                cleanRuleset.push(elem);
                continue;
            }
            // If not a string, must be a list.
            // If so, exclude if begins with "definition"
            if (elem[0] === "definition") {
                continue;
            }
            // Must be a rule
            cleanRuleset.push(elem);
        }
        return cleanRuleset;
    }
    function parseRuleset(epilogJSRuleset) {
        // Remove definitions
        // Note: assumes no body-free rule with head predicate "definition" 
        let cleanRuleset = cleanEpilogJSRuleset(epilogJSRuleset);
        let ruleList = [];
        for (let rule of cleanRuleset) {
            ruleList.push(parseRule(rule));
        }
        return new Ruleset(ruleList);
    }
    EpilogJSToTS.parseRuleset = parseRuleset;
})(EpilogJSToTS || (EpilogJSToTS = {}));
export { EpilogJSToTS };
//# sourceMappingURL=epilog-js-to-epilog-ts.js.map