import { runAllTests } from "./testing/allTests.js";
import { EpilogJSToTS } from "./epilog-ts-core/parsing/epilog-js-to-epilog-ts.js";
import { EpilogTSToFOL } from "./epilog-ts-core/parsing/epilog-ts-to-fol.js";
import { standardizeVarNames } from "./first-order-logic/utils/standardize.js";
import { Conjunction } from "./first-order-logic/classes/Conjunction.js";
document.addEventListener("DOMContentLoaded", function () {
    runAllTests();
    //runTests();
    console.log(EpilogJSToTS.parseCompoundTerm(read("$")).toString());
    return;
    let ruleset_str = `
    r(X) :- p(X, _)
`;
    let ruleset = EpilogJSToTS.parseRuleset(definemorerules([], readdata(ruleset_str)));
    console.log(ruleset.toString());
    return;
    //console.log(cardinal_care_ruleset.toString());
    let predNames = ruleset.getPredNames();
    let definitelyDefinedRelations = new Set();
    let maybeBaseRelations = new Set();
    let predefinedRelations = new Set(["evaluate", "member", "same", "distinct", "leq", "symleq"]);
    /*
        for (let predName of predNames) {
            if(ruleset.hasRuleDefiningPred(predName)) {
                definitelyDefinedRelations.add(predName);
            }
            else {
                // Ignore predefined relations
                if (predefinedRelations.has(predName)) {
                    continue;
                }
                maybeBaseRelations.add(predName)
            }
        }*/
    console.log("Defined relations:", definitelyDefinedRelations);
    console.log("Base relations:", maybeBaseRelations);
    let relationStr = '';
    for (let relationName of definitelyDefinedRelations) {
        relationStr += relationName + "\n";
    }
    relationStr += "%%%%%%%%%%%%%%%%%%% Base relations %%%%%%%%%%%%%%%%%%%\n";
    for (let relationName of maybeBaseRelations) {
        relationStr += relationName + "\n";
    }
    console.log(relationStr);
    return;
    let formation_ruleset_str = `
covered(C) :- 
    claim.policy(C, P) & 
    policy.in_effect(P) & 
    claim.hospitalization(C, H) & 
    hospitalization_valid_reason(H)
    ~exclusion_applies(C)

policy.in_effect(P) :- 
    policy.paid_premium(P) & 
    ~policy.canceled(P)

policy.paid_premium(P) :- 
    policy.premium_amount_paid(P, A) &
    geq(A, 2000)

hospitalization_valid_reason(H) :- hospitalization.reason(H, sickness)
hospitalization_valid_reason(H) :- hospitalization.reason(H, accidental_injury)

exclusion_applies(C) :- 
    claim.hospitalization(C, H) & 
    hospitalization.causal_event(H, skydiving)

geq(X, Y) :- evaluate(min(X,Y), Y)
`;
    let formation_ruleset = EpilogJSToTS.parseRuleset(definemorerules([], readdata(formation_ruleset_str)));
    let formation_ruleset_as_fol = EpilogTSToFOL.parseRuleset(formation_ruleset);
    let example_result = EpilogTSToFOL.parseAtom(EpilogJSToTS.parseAtom(read("covered(claim1)")));
    //console.log(example_result.toString());
    console.log(formation_ruleset_as_fol.toString());
    let final_result = standardizeVarNames(new Conjunction([example_result, formation_ruleset_as_fol]));
    //console.log(final_result.toString());
});
//# sourceMappingURL=main.js.map