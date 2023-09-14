import { Biconditional } from "../../first-order-logic/classes/Biconditional.js";
import { Conjunction } from "../../first-order-logic/classes/Conjunction.js";
import { Disjunction } from "../../first-order-logic/classes/Disjunction.js";
import { ERROR_FORMULA } from "../../first-order-logic/classes/Formula.js";
import { QuantifiedFormula, Quantifier } from "../../first-order-logic/classes/QuantifiedFormula.js";
import { Atom } from "../classes/Atom.js";
import { Literal } from "../classes/Literal.js";
import { Predicate } from "../classes/Predicate.js";
import { Rule } from "../classes/Rule.js";
import { Substitution } from "../classes/Substitution.js";
import { Variable } from "../classes/Term.js";
import { standardizeRuleVars } from "../utils/standardize.js";
var EpilogTSToFOL;
(function (EpilogTSToFOL) {
    function parseSubgoal(epilogTSSubgoal) {
        if (epilogTSSubgoal instanceof Literal) {
            return epilogTSSubgoal;
        }
        return new Literal(epilogTSSubgoal, false);
    }
    // Requires that all rules have the same head predicate
    // Note: currently assumes arity agreement. Once Schema are added, this will be explicitly checked.
    function parseRuleList(epilogTSRules) {
        if (epilogTSRules.length === 0) {
            // Empty conjunction created because rule is true by default, and therefore does not impose additional constraints
            return new Conjunction([]);
        }
        let definedViewPred = epilogTSRules[0].head.pred;
        // --- All rules must have the same head predicate
        for (let rule of epilogTSRules) {
            if (rule.head.pred.name !== definedViewPred.name) {
                console.error("parseRulelist expects input rules to have the same head predicate, but they do not:", epilogTSRules);
                return ERROR_FORMULA;
            }
        }
        // --- Create the standardized list of head args, such that each head argument is a distinct variable: V0, V1, ... 
        let definedViewArity = epilogTSRules[0].head.args.length;
        let standardizedHeadArgs = [];
        for (let i = 0; i < definedViewArity; i++) {
            standardizedHeadArgs.push(new Variable('V' + i));
        }
        let standardizedHead = new Atom(definedViewPred, standardizedHeadArgs);
        // --- Standardize the rules such that their heads are identical, and each head arg is a unique variable 
        let standardizedRules = [];
        for (let rule of epilogTSRules) {
            // Rename the head vars to be 'V{num}' and the existentially-quantified vars to be 'EV{num}'
            let standardizedRule = standardizeRuleVars(rule);
            //console.log(standardizedRule.toString());
            let headVarSub = new Substitution();
            let equalityPred = new Predicate('equal');
            let equalityConstraints = [];
            // Substitute each argument in the head of the rule with the corresponding standardizedHeadArg, 
            // and add 'same' constraints to the body for each replaced constant
            for (let i = 0; i < definedViewArity; i++) {
                let currHeadArg = standardizedRule.head.args[i];
                // Substitute for vars
                if (currHeadArg instanceof Variable) {
                    // If a variable appears more than once in the head, the first applicable substitution is used, and an additional equality constraint is added between the replacing variables.
                    // Though we don't update the headVarSub in this case, don't have to worry about the head variable because we only use standardizedHead in the final formula.
                    if (headVarSub.hasSub(currHeadArg.name)) {
                        equalityConstraints.push(new Atom(equalityPred, [headVarSub.getSub(currHeadArg.name), standardizedHeadArgs[i]]));
                        continue;
                    }
                    headVarSub.setSub(currHeadArg.name, standardizedHeadArgs[i]);
                    continue;
                }
                // Add constraints for non-variable head args
                equalityConstraints.push(new Atom(equalityPred, [standardizedHeadArgs[i], currHeadArg]));
            }
            //console.log(headVarSub.toString());
            //console.log(equalityConstraints);
            standardizedRule = Rule.applySub(headVarSub, standardizedRule);
            standardizedRule = new Rule(standardizedHead, [...standardizedRule.body, ...equalityConstraints]);
            //console.log("Rule:",standardizedRule.toString());
            standardizedRules.push(standardizedRule);
        }
        // --- Convert the rule bodies into formulas, where each body is a conjunction with 0 or more existentially quantified variables
        let bodyFormulas = [];
        for (let stdRule of standardizedRules) {
            // Convert the body into a list of literals
            let subgoalLiterals = [];
            for (let subgoal of stdRule.body) {
                subgoalLiterals.push(parseSubgoal(subgoal));
            }
            // Convert the literals into a conjunction
            let bodyFormula = new Conjunction(subgoalLiterals);
            let existentialVars = stdRule.getExistentialVars();
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
        let relationDisjunction = new Disjunction(bodyFormulas);
        // --- IFF between the standardized head and the body formulas
        let headAntecedent = new Literal(standardizedHead, false);
        let overallBiconditional = new Biconditional(headAntecedent, relationDisjunction);
        let finalFormula = overallBiconditional;
        // --- Eniversally quantify the variables in the head
        for (let univVar of standardizedHeadArgs) {
            finalFormula = new QuantifiedFormula(Quantifier.Universal, univVar, finalFormula);
        }
        return finalFormula;
    }
    EpilogTSToFOL.parseRuleList = parseRuleList;
    function parseRuleset(epilogTSRuleset) {
        let viewPredicateToRules = new Map();
        for (let rule of epilogTSRuleset.rules) {
            let currRuleHeadPredName = rule.head.pred.name;
            // Update the list of rules corresponding to the head predicate, if it exists
            if (viewPredicateToRules.has(currRuleHeadPredName)) {
                viewPredicateToRules.set(currRuleHeadPredName, [...viewPredicateToRules.get(currRuleHeadPredName), rule]);
                continue;
            }
            // Otherwise, start with the list containing the current rule
            viewPredicateToRules.set(currRuleHeadPredName, [rule]);
        }
        // Parse and conjoin each rule list
        let viewFormulas = [];
        for (let viewPred of viewPredicateToRules.values()) {
            viewFormulas.push(parseRuleList(viewPred));
        }
        return new Conjunction(viewFormulas);
    }
    EpilogTSToFOL.parseRuleset = parseRuleset;
})(EpilogTSToFOL || (EpilogTSToFOL = {}));
export { EpilogTSToFOL };
//# sourceMappingURL=epilog-ts-to-fol.js.map