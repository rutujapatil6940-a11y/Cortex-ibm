require("dotenv").config();

const fs = require("fs/promises");
const path = require("path");
const { generateDocumentation } = require("./services/bobService");

async function main() {
    const workspace = path.resolve(process.argv[2] || __dirname);
    const outputPath = path.join(__dirname, "test-documentation.json");

    console.log(`Sending workspace to IBM Bob: ${workspace}`);
    const analysis = await generateDocumentation(workspace);
    await fs.writeFile(outputPath, JSON.stringify(analysis, null, 2), "utf8");

    console.log(`IBM Bob response saved to: ${outputPath}`);
    console.log(JSON.stringify(analysis, null, 2));
}

main().catch((error) => {
    console.error(`IBM Bob test failed: ${error.message}`);
    process.exitCode = 1;
});
