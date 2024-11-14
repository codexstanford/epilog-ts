import { Constructor } from "./Constructor.js";

import { isEpilogVariable, isEpilogConstant } from "../utils/string-utils.js";
import { Substitution } from "./Substitution.js";

type Term = Symbol | Variable | CompoundTerm;

class Symbol {
    readonly name : string;

    constructor(name: string) {
        if (isEpilogConstant(name)) {
            this.name = name;
            return;
        }

        console.error("Invalid symbol name: ", name);
        this.name = "error";
    }

    toString() : string {
        return this.name;
    }

    isGround() : boolean {
        return true;
    }

    getVars() : Set<string> {
        return new Set();
    }

    clone() : Symbol {
        return new Symbol(this.name)
    }

    // Returns a copy of the Symbol, unmodifed
    static applySub(sub: Substitution, sym: Symbol) : Symbol {
        return sym.clone();
    }
 }

class Variable {
    readonly name : string;

    constructor(name: string) {
        if (isEpilogVariable(name)) {
            this.name = name;
            return;
        }

        console.error("Invalid variable name: ", name);
        this.name = "error";
    }

    toString() : string {
        return this.name;
    }

    isGround() : boolean {
        return false;
    }

    isAnonymous() : boolean {
        return this.name === "_";
    }

    getVars() : Set<string> {
        
        // If an error, return the empty set
        if (this.name === "error") {
            return new Set();
        }
        
        if (this.isAnonymous()) {
            console.warn("Called getVars() on an anonymous variable. As currently implemented, all anonymous variables will alias to the same name.");
        }

        return new Set([this.name]);
    }

    clone() : Variable {
        return new Variable(this.name)
    }

    // The only object to which a substitution can be directly applied
    static applySub(sub: Substitution, variable: Variable) : Term {
        if (sub.hasSub(variable.name)) {
            return sub.getSub(variable.name).clone();
        }
        
        return variable.clone();
    }
}

class CompoundTerm {
    readonly constr : Constructor;
    readonly args : Term[];

    constructor(constr: Constructor, args: Term[]) {
        this.constr = constr;
        this.args = args;
    }

    toString() : string {
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

    isGround() : boolean {
        // Ground iff all arguments are ground

        for (let arg of this.args) {
            if (!arg.isGround()) {
                return false;
            }
        }
        return true;
    }

    getVars() : Set<string> {

        let varList : string[] = [];

        for (let arg of this.args) {
            varList = varList.concat([...arg.getVars()]);
        }
        
        let varSet : Set<string> = new Set(varList);
        return varSet;
    }

    // Make a copy of the Constructor, and clone the args 
    clone() : CompoundTerm {
        
        let clonedArgs : Term[] = [];

        for (let arg of this.args) {
            clonedArgs.push(arg.clone());
        }

        return new CompoundTerm(new Constructor(this.constr.name), clonedArgs);
    }

    // Builds a new CompoundTerm to which the substitution has been applied
    static applySub(sub: Substitution, compoundTerm: CompoundTerm) : CompoundTerm {

        let subbedTermList : Term[] = [];

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
function applySubtoTerm(sub: Substitution, term: Term) : Term {
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

export {
    Symbol, 
    Variable, 
    CompoundTerm, 
    Term,

    applySubtoTerm,

    ERROR_TERM,
    ERROR_COMPOUND_TERM
}