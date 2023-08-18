import { Predicate } from "./Predicate.js";

import { Term } from "./Term.js";


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
}

const ErrorAtom = new Atom(new Predicate("error"), []);

export { 
    Atom,

    ErrorAtom
}