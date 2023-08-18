import { ERROR_RULE } from "./Rule.js";
class ConjunctiveQuery {
    get rules() {
        return [this.rule];
    }
    // Must be a single-rule query with no negation
    constructor(queryPred, rule) {
        this.queryPred = queryPred;
        // Check for negated subgoals
        for (let subgoal of rule.body) {
            if (subgoal.isNegated()) {
                console.error("A CQ cannot contain a negated subgoal:", rule.toString());
                this.rule = ERROR_RULE;
                return;
            }
        }
        this.rule = rule;
        // Warn if the query predicate doesn't match the rule head
        if (this.queryPred.toString() !== this.rule.head.pred.toString()) {
            console.warn("Query predicate", this.queryPred.toString(), "doesn't appear in query:", this.rule.toString());
        }
    }
    toString() {
        return this.rule.toString();
    }
}
export { ConjunctiveQuery, };
//# sourceMappingURL=Query.js.map