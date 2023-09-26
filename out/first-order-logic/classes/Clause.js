import { ERROR_LITERAL, Literal } from "../../epilog-ts/classes/Literal.js";
// Conceptually a Disjunction, but imposes the following constraints
// its disjuncts must all be Literals
// its disjuncts are made unique w.r.t. toString (i.e. repeats will be excluded in the constructor)
// its disjuncts are sorted in ascending alphabetical order w.r.t. toString (i.e. the constructor will sort the list of Literals alphabetically)
class Clause {
    constructor(literals) {
        this.literalSet = new Set();
        this.literals = [];
        for (let formula of literals) {
            if (!(formula instanceof Literal)) {
                console.error("Clause must consist only of Literals, but the following Formula was passed to the constructor:", formula.toString());
                this.literals = [ERROR_LITERAL];
                this.literalSet = new Set([ERROR_LITERAL.toString()]);
                return;
            }
            // Ensure the literals are unique
            if (this.literalSet.has(formula.toString())) {
                continue;
            }
            this.literalSet.add(formula.toString());
            this.literals.push(formula);
        }
        // Sort the literals list
        this.literals = this.literals.sort((a, b) => {
            if (a.toString() === b.toString()) {
                return 0;
            }
            return a.toString() < b.toString() ? -1 : 1;
        });
    }
    getVars() {
        let varNameList = [];
        for (let lit of this.literals) {
            varNameList.push(...lit.getVars());
        }
        return new Set(varNameList);
    }
    // Computes whether the clause contains complementary Literals
    isTautology() {
        for (let i = 0; i < this.literals.length; i++) {
            let lit1Complement = Literal.complement(this.literals[i]);
            for (let j = 0; j < this.literals.length; j++) {
                if (i === j) {
                    continue;
                }
                if (lit1Complement.toString() === this.literals[j].toString()) {
                    return true;
                }
            }
        }
        return false;
    }
    toString() {
        if (this.literals.length === 0) {
            return "{}";
        }
        let str = "{";
        for (let literal of this.literals) {
            str += literal.toString() + ", ";
        }
        str = str.slice(0, -2);
        str += "}";
        return str;
    }
    static applySub(sub, clause) {
        let literalList = [];
        for (let literal of clause.literals) {
            literalList.push(Literal.applySub(sub, literal));
        }
        return new Clause(literalList);
    }
}
export { Clause };
//# sourceMappingURL=Clause.js.map