require("sucrase/register");

const { formatRubricLabReport, runRubricLab } = require("../src/lib/rubricLab.ts");

const report = runRubricLab();

console.log(formatRubricLabReport(report));

if (!report.meetsGate) {
  process.exit(1);
}
