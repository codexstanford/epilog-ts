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
    isGround() {
        return true;
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
    isGround() {
        return false;
    }
}
class CompoundTerm {
    constructor(constr, args) {
        this.constr = constr;
        this.args = args;
    }
    toString() {
        let str = this.constr.toString() + "(";
        for (let arg of this.args) {
            str += arg.toString() + ", ";
        }
        // Remove extra comma and space
        str = str.slice(0, -2);
        str += ")";
        return str;
    }
    isGround() {
        // Ground iff all arguments are ground
        for (let arg of this.args) {
            if (!arg.isGround()) {
                return false;
            }
        }
        return true;
    }
}
export { Symbol, Variable, CompoundTerm };
//# sourceMappingURL=Term.js.map