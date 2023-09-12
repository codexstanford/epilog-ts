class Negation {
    constructor(target) {
        this.target = target;
    }
    toString() {
        return "¬" + this.target.toString();
    }
    getVars() {
        return this.target.getVars();
    }
}
export { Negation };
//# sourceMappingURL=Negation.js.map