import { isEpilogConstant } from "../utils/string-utils.js";

class Constructor {
    readonly name : string;

    constructor(name: string) {
        if (isEpilogConstant(name)) {
            this.name = name;
            return;
        }

        console.error("Invalid constructor name: ", name);
        this.name = "error";
    }

    toString() : string {
        return this.name;
    }
}

export {
    Constructor
}