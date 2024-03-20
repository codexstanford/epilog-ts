import { isEpilogConstant } from "../utils/string-utils.js";

class Predicate {
    readonly name : string;

    constructor(name: string) {
        if (isEpilogConstant(name)) {
            this.name = name;
            return;
        }

        console.error("Invalid predicate name: ", name);
        this.name = "error";
    }

    toString() : string {
        return this.name;
    }

    static renamePredicate(oldPredName: string, newPredName: string, pred : Predicate) : Predicate {
        if (oldPredName === pred.name) {
            return new Predicate(newPredName);
        }

        return new Predicate(pred.name);
    }
}

export {
    Predicate
}