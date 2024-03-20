import { runTest, FailPriorityLevel } from "./testing.js";
import { runTests as runTests_EpilogTS_Classes } from "../epilog-ts-core/tests/class-tests.js";
import { runTests as runTests_EpilogJS_to_TS_Parsing } from "../epilog-ts-core/tests/epilog-js-to-ts-parse-tests.js";
import { runTests as runTests_Utils } from "../epilog-ts-core/tests/utils-tests.js";
import { runTests as runTests_FoL } from "../first-order-logic/tests/class-tests.js";
import { runTests as runTests_EpilogTS_to_FoL_Parsing } from "../epilog-ts-core/tests/epilog-ts-to-fol-parse-tests.js";
import { runTests as runTests_FoL_Transformations } from "../first-order-logic/tests/transformations-tests.js";
import { runTests as runTests_FoL_Utils } from "../first-order-logic/tests/utils-tests.js";
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
const TEST_COLLECTION_LIST = [
    {
        testSubjectName: "the testing functions",
        doRunTest: false,
        testCollectionRunner: runMetaTests
    },
    {
        testSubjectName: "Epilog-ts Classes",
        doRunTest: true,
        testCollectionRunner: runTests_EpilogTS_Classes
    },
    {
        testSubjectName: "epilog.js to Epilog-ts parsing",
        doRunTest: true,
        testCollectionRunner: runTests_EpilogJS_to_TS_Parsing
    },
    {
        testSubjectName: "Utils",
        doRunTest: true,
        testCollectionRunner: runTests_Utils
    },
    {
        testSubjectName: "FoL Classes",
        doRunTest: true,
        testCollectionRunner: runTests_FoL
    },
    {
        testSubjectName: "Epilog-ts to FoL parsing",
        doRunTest: true,
        testCollectionRunner: runTests_EpilogTS_to_FoL_Parsing
    },
    {
        testSubjectName: "FoL Transformations",
        doRunTest: true,
        testCollectionRunner: runTests_FoL_Transformations
    },
    {
        testSubjectName: "FoL Utils",
        doRunTest: true,
        testCollectionRunner: runTests_FoL_Utils
    },
];
function runAllTests() {
    for (const TEST_COLLECTION of TEST_COLLECTION_LIST) {
        if (!TEST_COLLECTION.doRunTest) {
            continue;
        }
        console.log("============= START Testing", TEST_COLLECTION.testSubjectName, "============= ");
        TEST_COLLECTION.testCollectionRunner();
        console.log("============= END Testing", TEST_COLLECTION.testSubjectName, "============= ");
    }
}
export { runAllTests };
//# sourceMappingURL=allTests.js.map