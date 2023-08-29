import { runAllTests } from "./testing/allTests.js";
document.addEventListener("DOMContentLoaded", function () {
    runAllTests();
    /*let atom1: Atom = new Atom(new Predicate("p"), []);
    let atom2: Atom = new Atom(new Predicate("q"), []);

    let d1: Disjunction = new Disjunction([new Literal(atom1, false), new Literal(atom2, true)]);

    let d2: Conjunction = new Conjunction([new Literal(atom1, true), new Literal(atom2, false)]);


    let c: Conjunction = new Conjunction([d1, d2]);

    let c2 : Conjunction = new Conjunction([]);
    let d3 : Disjunction = new Disjunction([]);

    let n1: Negation = new Negation(c);
    console.log(n1.toString());

    let n2: Negation = new Negation(new Literal(atom1, false));

    let i: Implication = new Implication(n2, d2);

    console.log(i.toString());

    let b: Biconditional = new Biconditional(i, c);
    console.log(b.toString());

    let u: QuantifiedFormula = new QuantifiedFormula(Quantifier.Universal, new Variable("X"), b);

    let e: QuantifiedFormula = new QuantifiedFormula(Quantifier.Existential, new Variable("_"), n1);

    console.log(u.toString());
    console.log(e.toString());*/
});
//# sourceMappingURL=main.js.map