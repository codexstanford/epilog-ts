import { ERROR_RULE } from "./Rule.js";
// ============================== General Query functions ==============================
// Construct a Query object from the input
// The type of the returned object will be the most specific class of query that the input falls into. (e.g. a CQ will be a CQ object, even though it is also a UCQ)
// If the input does not fall into an implemented/distinguished class of query, returns an ArbitraryQuery object
function makeQuery(queryPred, rules) {
    // Temporary version of this, while CQ is the only non-Arbitrary implemented Query class
    let defaultQuery = new ArbitraryQuery(queryPred, rules);
    if (rules.length !== 1) {
        return defaultQuery;
    }
    for (let subgoal of rules[0].body) {
        if (subgoal.isNegated()) {
            return defaultQuery;
        }
    }
    // TODO: Check for interpreted predicates
    return new ConjunctiveQuery(queryPred, rules[0]);
}
// =============== Classification functions ===============
function isCQ(q) {
    // Note: temporary test, as we should also check the properties of the rules of the query, in case its class is too conservative
    return q instanceof ConjunctiveQuery;
}
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
        // TODO: Check for interpreted predicates
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
// Every query can be an ArbitraryQuery - this is the most general class of query.
class ArbitraryQuery {
    constructor(queryPred, rules) {
        this.queryPred = queryPred;
        this.rules = rules;
        // Check whether the query predicate doesn't match any rule head
        let queryPredMatchesHead = false;
        for (let rule of this.rules) {
            if (this.queryPred.toString() === rule.head.pred.toString()) {
                queryPredMatchesHead = true;
                break;
            }
        }
        // Warn if not
        if (!queryPredMatchesHead) {
            console.warn("Query predicate", this.queryPred.toString(), "doesn't appear in query:", this.toString());
        }
    }
    toString() {
        let str = "{\n";
        for (let rule of this.rules) {
            str += "\t" + rule.toString() + "\n";
        }
        str += "}";
        return str;
    }
}
export { ConjunctiveQuery, makeQuery, isCQ, };
//# sourceMappingURL=Query.js.map