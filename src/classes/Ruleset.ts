import { Rule } from "./Rule.js";

class Ruleset {
    readonly rules: Rule[];

    constructor(rules: Rule[]) {
        this.rules = rules;
    }

    toString() : string {
        let str = "{";

        for (let rule of this.rules) {
            str += rule.toString() + "\n";
        }

        str = str.slice(0, -1);
        str += "}";

        return str;
    }

    toEpilogString() : string {
        let str = "";

        for (let rule of this.rules) {
            str += rule.toString() + "\n";
        }

        str = str.slice(0, -1);

        return str;
    }

}

export { Ruleset }