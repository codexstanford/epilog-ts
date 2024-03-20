import { Predicate } from "./Predicate.js";

import { ERROR_RULE, Rule } from "./Rule.js";

interface Query {
    readonly queryPred: Predicate;
    readonly rules: Rule[];

    getPredNames(): Set<string>;
    getQueryPredRules() : Rule[]; // Should return a list containing all of the query's Rules that have the query predicate in the head of the Rule. There should always be at least one such Rule.

}

// ============================== General Query functions ==============================
// Construct a Query object from the input
// The type of the returned object will be the most specific class of query that the input falls into. (e.g. a CQ will be a CQ object, even though it is also a UCQ)
// If the input does not fall into an implemented/distinguished class of query, returns an ArbitraryQuery object
function makeQuery(queryPred: Predicate, rules: Rule[]) : Query {

    // Temporary version of this, while CQ is the only non-Arbitrary implemented Query class
    let defaultQuery: ArbitraryQuery = new ArbitraryQuery(queryPred, rules);


    if (rules.length !== 1) {
        return defaultQuery;
    }

    for (let subgoal of rules[0].body) {
        if (subgoal.isNegated()) {
            return defaultQuery
        }
    }

    // NOTE: Should also check for interpreted predicates, once they are distinguished

    return new ConjunctiveQuery(queryPred, rules[0]);
}

// =============== Classification functions ===============

function isCQ(q: Query) : q is ConjunctiveQuery {
    // Note: temporary test, as we should also check the properties of the rules of the query, in case its class is too conservative
    return q instanceof ConjunctiveQuery;
}


// ============================== End General Query functions ==============================

// ============================== Query Classes ==============================

type CQ = ConjunctiveQuery;

class ConjunctiveQuery implements Query {
    readonly queryPred: Predicate;
    readonly rule: Rule;
    
    get rules() : Rule[] {
        return [this.rule];
    }

    // Must be a single-rule query with no negation
    constructor(queryPred: Predicate, rule: Rule) {
        this.queryPred = queryPred;
        
        // Check for negated subgoals
        for (let subgoal of rule.body) {
            if (subgoal.isNegated()) {
                console.error("A CQ cannot contain a negated subgoal:", rule.toString());
                this.rule = ERROR_RULE;
                return;
            }
        }

        // NOTE: Should also check for interpreted predicates, once they are distinguished

        this.rule = rule;

        // Warn if the query predicate doesn't match the rule head
        if (this.queryPred.name !== this.rule.head.pred.name) {
            console.warn("Query predicate", this.queryPred.toString(), "doesn't appear in query:",this.rule.toString());
        }
    }
    
    getPredNames(): Set<string> {
        return this.rule.getPredNames();
    }
    
    getQueryPredRules(): Rule[] {
        return [this.rule];
    }

    toString() : string {
        return this.rule.toString();
    }

}

// Every query can be an ArbitraryQuery - this is the most general class of query.
class ArbitraryQuery implements Query {
    readonly queryPred: Predicate;
    readonly rules: Rule[];

    constructor(queryPred: Predicate, rules: Rule[]) {
        this.queryPred = queryPred;
        this.rules = rules;

        // Check whether the query predicate doesn't match any rule head
        let queryPredMatchesHead = false;
        for (let rule of this.rules) {
            if (this.queryPred.name === rule.head.pred.name) {
                queryPredMatchesHead = true;
                break;
            }
        }

        // Warn if not
        if (!queryPredMatchesHead) {
            console.warn("Query predicate", this.queryPred.toString(), "doesn't appear in query:",this.toString());
        }
    }

    getPredNames(): Set<string> {
        let predNameList: string[] = [];

        for (let rule of this.rules) {
            predNameList = [...predNameList, ...rule.getPredNames()];
        }

        return new Set(predNameList);
    }

    // Returns a list containing all of the query's Rules that have the query predicate in the head of the Rule. There should always be at least one such Rule.
    getQueryPredRules(): Rule[] {
        let queryPredRuleList: Rule[] = [];

        for (let rule of this.rules) {
            if (rule.head.pred.name === this.queryPred.name) {
                queryPredRuleList.push(rule);
            }
        }
        return queryPredRuleList;
        
    }

    toString() : string {
        let str = "{\n";

        for (let rule of this.rules) {
            str += "\t"+ rule.toString() +"\n"
        }

        str += "}"

        return str;
    }
}

export { 
    Query,

    
    CQ,
    ConjunctiveQuery,


    makeQuery,
    isCQ,
}
