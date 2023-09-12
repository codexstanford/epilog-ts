import { Formula } from "./Formula.js";

class Negation {

    readonly target: Formula;

    constructor(target: Formula) {
        this.target = target;
    }

    toString() {
        return "¬" + this.target.toString();
    }

    getVars() : Set<string> {
        return this.target.getVars();
    }
}


export {
    Negation
}