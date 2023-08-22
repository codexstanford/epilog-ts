import { runTest, FailPriorityLevel } from "./testing.js";
import { runTests as runTests_EpilogTS_Classes } from "../epilog-ts/tests/class-tests.js";
import { runTests as runTests_EpilogTS_Parsing } from "../epilog-ts/tests/parse-tests.js";
// Test the testing function
function runMetaTests() {
    // Should print via console.error
    runTest("test-fail-test1", () => {
        return false;
    }, {});
    // Should print via console.warn
    runTest("test-fail-test2", () => {
        return false;
    }, {
        failPriority: FailPriorityLevel.Warning,
    });
    // Should print via console.log
    runTest("test-fail-test3", () => {
        return false;
    }, {
        failPriority: FailPriorityLevel.Log,
    });
    // Should print via console.log
    runTest("test-success-test1", () => {
        return true;
    }, {});
    // Should print via console.log
    runTest("test-success-test2", () => {
        return true;
    }, { customMsgPrinter: (testResult) => {
            console.log("Custom message:", testResult);
            return;
        }
    });
    // Nothing should print
    runTest("test-nonverbose-success", () => {
        return true;
    }, {
        verbose: false,
    });
    // Nothing should print
    runTest("test-nonverbose-fail", () => {
        return false;
    }, {
        verbose: false,
    });
}
function runAllTests() {
    const DO_META_TESTS = false;
    if (DO_META_TESTS) {
        console.log("============= START Testing the testing functions ============= ");
        runMetaTests();
        console.log("============= END Testing the testing functions ============= ");
    }
    const DO_EPILOG_TS_CLASS_TESTS = true;
    if (DO_EPILOG_TS_CLASS_TESTS) {
        console.log("============= START Testing Epilog-ts classes ============= ");
        runTests_EpilogTS_Classes();
        console.log("============= END Testing Epilog-ts classes ============= ");
    }
    const DO_EPILOG_JS_TO_TS_TESTS = true;
    if (DO_EPILOG_JS_TO_TS_TESTS) {
        console.log("============= START Testing epilog.js to Epilog-ts parsing ============= ");
        runTests_EpilogTS_Parsing();
        console.log("============= END Testing epilog.js to Epilog-ts parsing ============= ");
    }
}
export { runAllTests };
//# sourceMappingURL=allTests.js.map