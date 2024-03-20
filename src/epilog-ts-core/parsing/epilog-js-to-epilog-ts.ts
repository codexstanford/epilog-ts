import { Symbol, Variable, CompoundTerm, Term, ERROR_TERM } from "../classes/Term.js";
import { Constructor } from "../classes/Constructor.js";
import { Predicate } from "../classes/Predicate.js";

import { Atom, ERROR_ATOM } from "../classes/Atom.js";
import { Literal, ERROR_LITERAL } from "../classes/Literal.js";
import { ERROR_RULE, Rule } from "../classes/Rule.js";
import { Dataset } from "../classes/Dataset.js";

import { isEpilogConstant, isEpilogVariable } from "../utils/string-utils.js";
import { Ruleset } from "../classes/Ruleset.js";


namespace EpilogJSToTS {
    export type EpilogJSConstant = string;

    type EpilogJSSymbol = EpilogJSConstant;
    type EpilogJSConstructor = EpilogJSConstant;
    type EpilogJSPredicate = EpilogJSConstant;

    type EpilogJSVariable = string;

    // Note: Recursive dependency between the Term and CompoundTerm
        // A list where a constructor is followed by 0 or more terms.
    type EpilogJSCompoundTerm = [EpilogJSConstructor, ...EpilogJSTerm[]];

    type EpilogJSTerm = EpilogJSSymbol | EpilogJSVariable | EpilogJSCompoundTerm;


    type EpilogJSReadError = "error";
    // Either the error atom, or a list where the first element is a predicate, followed by 0 or more terms
    export type EpilogJSAtom = EpilogJSReadError | [EpilogJSPredicate, ...EpilogJSTerm[]] | EpilogJSPredicate;

    type EpilogJSLiteral =  EpilogJSReadError| EpilogJSAtom | ["not", EpilogJSAtom];

    export type EpilogJSRule = EpilogJSReadError | EpilogJSPredicate | ["rule", EpilogJSAtom, ...EpilogJSLiteral[]] | EpilogJSAtom;

    export type EpilogJSDataset = EpilogJSAtom[];

    type EpilogJSRuleset_Clean = EpilogJSRule[];

    // Assuming something about the structure of definitions here, but for now only care that "definition" is the first element
    type EpilogJSDefinition = ["definition", EpilogJSAtom, ...EpilogJSAtom[]];
    export type EpilogJSRuleset = EpilogJSRuleset_Clean | Array<EpilogJSRule | EpilogJSDefinition>;

    export function parseCompoundTerm(epilogJSCompoundTerm: EpilogJSCompoundTerm) : CompoundTerm {

        let constr = new Constructor(epilogJSCompoundTerm[0]);

        let argList : Term[] = [];

        for (let i = 1; i < epilogJSCompoundTerm.length; i++) {
            let currTerm = epilogJSCompoundTerm[i];

            argList.push(parseTerm(currTerm));
        }

        return new CompoundTerm(constr, argList);
    }

    export function parseConstant(epilogJSConstant: EpilogJSConstant) : Symbol {
        if (isEpilogConstant(epilogJSConstant)) {
            return new Symbol(epilogJSConstant);
        }

        console.error("Parse error - could not parse epilog.js constant. Is not a symbol:", epilogJSConstant);
        return new Symbol('error');
    }

    function parseTerm(epilogJSTerm: EpilogJSTerm) : Term {
        // Is a compound term
        if (typeof epilogJSTerm === "object" ) {
            return parseCompoundTerm(epilogJSTerm);
        }

        // Otherwise, it is either a symbol or a variable (i.e. a string)
        if (isEpilogConstant(epilogJSTerm)) {
            return new Symbol(epilogJSTerm);
        }

        if (isEpilogVariable(epilogJSTerm)) {
            return new Variable(epilogJSTerm);
        }

        console.error("Parse error - could not parse epilog.js term. Is not a symbol, variable or compound term:", epilogJSTerm);
        return ERROR_TERM;
    }

    export function parseAtom(epilogJSAtom: EpilogJSAtom) : Atom {
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
        let argList: Term[] = [];

        // Parse the args
        for (let i = 1; i < epilogJSAtom.length; i++) {
            let currTerm = epilogJSAtom[i];
            
            argList.push(parseTerm(currTerm));
        }

        let newAtom = new Atom(pred, argList);

        return newAtom;
    }

    export function parseLiteral(epilogJSLiteral: EpilogJSLiteral) : Literal {
        // Handle error case
        if (typeof epilogJSLiteral === "string" && epilogJSLiteral === "error") {
            return ERROR_LITERAL;
        }

        if (epilogJSLiteral[0] === "not") {
            return new Literal(parseAtom(epilogJSLiteral[1]), true);
        }

        return new Literal(parseAtom(epilogJSLiteral), false);
        
    }
    
    export function parseRule(epilogJSRule: EpilogJSRule) : Rule {

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

            let body : Literal[] = [];

            for (let i = 2; i < epilogJSRule.length; i++) {
                body.push(parseLiteral(epilogJSRule[i]));
            }

            return new Rule(head, body);
        }

        // Case where no subgoals are provided - just an atom
        return new Rule(parseAtom(epilogJSRule), []);
    }

    export function parseDataset(epilogJSDataset: EpilogJSDataset) : Dataset {

        let factList: Atom[] = [];

        for (let fact of epilogJSDataset) {
            factList.push(parseAtom(fact));
        }

        return new Dataset(factList);
    }

    // Removes definitions from the ruleset
        // Note: assumes no body-free rule with head predicate "definition" (unless the predicate is a boolean predicate without parens)
    function cleanEpilogJSRuleset(epilogJSRuleset: EpilogJSRuleset) : EpilogJSRuleset_Clean {
        let cleanRuleset : EpilogJSRuleset_Clean = [];

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

    export function parseRuleset(epilogJSRuleset: EpilogJSRuleset) : Ruleset {

        // Remove definitions
            // Note: assumes no body-free rule with head predicate "definition" 
        let cleanRuleset : EpilogJSRuleset_Clean = cleanEpilogJSRuleset(epilogJSRuleset);

        let ruleList : Rule[] = [];

        for (let rule of cleanRuleset) {
            ruleList.push(parseRule(rule));
        }

        return new Ruleset(ruleList);
    }

}

export {
    EpilogJSToTS
}