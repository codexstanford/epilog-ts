import { Biconditional } from "../../first-order-logic/classes/Biconditional.js";
import { Conjunction } from "../../first-order-logic/classes/Conjunction.js";
import { Disjunction } from "../../first-order-logic/classes/Disjunction.js";
import { ERROR_FORMULA, Formula } from "../../first-order-logic/classes/Formula.js";
import { QuantifiedFormula, Quantifier } from "../../first-order-logic/classes/QuantifiedFormula.js";
import { Atom } from "../classes/Atom.js";
import { Literal } from "../classes/Literal.js";
import { Predicate } from "../classes/Predicate.js";
import { Rule } from "../classes/Rule.js";
import { Ruleset } from "../classes/Ruleset.js";
import { Substitution } from "../classes/Substitution.js";
import { Term, Variable } from "../classes/Term.js";
import { standardizeRuleHead, standardizeRuleVars } from "../utils/standardize.js";


namespace EpilogTSToFOL { 

    function parseSubgoal(epilogTSSubgoal : Atom | Literal) : Literal {
        if (epilogTSSubgoal instanceof Literal) {
            return epilogTSSubgoal;  
        }

        return new Literal(epilogTSSubgoal, false);
    }

    // Requires that all rules have the same head predicate
        // Note: currently assumes arity agreement. Once Schema are added, this will be explicitly checked.
    export function parseRuleList(epilogTSRules: Rule[]) : Formula {

        if (epilogTSRules.length === 0) { 
            // Empty conjunction created because rule is true by default, and therefore does not impose additional constraints
            return new Conjunction([]);
        }

        let definedViewPred : Predicate = epilogTSRules[0].head.pred;

        // --- All rules must have the same head predicate
        for (let rule of epilogTSRules) {
            if (rule.head.pred.name !== definedViewPred.name) {
                console.error("parseRulelist expects input rules to have the same head predicate, but they do not:", epilogTSRules);
                return ERROR_FORMULA;
            }
        }

        // --- Create the standardized list of head args, such that each head argument is a distinct variable as from standardizeRuleVars: V0, V1, ... 
        let definedViewArity = epilogTSRules[0].head.args.length;
        let standardizedHeadArgs : Variable[] = [];

        for (let i = 0; i < definedViewArity; i++) {
            standardizedHeadArgs.push(new Variable('V' + i));
        }
        let standardizedHead : Atom = new Atom(definedViewPred, standardizedHeadArgs);

        // --- Standardize the rules such that their heads are identical, and each head arg is a unique variable 
        let standardizedRules : Rule[] = [];
        for (let rule of epilogTSRules) {
            standardizedRules.push(standardizeRuleHead(rule));
        }

        // --- Convert the rule bodies into formulas, where each body is a conjunction with 0 or more existentially quantified variables
        let bodyFormulas : Formula[] = [];
        
        for (let stdRule of standardizedRules) {
            // Convert the body into a list of literals
            let subgoalLiterals : Literal[] = [];
            for (let subgoal of stdRule.body) {
                subgoalLiterals.push(parseSubgoal(subgoal));
            }

            // Convert the literals into a conjunction
            let bodyFormula : Formula = new Conjunction(subgoalLiterals); 

            let existentialVars : Set<string> = stdRule.getExistentialVars();

            // No variables to quantify
            if (existentialVars.size === 0) {
                bodyFormulas.push(bodyFormula);
                continue;
            }

            // Quantify the appropriate body variables
            for (let existentialVar of existentialVars) {
                bodyFormula = new QuantifiedFormula(Quantifier.Existential, new Variable(existentialVar), bodyFormula);
            }

            bodyFormulas.push(bodyFormula);
        }

        // --- Disjoin the bodies
        let relationDisjunction : Disjunction = new Disjunction(bodyFormulas);

        // --- IFF between the standardized head and the body formulas
        let headAntecedent : Literal = new Literal(standardizedHead, false);

        let overallBiconditional : Biconditional = new Biconditional(headAntecedent, relationDisjunction);

        let finalFormula : Formula = overallBiconditional;

        // --- Universally quantify the variables in the head
            // By preference, do so such that the quantifiers read left-to-right from the first head arg to the last. 
        for (let i = definedViewArity-1; i >= 0; i--) {
            let univVar : Variable = standardizedHeadArgs[i];
            finalFormula = new QuantifiedFormula(Quantifier.Universal, univVar, finalFormula);
        }

        return finalFormula;
    }

    export function parseRuleset(epilogTSRuleset : Ruleset) : Formula {
        let viewPredicateToRules : Map<string, Rule[]> = new Map();

        for (let rule of epilogTSRuleset.rules) {
            let currRuleHeadPredName : string = rule.head.pred.name;
            // Update the list of rules corresponding to the head predicate, if it exists
            if (viewPredicateToRules.has(currRuleHeadPredName)) {
                viewPredicateToRules.set(currRuleHeadPredName, [...viewPredicateToRules.get(currRuleHeadPredName), rule]);
                continue;
            }

            // Otherwise, start with the list containing the current rule
            viewPredicateToRules.set(currRuleHeadPredName, [rule]);
        }

        // Parse and conjoin each rule list
        let viewFormulas : Formula[] = [];

        for (let viewPred of viewPredicateToRules.values()) {
            viewFormulas.push(parseRuleList(viewPred));
        }

        return new Conjunction(viewFormulas);
    }

}

export {
    EpilogTSToFOL
}