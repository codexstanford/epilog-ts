import { Symbol, Variable, CompoundTerm } from "./classes/Term.js";
import { Constructor } from "./classes/Constructor.js";
document.addEventListener("DOMContentLoaded", function () {
    console.log("TS is working, my guy.");
    console.log(read("p(a,X)"));
    let newVar = new Variable("_");
    console.log(newVar.name);
    let newSym = new Symbol("\"suspicious pred\"");
    console.log(newSym.toString());
    let newSym2 = new Symbol("test_");
    console.log(newSym2.toString());
    let newConstructor = new Constructor("f");
    let compoundTerm = new CompoundTerm(newConstructor, [newSym, newSym2]);
    console.log(compoundTerm.toString());
});
//# sourceMappingURL=main.js.map