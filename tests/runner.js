const connectPC = require('../pc')
const connectDB = require('../db')

connectDB();
const args = process.argv.slice(2);

if (args.length !== 2) {
    console.error("Please provide both the test file name and the function name.");
    process.exit(1);
}

const testFile = args[0];
const testFunction = args[1];

const testModule = require(`./${testFile}`);

if (testModule[testFunction]) {
    testModule[testFunction]()
        .then((response) => console.log(response))
        .catch((error) => console.error(error));
} else {
    console.error(`Function '${testFunction}' not found in file '${testFile}'`);
}