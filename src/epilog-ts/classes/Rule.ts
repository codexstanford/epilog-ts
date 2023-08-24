import { Atom, ERROR_ATOM } from "./Atom.js";

import { Literal } from "./Literal.js";

// Note that Subgoals have isNegated() methods defined
type Subgoal = Atom | Literal;

class Rule {
    readonly head: Atom;
    readonly body: Subgoal[];

    constructor(head: Atom, body: Subgoal[]) {
        this.head = head;
        // Note: Doesn't check for duplicate subgoals
        this.body = body;
    }

    toString() : string {
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

    isGround() : boolean {
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

    getVars() : Set<string> {
        let varList : string[] = [...this.head.getVars()];

        for (let subgoal of this.body) {
            varList = varList.concat([...subgoal.getVars()]);
        }
        
        let varSet : Set<string> = new Set(varList);
        return varSet;
    }
}

const ERROR_RULE = new Rule(ERROR_ATOM, [ERROR_ATOM]);

export { 
    Rule,

    ERROR_RULE
 }