import { Rule } from "./Rule.js";
class Ruleset {
    constructor(rules) {
        this.rules = rules;
    }
    toString() {
        let str = "{";
        for (let rule of this.rules) {
            str += rule.toString() + "\n";
        }
        str = str.slice(0, -1);
        str += "}";
        return str;
    }
    toEpilogString() {
        let str = "";
        for (let rule of this.rules) {
            str += rule.toString() + "\n";
        }
        str = str.slice(0, -1);
        return str;
    }
    static renamePredicate(oldPredName, newPredName, ruleset) {
        let renamedRules = [];
        for (let rule of ruleset.rules) {
            renamedRules.push(Rule.renamePredicate(oldPredName, newPredName, rule));
        }
        return new Ruleset(renamedRules);
    }
}
export { Ruleset };
//# sourceMappingURL=Ruleset.js.map