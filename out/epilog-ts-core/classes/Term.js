import { Constructor } from "./Constructor.js";
import { isEpilogVariable, isEpilogConstant } from "../utils/string-utils.js";
class Symbol {
    constructor(name) {
        if (isEpilogConstant(name)) {
            this.name = name;
            return;
        }
        console.error("Invalid symbol name: ", name);
        this.name = "error";
    }
    toString() {
        return this.name;
    }
    isGround() {
        return true;
    }
    getVars() {
        return new Set();
    }
    clone() {
        return new Symbol(this.name);
    }
    // Returns a copy of the Symbol, unmodifed
    static applySub(sub, sym) {
        return sym.clone();
    }
}
class Variable {
    constructor(name) {
        if (isEpilogVariable(name)) {
            this.name = name;
            return;
        }
        console.error("Invalid variable name: ", name);
        this.name = "error";
    }
    toString() {
        return this.name;
    }
    isGround() {
        return false;
    }
    isAnonymous() {
        return this.name === "_";
    }
    getVars() {
        // If an error, return the empty set
        if (this.name === "error") {
            return new Set();
        }
        if (this.isAnonymous()) {
            console.warn("Called getVars() on an anonymous variable. As currently implemented, all anonymous variables will alias to the same name.");
        }
        return new Set([this.name]);
    }
    clone() {
        return new Variable(this.name);
    }
    // The only object to which a substitution can be directly applied
    static applySub(sub, variable) {
        if (sub.hasSub(variable.name)) {
            return sub.getSub(variable.name).clone();
        }
        return variable.clone();
    }
}
class CompoundTerm {
    constructor(constr, args) {
        this.constr = constr;
        this.args = args;
    }
    toString() {
        let str = this.constr.toString() + "(";
        for (let arg of this.args) {
            str += arg.toString() + ", ";
        }
        // Remove extra comma and space, if args exist
        if (this.args.length > 0) {
            str = str.slice(0, -2);
        }
        str += ")";
        return str;
    }
    isGround() {
        // Ground iff all arguments are ground
        for (let arg of this.args) {
            if (!arg.isGround()) {
                return false;
            }
        }
        return true;
    }
    getVars() {
        let varList = [];
        for (let arg of this.args) {
            varList = varList.concat([...arg.getVars()]);
        }
        let varSet = new Set(varList);
        return varSet;
    }
    // Make a copy of the Constructor, and clone the args 
    clone() {
        let clonedArgs = [];
        for (let arg of this.args) {
            clonedArgs.push(arg.clone());
        }
        return new CompoundTerm(new Constructor(this.constr.name), clonedArgs);
    }
    // Builds a new CompoundTerm to which the substitution has been applied
    static applySub(sub, compoundTerm) {
        let subbedTermList = [];
        for (let arg of compoundTerm.args) {
            if (arg instanceof Symbol) {
                subbedTermList.push(Symbol.applySub(sub, arg));
                continue;
            }
            if (arg instanceof Variable) {
                subbedTermList.push(Variable.applySub(sub, arg));
                continue;
            }
            if (arg instanceof CompoundTerm) {
                subbedTermList.push(CompoundTerm.applySub(sub, arg));
                continue;
            }
        }
        return new CompoundTerm(new Constructor(compoundTerm.constr.name), subbedTermList);
    }
}
// Apply a substitution to a Term with an unknown type.
function applySubtoTerm(sub, term) {
    if (term instanceof Symbol) {
        return Symbol.applySub(sub, term);
    }
    if (term instanceof Variable) {
        return Variable.applySub(sub, term);
    }
    if (term instanceof CompoundTerm) {
        return CompoundTerm.applySub(sub, term);
    }
    console.error("Cannot apply a Substitution to a Term with an invalid type:", term);
    return ERROR_TERM;
}
const ERROR_TERM = new Symbol("error");
const ERROR_COMPOUND_TERM = new CompoundTerm(new Constructor("error"), []);
export { Symbol, Variable, CompoundTerm, applySubtoTerm, ERROR_TERM, ERROR_COMPOUND_TERM };
//# sourceMappingURL=Term.js.map