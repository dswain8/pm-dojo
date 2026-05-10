require("sucrase/register");

const {
  formatWorkflowIterationReport,
  runWorkflowIterations,
} = require("../src/lib/rubricLab.ts");

const iterations = runWorkflowIterations();

console.log(formatWorkflowIterationReport(iterations));

if (iterations.some((iteration) => !iteration.pass)) {
  process.exit(1);
}
