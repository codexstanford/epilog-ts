import { resolve } from "./resolution.js";
class ResolutionEngine {
    constructor() {
        this.proofLines = [];
        this.clauseStrSet = new Set();
    }
    // Simply adds the input clauses to the proof. Does not filter out e.g. tautologies and identical clauses.
    addProofLines(clauses) {
        for (let c of clauses) {
            this.proofLines.push(c);
            this.clauseStrSet.add(c.toString());
        }
    }
    // Runs the resolution procedure, returning true if the empty clause is derived, and false if it could not be derived.
    // Perform resolution until:
    // (i) the specified maximum amount of time has passed, at which point "timeout" will be returned.
    // (ii) the specified maximum number of resolutions has been performed, at which point "maxresolutions" will be returned
    // (iii) the empty clause is derived, at which point true will be returned.
    // (iv) no more clauses can be derived, at which point false will be returned.
    // Employs the following strategies:
    // Tautology elimination
    // Naive Identical Clause Elimination
    run({ msTimeout = null, maxResolutions = null, verbose = false }) {
        let msStartTime = Date.now();
        let numResolutions = 0;
        let slowPtr = 0;
        while (slowPtr < this.proofLines.length) {
            let fastPtr = 0;
            let slowPtrClause = this.proofLines[slowPtr];
            while (fastPtr <= slowPtr) {
                let fastPtrClause = this.proofLines[fastPtr];
                let resolvents = resolve(slowPtrClause, fastPtrClause);
                numResolutions++;
                // Check whether the empty clause has been derived, and filter out clauses according to our strategies.
                for (let r of resolvents) {
                    // Derived the empty clause! A successful refutation.
                    if (r.literals.length === 0) {
                        if (verbose) {
                            console.log("Time elapsed:", Date.now() - msStartTime, "milliseconds");
                            console.log("Resolutions Performed:", numResolutions);
                        }
                        return true;
                    }
                    // Exclude tautologies
                    if (r.isTautology()) {
                        //console.log("Tautology:", r.toString());
                        continue;
                    }
                    // Exclude identical clauses, naively
                    if (this.clauseStrSet.has(r.toString())) {
                        //console.log("Identical clause:", r.toString());
                        continue;
                    }
                    if (verbose) {
                        console.log(r.toString());
                    }
                    this.proofLines.push(r);
                    this.clauseStrSet.add(r.toString());
                }
                // Check that too much time has not elapsed
                if (msTimeout !== null && Date.now() - msStartTime > msTimeout) {
                    return "timeout";
                }
                // Check that we haven't reached the resolution limit
                if (maxResolutions !== null && numResolutions >= maxResolutions) {
                    return "maxresolutions";
                }
                fastPtr++;
            }
            slowPtr++;
        }
        // Failed to derive the empty clause.
        if (verbose) {
            console.log("Time elapsed:", Date.now() - msStartTime, "milliseconds");
            console.log("Resolutions Performed:", numResolutions);
        }
        return false;
    }
}
export { ResolutionEngine };
//# sourceMappingURL=resolution-engine.js.map