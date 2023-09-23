import { Rule } from "./Rule.js";

class Ruleset {
    readonly rules: Rule[];

    constructor(rules: Rule[]) {
        this.rules = rules;
    }

    getPredNames() : Set<string> {
        let predNameList : string[] = [];

        for (let rule of this.rules) {
            predNameList = [...predNameList, ...rule.getPredNames()];
        }

        return new Set(predNameList);
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

    static renamePredicate(oldPredName : string, newPredName : string, ruleset: Ruleset) {
        let renamedRules : Rule[] = [];

        for (let rule of ruleset.rules) {
            renamedRules.push(Rule.renamePredicate(oldPredName, newPredName, rule));
        }

        return new Ruleset(renamedRules);
    }

}

export { Ruleset }