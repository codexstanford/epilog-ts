import { Symbol, Variable, CompoundTerm, Term } from "./classes/Term.js";

import { Constructor } from "./classes/Constructor.js";


document.addEventListener("DOMContentLoaded", function () {
    console.log("TS is working, my guy.");
    console.log(read("p(a,X)"));

    let newVar : Variable = new Variable("_");
    console.log(newVar.name);

    let newSym : Symbol = new Symbol("\"suspicious pred\"");
    console.log(newSym.toString());
    let newSym2 : Symbol = new Symbol("test_");
    console.log(newSym2.toString());

    let newConstructor = new Constructor("f");

    let compoundTerm : CompoundTerm = new CompoundTerm(newConstructor, [newSym, newSym2]);
    console.log(compoundTerm.toString());
});