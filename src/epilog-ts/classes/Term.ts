import { Constructor } from "./Constructor.js";

import { isEpilogVariable, isEpilogConstant } from "../utils/string-utils.js";

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
}

const ERROR_TERM = new Symbol("error");

export {
    Symbol, 
    Variable, 
    CompoundTerm, 
    Term,

    ERROR_TERM
}