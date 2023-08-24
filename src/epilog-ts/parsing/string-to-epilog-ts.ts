
import { EpilogJSToTS } from "./epilog-js-to-epilog-ts.js"

import { Rule } from "../classes/Rule.js"

// For now, just go through EpilogJSToTS
namespace StrToTS { 
    
    export function parseRule(rule: string) : Rule {
        return EpilogJSToTS.parseRule(read(rule));
    }
}


export { StrToTS }