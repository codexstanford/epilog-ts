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
}
export { Ruleset };
//# sourceMappingURL=Ruleset.js.map