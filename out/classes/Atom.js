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
        // Remove extra comma and space
        str = str.slice(0, -2);
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
export { Atom };
//# sourceMappingURL=Atom.js.map