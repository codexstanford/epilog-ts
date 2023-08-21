import { isEpilogConstant } from "../utils/string-utils.js";
class Predicate {
    constructor(name) {
        if (isEpilogConstant(name)) {
            this.name = name;
            return;
        }
        console.error("Invalid predicate name: ", name);
        this.name = "error";
    }
    toString() {
        return this.name;
    }
}
export { Predicate };
//# sourceMappingURL=Predicate.js.map