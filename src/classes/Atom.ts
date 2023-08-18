import { Predicate } from "./Predicate";

import { Term } from "./Term";


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

        // Remove extra comma and space
        str = str.slice(0, -2);
        str += ")";
        return str;
    }

    isGround() : boolean{
        for (let arg of this.args) {
            if (!arg.isGround()) {
                return false;
            }
        }
        return true;
    }
}

export { Atom }