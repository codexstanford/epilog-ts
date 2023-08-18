import { isEpilogVariable, isEpilogConstant } from "../utils/string-utils.js";
class Symbol {
    constructor(name) {
        if (isEpilogConstant(name)) {
            this.name = name;
            return;
        }
        console.error("Invalid symbol name: ", name);
        this.name = "error";
    }
    toString() {
        return this.name;
    }
}
class Variable {
    constructor(name) {
        if (isEpilogVariable(name)) {
            this.name = name;
            return;
        }
        console.error("Invalid variable name: ", name);
        this.name = "error";
    }
    toString() {
        return this.name;
    }
}
class CompoundTerm {
    constructor(constrSym, args) {
        this.constrSym = constrSym;
        this.args = args;
    }
    toString() {
        let str = this.constrSym.toString() + "(";
        for (let arg of this.args) {
            str += arg.toString() + ", ";
        }
        // Remove extra comma and space
        str = str.slice(0, -2);
        str += ")";
        return str;
    }
}
export { Symbol, Variable, CompoundTerm };
//# sourceMappingURL=Term.js.map