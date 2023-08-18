import { Predicate } from "./Predicate.js";
class Atom {
    constructor(pred, args) {
        this.pred = pred;
        this.args = args;
    }
    toString() {
        let str = this.pred.toString() + "(";
        for (let arg of this.args) {
            str += arg.toString() + ", ";
        }
        // Remove extra comma and space, if args exist
        if (this.args.length > 0) {
            str = str.slice(0, -2);
        }
        str += ")";
        return str;
    }
    isGround() {
        for (let arg of this.args) {
            if (!arg.isGround()) {
                return false;
            }
        }
        return true;
    }
}
const ErrorAtom = new Atom(new Predicate("error"), []);
export { Atom, ErrorAtom };
//# sourceMappingURL=Atom.js.map