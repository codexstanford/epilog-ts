import { Query } from "../epilog-ts/classes/Query.js";


interface ContainmentTester {
    // Determine whether q1 is contained within q2
    containedWithin(q1: Query, q2: Query) : boolean;
}

export {
    ContainmentTester
}