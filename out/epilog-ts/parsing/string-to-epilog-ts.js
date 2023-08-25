import { EpilogJSToTS } from "./epilog-js-to-epilog-ts.js";
// For now, just go through EpilogJSToTS
var StrToTS;
(function (StrToTS) {
    function parseRule(rule) {
        return EpilogJSToTS.parseRule(read(rule));
    }
    StrToTS.parseRule = parseRule;
})(StrToTS || (StrToTS = {}));
export { StrToTS };
//# sourceMappingURL=string-to-epilog-ts.js.map