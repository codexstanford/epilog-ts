import { Symbol, Variable, CompoundTerm, Term, ERROR_TERM } from "../classes/Term.js";
import { Constructor } from "../classes/Constructor.js";
import { Predicate } from "../classes/Predicate.js";

import { Atom, ERROR_ATOM } from "../classes/Atom.js";

import { isEpilogConstant, isEpilogVariable } from "../utils/string-utils.js";
import { Literal, ERROR_LITERAL } from "../classes/Literal.js";


namespace EpilogJSToTS {
    type EpilogJSConstant = string;

    type EpilogJSSymbol = EpilogJSConstant;
    type EpilogJSConstructor = EpilogJSConstant;
    type EpilogJSPredicate = EpilogJSConstant;

    type EpilogJSVariable = string;

    // Note: Recursive dependency between the Term and CompoundTerm
        // A list where a constructor is followed by 0 or more terms.
    type EpilogJSCompoundTerm = [EpilogJSConstructor, ...EpilogJSTerm[]];

    type EpilogJSTerm = EpilogJSSymbol | EpilogJSVariable | EpilogJSCompoundTerm;


    type EpilogJSReadError = string;
    // Either the error atom, or a list where the first element is a predicate, followed by 0 or more terms
    type EpilogJSAtom = EpilogJSReadError | [EpilogJSPredicate, ...EpilogJSTerm[]];

    type EpilogJSLiteral =  EpilogJSReadError| EpilogJSAtom | ["not", EpilogJSAtom];


    function parseCompoundTerm(epilogJSCompoundTerm: EpilogJSCompoundTerm) : CompoundTerm {

        let constr = new Constructor(epilogJSCompoundTerm[0]);

        let argList : Term[] = [];

        for (let i = 1; i < epilogJSCompoundTerm.length; i++) {
            let currTerm = epilogJSCompoundTerm[i];

            argList.push(parseTerm(currTerm));
        }

        return new CompoundTerm(constr, argList);
    }

    function parseTerm(epilogJSTerm: EpilogJSTerm) : Term {
        // Is a comound term
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

        // Must be a well-formed atom now, which is a list
        let pred = new Predicate(epilogJSAtom[0]);
        let argList: Term[] = [];

        // Parse the args
        for (let i = 1; i < epilogJSAtom.length; i++) {
            let currTerm = epilogJSAtom[i];
            
            argList.push(parseTerm(currTerm));
        }

        let newAtom = new Atom(pred, argList);

        //console.log("epilog.js atom:",epilogJSAtom);
        //console.log("Epilog-ts atom:",newAtom.toString());

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
    

}

export {
    EpilogJSToTS
}