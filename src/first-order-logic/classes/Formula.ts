// Note: Formula is recursively defined. Many classes that are formulae are composed of formulae. (e.g. Disjunction)

import { ERROR_LITERAL, Literal } from "../../epilog-ts/classes/Literal.js";
import { Negation } from "./Negation.js";
import { Conjunction } from "./Conjunction.js";
import { Disjunction } from "./Disjunction.js";
import { Implication } from "./Implication.js";
import { Biconditional } from "./Biconditional.js";
import { QuantifiedFormula } from "./QuantifiedFormula.js";


type Formula = Literal | Negation  | Conjunction | Disjunction | Implication | Biconditional | QuantifiedFormula;

const ERROR_FORMULA = ERROR_LITERAL;

export {
    Formula,

    ERROR_FORMULA
};