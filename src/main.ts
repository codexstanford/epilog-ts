import { Symbol, Variable, CompoundTerm, Term } from "./classes/Term.js";

import { Constructor } from "./classes/Constructor.js";

import { Predicate } from "./classes/Predicate.js";

import { Atom } from "./classes/Atom.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("TS is working, my guy.");
    console.log(read("p(a,X)"));

    let newVar : Variable = new Variable("_");
    console.log(newVar.name);

    let newPred : Predicate = new Predicate("\"suspicious pred\"");
    let newPred2 : Predicate = new Predicate("r1");
    let newSym : Symbol = new Symbol("\"suspicious symbol\"");
    console.log(newSym.toString());
    let newSym2 : Symbol = new Symbol("test_");
    console.log(newSym2.toString());

    let newConstructor = new Constructor("f");

    let compoundTerm1 : CompoundTerm = new CompoundTerm(newConstructor, [newSym, newSym2]);
    console.log(compoundTerm1.isGround());

    let compoundTerm2 : CompoundTerm = new CompoundTerm(newConstructor, [newSym, newVar]);
    console.log(compoundTerm2.isGround());

    let compoundTerm3 : CompoundTerm = new CompoundTerm(newConstructor, []);
    console.log(compoundTerm3.isGround());

    let newAtom : Atom = new Atom(newPred, []);
    let newAtom2 : Atom = new Atom(newPred2, [newSym, newVar]);
    let newAtom3 : Atom = new Atom(newPred2, [newSym2]);

    console.log(newAtom.toString(), " ", newAtom.isGround());
    console.log(newAtom2.toString(), " ", newAtom2.isGround());
    console.log(newAtom3.toString(), " ", newAtom3.isGround());
});