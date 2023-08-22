import { Symbol, Variable, CompoundTerm, ERROR_TERM } from "../classes/Term.js";
import { Constructor } from "../classes/Constructor.js";
import { Predicate } from "../classes/Predicate.js";
import { Atom, ERROR_ATOM } from "../classes/Atom.js";
import { isEpilogConstant, isEpilogVariable } from "../utils/string-utils.js";
import { Literal, ERROR_LITERAL } from "../classes/Literal.js";
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
    function parseTerm(epilogJSTerm) {
        // Is a comound term
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
        console.error("Parse error - could not parse epilog.js term. Is not a symbol, variable or compound term:", epilogJSTerm);
        return ERROR_TERM;
    }
    function parseAtom(epilogJSAtom) {
        // Handle error case
        if (typeof epilogJSAtom === "string" && epilogJSAtom === "error") {
            return ERROR_ATOM;
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
        //console.log("epilog.js atom:",epilogJSAtom);
        //console.log("Epilog-ts atom:",newAtom.toString());
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
    //function parseRule(epilogJSRule)
})(EpilogJSToTS || (EpilogJSToTS = {}));
export { EpilogJSToTS };
//# sourceMappingURL=epilog-js-to-epilog-ts.js.map