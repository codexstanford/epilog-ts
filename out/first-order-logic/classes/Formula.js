// Note: Formula is recursively defined. Many classes that are formulae are composed of formulae. (e.g. Disjunction)
import { ERROR_LITERAL, Literal } from "../../epilog-ts/classes/Literal.js";
import { Atom } from "../../epilog-ts/classes/Atom.js";
import { Predicate } from "../../epilog-ts/classes/Predicate.js";
const ERROR_FORMULA = ERROR_LITERAL;
const TRUE_LITERAL = new Literal(new Atom(new Predicate('true'), []), false);
export { ERROR_FORMULA, TRUE_LITERAL };
//# sourceMappingURL=Formula.js.map