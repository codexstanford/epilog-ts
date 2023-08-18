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
}

export {
    Predicate
}