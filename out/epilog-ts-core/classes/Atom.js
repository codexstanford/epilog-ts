import { Predicate } from "./Predicate.js";
import { Symbol, Variable, CompoundTerm } from "./Term.js";
class Atom {
    constructor(pred, args) {
        this.pred = pred;
        this.args = args;
    }
    toString() {
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
    isGround() {
        for (let arg of this.args) {
            if (!arg.isGround()) {
                return false;
            }
        }
        return true;
    }
    isNegated() {
        return false;
    }
    getVars() {
        let varList = [];
        for (let arg of this.args) {
            varList = varList.concat([...arg.getVars()]);
        }
        let varSet = new Set(varList);
        return varSet;
    }
    getPredNames() {
        return new Set([this.pred.name]);
    }
    // Builds a new Atom to which the substitution has been applied
    static applySub(sub, atom) {
        let subbedTermList = [];
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
    static renamePredicate(oldPredName, newPredName, atom) {
        return new Atom(Predicate.renamePredicate(oldPredName, newPredName, atom.pred), atom.args);
    }
}
const ERROR_ATOM = new Atom(new Predicate("error"), []);
export { Atom, ERROR_ATOM };
//# sourceMappingURL=Atom.js.map