import { Atom, ERROR_ATOM } from "./Atom.js";
import { Literal } from "./Literal.js";
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
    bodyToString() {
        if (this.body.length === 0) {
            return "";
        }
        let str = "";
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
    getVars() {
        let varList = [...this.head.getVars()];
        for (let subgoal of this.body) {
            varList = varList.concat([...subgoal.getVars()]);
        }
        let varSet = new Set(varList);
        return varSet;
    }
    // Get the variables that are existentially quantified, i.e. those in the body and not the head
    getExistentialVars() {
        let existentialVarList = [];
        let headVarSet = this.head.getVars();
        for (let subgoal of this.body) {
            for (let varName of subgoal.getVars()) {
                if (headVarSet.has(varName)) {
                    continue;
                }
                existentialVarList.push(varName);
            }
        }
        let existentialVarSet = new Set(existentialVarList);
        return existentialVarSet;
    }
    // Builds a new Rule to which the substitution has been applied
    static applySub(sub, rule) {
        let subbedHead = Atom.applySub(sub, rule.head);
        let subbedBody = [];
        // Apply the substitution to the subgoals
        for (let subgoal of rule.body) {
            if (subgoal instanceof Atom) {
                subbedBody.push(Atom.applySub(sub, subgoal));
                continue;
            }
            if (subgoal instanceof Literal) {
                subbedBody.push(Literal.applySub(sub, subgoal));
                continue;
            }
        }
        return new Rule(subbedHead, subbedBody);
    }
    static renamePredicate(oldPredName, newPredName, rule) {
        let renamedHead = Atom.renamePredicate(oldPredName, newPredName, rule.head);
        let renamedSubgoals = [];
        for (let subgoal of rule.body) {
            if (subgoal instanceof Atom) {
                renamedSubgoals.push(Atom.renamePredicate(oldPredName, newPredName, subgoal));
                continue;
            }
            if (subgoal instanceof Literal) {
                renamedSubgoals.push(Literal.renamePredicate(oldPredName, newPredName, subgoal));
                continue;
            }
        }
        return new Rule(renamedHead, renamedSubgoals);
    }
}
const ERROR_RULE = new Rule(ERROR_ATOM, [ERROR_ATOM]);
export { Rule, ERROR_RULE };
//# sourceMappingURL=Rule.js.map