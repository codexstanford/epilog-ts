var FailPriorityLevel;
(function (FailPriorityLevel) {
    FailPriorityLevel[FailPriorityLevel["Error"] = 0] = "Error";
    FailPriorityLevel[FailPriorityLevel["Warning"] = 1] = "Warning";
    FailPriorityLevel[FailPriorityLevel["Log"] = 2] = "Log";
})(FailPriorityLevel || (FailPriorityLevel = {}));
/*
 * testName: user's name for the test. Primarily for use in the test message.
 * testFunc: is the testing function to be run, and should return true iff the test passes.
 * failPriority: dictates what console printing function should be used on test failure.
 * verbose: dictates whether the function should print when the test is run.
 * customPrinter: allows the user to specify a custom printing function for when the test is run.
 *      Should accept the result of the test as input.
 *      If specified, the default printer will not run.
 *      If verbose is false, will not be called.
 *
 * runTest returns true iff the test passes, and prints whether the test passed or failed.
*/
function runTest(testName, testFunc, { failPriority = FailPriorityLevel.Error, verbose = true, customMsgPrinter = null }) {
    let testPassed = testFunc();
    // No need to print
    if (!verbose) {
        return testPassed;
    }
    // Use the specified custom test message printer
    if (customMsgPrinter !== null) {
        customMsgPrinter(testPassed);
        return testPassed;
    }
    // Default test message printer
    // Test passed
    if (testPassed) {
        console.log("TEST PASSED:", testName);
        return testPassed;
    }
    // Test failed
    let testFailedMessage = "TEST FAILED: " + testName;
    switch (failPriority) {
        case FailPriorityLevel.Error: {
            console.error(testFailedMessage);
            break;
        }
        case FailPriorityLevel.Warning: {
            console.warn(testFailedMessage);
            break;
        }
        case FailPriorityLevel.Log: {
            console.log(testFailedMessage);
            break;
        }
    }
    return testPassed;
}
export { runTest, FailPriorityLevel };
//# sourceMappingURL=testing.js.map