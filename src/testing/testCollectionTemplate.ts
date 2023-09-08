// For use as a template when making a new collection of tests

// The src here is correct for the location of this file, but is will not be correct for most others. Adjust the dot navigation portion as necessary.
import { printTestingMessage_Start, runTest } from "./testing.js";

// Unit tests for {dir/here} files
function runTests() : void {
    // Call all tests implemented in this file
    runSubsetTests();

}

// A subcollection of tests, for a subset of the code tested by this file
function runSubsetTests() : void {
    printTestingMessage_Start("Subset");

    runTest("Example-success", () => {
        return true;
    },{});
}

/* uncomment in implemented version
export {
    runTests
}
*/