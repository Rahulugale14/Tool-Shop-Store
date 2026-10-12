const { spawnSync } = require('node:child_process');
const { rmSync } = require('node:fs');
const path = require('node:path');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const options = {
  shell: process.platform === 'win32',
  stdio: 'inherit',
};

rmSync(path.join(process.cwd(), 'allure-results'), { force: true, recursive: true });

const testResult = spawnSync(
  npmCommand,
  ['run', 'test:playwright', '--', ...process.argv.slice(2)],
  options,
);
if (testResult.error) {
  console.error(`Failed to run Playwright: ${testResult.error.message}`);
}

const reportResult = spawnSync(npmCommand, ['run', 'report:allure'], options);
if (reportResult.error) {
  console.error(`Failed to generate the Allure report: ${reportResult.error.message}`);
}

const exitCode = (result) => {
  if (result.error || result.signal) return 1;
  return result.status ?? 1;
};

const testExitCode = exitCode(testResult);
const reportExitCode = exitCode(reportResult);
process.exitCode = testExitCode || reportExitCode;
