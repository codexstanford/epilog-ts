import { runTest, FailPriorityLevel } from "./testing.js";

import { runTests as runTests_EpilogTS_Classes } from "../epilog-ts/tests/class-tests.js";


// Test the testing function
function runMetaTests() {
    // Should print via console.error
    runTest("test-fail-test1", () => {
        return false;
    },{});
    // Should print via console.warn
    runTest("test-fail-test2", () => {
        return false;
    }, 
    {
        failPriority: FailPriorityLevel.Warning,
    });
    // Should print via console.log
    runTest("test-fail-test3", () => {
        return false;
    },
    {
        failPriority: FailPriorityLevel.Log,
    });
    
    // Should print via console.log
    runTest("test-success-test1", () => {
        return true;
    },{});
    // Should print via console.log
    runTest("test-success-test2", () => {
        return true;
    },
    {   customMsgPrinter: (testResult: boolean) => {
            console.log("Custom message:",testResult);
            return;
        }
    });
    // Nothing should print
    runTest("test-nonverbose-success", () => {
        return true;
    },
    {
        verbose: false,
    });
    // Nothing should print
    runTest("test-nonverbose-fail", () => {
        return false;
    },
    {
        verbose: false,
    });
}


function runAllTests() {
    const DO_META_TESTS = true;

    if (DO_META_TESTS){
        console.log("============= START Testing the testing functions ============= ");
        runMetaTests();
        console.log("============= END Testing the testing functions ============= ");
    }
    
}

export {
    runAllTests
}