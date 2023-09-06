import { Rule } from "../classes/Rule.js";
import { Substitution } from "../classes/Substitution.js";
import { Variable } from "../classes/Term.js";



// Standardize the variables of the rule such that the following hold:
    // The head variables are of the form 'V{num}'
    // The existentially-quantified body variables are of the form 'EV{num}'
    // Each unique variable in the input is a unique variable in the output
// Purpose: Ensure each variable has a unique name, following a known pattern.
function standardizeRuleVars(rule: Rule) : Rule {
    let universalVars : Set<string> = rule.head.getVars();

    let existentialVars : Set<string> = rule.getExistentialVars();


    let standardizingSub : Substitution = new Substitution();

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

export {
    standardizeRuleVars
}