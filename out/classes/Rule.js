class Rule {
    constructor(head, body) {
        this.head = head;
        // Note: Doesn't check for duplicate subgoals
        this.body = body;
    }
    toString() {
        if (this.body.length === 0) {
            return this.head.toString();
        }
        let str = this.head.toString() + " :- ";
        for (let subgoal of this.body) {
            str += subgoal.toString() + " & ";
        }
        str = str.slice(0, -3);
        return str;
    }
    isGround() {
        if (!this.head.isGround()) {
            return false;
        }
        for (let subgoal of this.body) {
            if (!subgoal.isGround()) {
                return false;
            }
        }
        return true;
    }
}
export { Rule };
//# sourceMappingURL=Rule.js.map