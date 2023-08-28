# containment-testing-ts
A TypeScript implemention of containment testing algorithms for use with epilog.js.


# Running the code
Note: The TypeScript compiler 'tsc' command must be installed in the command line. 

Python must also be installed.

1. Navigate to the root folder of the repo (i.e. the one containing index.html)
2. Open two terminal windows.
3. In the first window, run 'tsc -w'. This starts the TypeScript compiler in "watch" mode, which will recompile the code whenever you modify one of the .ts files in src/. (You will need to reload the webpage for your modifications to take effect.)
4. In the second window, run 'py .\localserver.py'. This starts the server on your local machine on port 8000. If this clashes with something else you are running, feel free to modify PORT in localserver.py to a free port.
5. In your browser, navigate to 'http://localhost:8000/index.html'.

## Specific to this branch: 
- When the page loads, the following text should render: "Text to test that rendering is okay".
- This branch contains tests that run on page load. You can see the results of the tests in the browser's JavaScript console. 
