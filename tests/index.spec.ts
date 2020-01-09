import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';

describe('run', () => {
  const indexJsPath = path.join(__dirname, '..', 'lib', 'index.js');

  test('with json variables', () => {
    process.env['INPUT_VARIABLES'] = '{ "var1": "val1", "var2": "val2", "camelCase": "val3" }';
    process.env['INPUT_FORMAT'] = 'json';
    process.env['INPUT_WHITELIST'] = 'var2,camelCase,var4';
    const options: cp.ExecSyncOptions = {
      env: process.env,
    };
    console.log(cp.execSync(`node ${indexJsPath}`, options).toString());
  });

  test('with github payload string variables', () => {
    process.env['INPUT_VARIABLES'] = '"var1":"val1","var2":"val2","camelCase":"val3"';
    process.env['INPUT_FORMAT'] = 'github';
    process.env['INPUT_WHITELIST'] = 'var2,camelCase,var4';
    const options: cp.ExecSyncOptions = {
      env: process.env,
    };
    console.log(cp.execSync(`node ${indexJsPath}`, options).toString());
  });

  test('with yaml required variables', () => {
    process.env['INPUT_VARIABLES'] = `
    data:
      var1: val1
      var2: val2
      camelCase: val3
      more:
        camelCase: val4
    `;
    process.env['INPUT_FORMAT'] = 'yaml';
    process.env['INPUT_WHITELIST'] = 'var2,camelCase,var4';
    const options: cp.ExecSyncOptions = {
      env: process.env,
    };
    console.log(cp.execSync(`node ${indexJsPath}`, options).toString());
  });
});
