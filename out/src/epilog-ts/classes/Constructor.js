import { isEpilogConstant } from "../utils/string-utils.js";
class Constructor {
    constructor(name) {
        if (isEpilogConstant(name)) {
            this.name = name;
            return;
        }
        console.error("Invalid constructor name: ", name);
        this.name = "error";
    }
    toString() {
        return this.name;
    }
}
export { Constructor };
//# sourceMappingURL=Constructor.js.map