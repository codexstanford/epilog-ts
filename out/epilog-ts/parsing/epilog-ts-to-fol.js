import { ERROR_FORMULA } from "../../first-order-logic/classes/Formula.js";
var EpilogTSToFOL;
(function (EpilogTSToFOL) {
    // Relation in head should only be defined by a single rule - will not be correct if relation is defined via multiple rules  
    function parseSingleRule(epilogTSRule) {
        // Standardize the variables in the rule
        let universalVars = epilogTSRule.head.getVars();
        let existentialVars = epilogTSRule.getExistentialVars();
        return ERROR_FORMULA;
    }
})(EpilogTSToFOL || (EpilogTSToFOL = {}));
//# sourceMappingURL=epilog-ts-to-fol.js.map