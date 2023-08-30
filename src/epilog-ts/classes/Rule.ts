import { Atom, ERROR_ATOM } from "./Atom.js";

import { Literal } from "./Literal.js";
import { Substitution } from "./Substitution.js";

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

    bodyToString() : string {
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

    // Get the variables that are existentially quantified, i.e. those in the body and not the head
    getExistentialVars() : Set<string> {
        let existentialVarList : string[] = [];

        let headVarSet: Set<string> = this.head.getVars();

        for (let subgoal of this.body) {
            for (let varName of subgoal.getVars()) {
                if (headVarSet.has(varName)) {
                    continue;
                }
                existentialVarList.push(varName);
            }
        }

        let existentialVarSet: Set<string> = new Set(existentialVarList);
        return existentialVarSet;
    }

    // Builds a new Rule to which the substitution has been applied
    static applySub(sub: Substitution, rule: Rule) : Rule {
        
        let subbedHead : Atom = Atom.applySub(sub, rule.head);

        let subbedBody : Subgoal[] = [];

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
}

const ERROR_RULE = new Rule(ERROR_ATOM, [ERROR_ATOM]);

export { 
    Rule,

    ERROR_RULE
 }