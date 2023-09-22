import { ConjunctiveQuery, isCQ } from "../epilog-ts/classes/Query.js";
import { Symbol } from "../epilog-ts/classes/Term.js";
import { Rule } from "../epilog-ts/classes/Rule.js";
import { Substitution } from "../epilog-ts/classes/Substitution.js";
import { Dataset } from "../epilog-ts/classes/Dataset.js";
import { Atom } from "../epilog-ts/classes/Atom.js";
import { EpilogJSToTS } from "../epilog-ts/parsing/epilog-js-to-epilog-ts.js";
function freezeCQ(cq) {
    // Get the variables of cq
    let variableSet = cq.rule.getVars();
    // For each one, assign a new constant "v{num}"
    let freezingMap = new Map();
    let currVarNum = 0;
    for (let varName of variableSet) {
        freezingMap.set(varName, new Symbol("v" + currVarNum.toString()));
        currVarNum++;
    }
    // Create a Substitution from the variables to the frozen constants
    let freezingSub = new Substitution(freezingMap);
    // Apply the substitution to the CQ
    let frozenCQ = new ConjunctiveQuery(cq.queryPred, Rule.applySub(freezingSub, cq.rule));
    // Return the frozen result
    return frozenCQ;
}
class CQContainmentTester {
    // Determine whether q1 is contained within q2
    containedWithin(q1, q2) {
        if (!isCQ(q1)) {
            console.warn("CQContainmentTester can only determine containment between CQs, but q1 is not a CQ:", q1.toString());
            return false;
        }
        if (!isCQ(q2)) {
            console.warn("CQContainmentTester can only determine containment between CQs, but q2 is not a CQ:", q2.toString());
            return false;
        }
        // Freeze the head and body of q1
        let frozenCQ = freezeCQ(q1);
        // All subgoals are positive, so can be converted to Atoms
        let frozenBody = [];
        for (let subgoal of frozenCQ.rule.body) {
            if (subgoal instanceof Atom) {
                frozenBody.push(subgoal);
                continue;
            }
            // Must be a non-negated Literal
            frozenBody.push(subgoal.atom);
        }
        // Convert the body of q1 to a dataset
        let frozenDB = new Dataset(frozenBody);
        // Evaluate q2 on q1
        // Convert frozenDB to string and have epilog.js read it
        let epilogJSDataset = readdata(frozenDB.toEpilogString());
        // Have epilog.js read q2
        let epilogJSQ2Head = read(q2.rule.head.toString());
        let epilogJSQ2Body = read(q2.rule.bodyToString());
        // Have epilog.js evaluate q2 on q1
        let epilogJSResults = compfinds(epilogJSQ2Head, epilogJSQ2Body, definemorefacts([], epilogJSDataset), []);
        let frozenHeadStr = frozenCQ.rule.head.toString();
        // Parse each result into Epilog.ts and return whether the frozen head of q1 is derived by q2
        for (let epilogJSAtom of epilogJSResults) {
            let result = EpilogJSToTS.parseAtom(epilogJSAtom);
            if (result.toString() === frozenHeadStr) {
                return true;
            }
        }
        // Failed to derive the frozen head
        return false;
    }
}
export { CQContainmentTester };
//# sourceMappingURL=cq-containment.js.map