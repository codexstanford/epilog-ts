import { Predicate } from "./Predicate.js";
import { Substitution } from "./Substitution.js";

import { Term, Symbol, Variable, CompoundTerm } from "./Term.js";


class Atom {
    readonly pred: Predicate;
    readonly args: Term[];

    constructor(pred: Predicate, args: Term[]) {
        this.pred = pred;
        this.args = args;
    }

    toString() : string {
        let str = this.pred.toString() + "(";

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
        for (let arg of this.args) {
            if (!arg.isGround()) {
                return false;
            }
        }
        return true;
    }

    isNegated() : boolean {
        return false;
    }

    getVars() : Set<string> {

        let varList : string[] = [];

        for (let arg of this.args) {
            varList = varList.concat([...arg.getVars()]);
        }
        
        let varSet : Set<string> = new Set(varList);
        return varSet;

    }

    getPredNames() : Set<string> {
        return new Set([this.pred.name]);
    }

    // Builds a new Atom to which the substitution has been applied
    static applySub(sub: Substitution, atom: Atom) : Atom {
        let subbedTermList : Term[] = []; 

        for (let arg of atom.args) {
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
        
        return new Atom(new Predicate(atom.pred.name), subbedTermList);
    }

    static renamePredicate(oldPredName: string, newPredName: string, atom : Atom) : Atom {
        return new Atom(Predicate.renamePredicate(oldPredName, newPredName, atom.pred), atom.args);
    } 

}

const ERROR_ATOM = new Atom(new Predicate("error"), []);

export { 
    Atom,

    ERROR_ATOM
}