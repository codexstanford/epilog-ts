import { Atom } from "../classes/Atom.js";
import { Predicate } from "../classes/Predicate.js";
import { Rule } from "../classes/Rule.js";
import { Substitution } from "../classes/Substitution.js";
import { Variable } from "../classes/Term.js";
// Standardize the Variables of the rule such that the following hold:
// The head Variables are of the form 'V{num}'
// The existentially-quantified body Variables are of the form 'EV{num}'
// Each unique Variable in the input is a unique Variable in the output
// Purpose: Ensure each Variable has a unique name, following a known pattern.
function standardizeRuleVars(rule) {
    let universalVars = rule.head.getVars();
    let existentialVars = rule.getExistentialVars();
    let standardizingSub = new Substitution();
    let currUnivVarNum = 0;
    for (let univVarName of universalVars) {
        standardizingSub.setSub(univVarName, new Variable("V" + currUnivVarNum));
        currUnivVarNum++;
    }
    let currExistVarNum = 0;
    for (let existVarName of existentialVars) {
        standardizingSub.setSub(existVarName, new Variable('EV' + currExistVarNum));
        currExistVarNum++;
    }
    return Rule.applySub(standardizingSub, rule);
}
const EQUALITY_PRED = new Predicate('same');
// Standardize the head of the rule such that each argument is a distinct Variable
// May modify the body to ensure equality between old head arguments and new head vars
// Additionally, the Variables of the rule are standardized by standardizeRuleVars
function standardizeRuleHead(rule) {
    rule = standardizeRuleVars(rule);
    let newHeadArgs = [];
    // Add new head Variables, starting from where standardizeRuleVars left off
    let currUnivVarNum = rule.head.getVars().size;
    // Replace non-Variable args and repeat Variables with new head Variables
    // Add equality constraints between the old args and the new Variables
    let argEqualitySubgoals = [];
    // For keeping track of which Variables have been seen as top-level args of the head
    let seenHeadArgVarNames = new Set();
    for (let arg of rule.head.args) {
        // First time seeing the Variable, so keep it
        if (arg instanceof Variable && !seenHeadArgVarNames.has(arg.name)) {
            newHeadArgs.push(arg);
            seenHeadArgVarNames.add(arg.name);
            continue;
        }
        // Non-Variable or repeat Variable arg, so replace it with a unique Variable
        let newHeadVar = new Variable("V" + currUnivVarNum);
        newHeadArgs.push(newHeadVar);
        currUnivVarNum++;
        // Add equality constraint between the new head Variable and the old non-Variable arg
        argEqualitySubgoals.push(new Atom(EQUALITY_PRED, [arg, newHeadVar]));
    }
    return standardizeRuleVars(new Rule(new Atom(new Predicate(rule.head.pred.name), newHeadArgs), [...rule.body, ...argEqualitySubgoals]));
}
export { standardizeRuleVars, standardizeRuleHead };
//# sourceMappingURL=standardize.js.map