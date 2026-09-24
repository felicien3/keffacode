// Runs a submitted JavaScript function against test cases in a separate
// Node process with a hard timeout.
//
// SECURITY NOTE: a child process is isolation enough for a classroom or a
// demo, not for the public internet. Before you expose this, run the child
// inside a container (Docker, gVisor or Firecracker) with no network, a
// read-only filesystem, and memory/CPU limits. Keep the interface below the
// same and only the `spawn` call changes.
import { spawn } from 'node:child_process';

const TIMEOUT_MS = 2000;

const HARNESS = `
let payload = '';
process.stdin.on('data', (chunk) => { payload += chunk; });
process.stdin.on('end', () => {
  const { code, fnName, tests } = JSON.parse(payload);
  const results = [];
  try {
    const factory = new Function(code + '\\nreturn typeof ' + fnName + ' === "function" ? ' + fnName + ' : undefined;');
    const fn = factory();
    if (typeof fn !== 'function') {
      process.stdout.write(JSON.stringify({ status: 'error', message: 'No function named ' + fnName + ' was found.', results: [] }));
      return;
    }
    for (const test of tests) {
      try {
        const actual = fn(...test.args);
        const ok = JSON.stringify(actual) === JSON.stringify(test.expected);
        results.push({ id: test.id, is_sample: test.is_sample, passed: ok, actual: JSON.stringify(actual) });
      } catch (err) {
        results.push({ id: test.id, is_sample: test.is_sample, passed: false, actual: 'threw ' + err.message });
      }
    }
    const passed = results.filter((r) => r.passed).length;
    process.stdout.write(JSON.stringify({
      status: passed === tests.length ? 'passed' : 'failed',
      message: '',
      results,
    }));
  } catch (err) {
    process.stdout.write(JSON.stringify({ status: 'error', message: err.message, results: [] }));
  }
});
`;

export function runTests({ code, fnName, tests }) {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    const child = spawn(process.execPath, ['-e', HARNESS], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {},                       // no environment leaks into the sandbox
    });

    let out = '';
    let err = '';
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      resolve({
        status: 'error',
        message: `Timed out after ${TIMEOUT_MS}ms. Check for an infinite loop.`,
        results: [],
        runtimeMs: TIMEOUT_MS,
      });
    }, TIMEOUT_MS);

    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { err += d; });

    child.on('close', () => {
      clearTimeout(timer);
      const runtimeMs = Date.now() - startedAt;
      try {
        resolve({ ...JSON.parse(out), runtimeMs });
      } catch {
        resolve({ status: 'error', message: err.trim() || 'The code could not be run.', results: [], runtimeMs });
      }
    });

    child.stdin.end(JSON.stringify({ code, fnName, tests }));
  });
}
